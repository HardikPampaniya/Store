const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getUserProfile, getImage } = userController;
const fs = require('fs');
const path = require('path');


//create product
const createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, price } = req.body;
    const images = req.files ? Array.from(Object.values(req.files).flat()) : [];
    const createdBy = req.user.id

    const dirExists = fs.existsSync(`public/assets/`);
    if (!dirExists) {
      fs.mkdirSync(`public/assets/`, { recursive: true });
    }

    // Array to store paths of uploaded images
    let imagePaths = [];

    // Upload each image and store its path
    for (const image of images) {
      if (!image || !image.name) {
        throw new Error("Image or image name is undefined");
      }

      const savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`;

      // Move the file to the destination
      await new Promise((resolve, reject) => {
        image.mv(path.join(__dirname, ".." + savePath), (err) => {
          if (err) {
            reject(new Error("Error in uploading"));
          } else {
            imagePaths.push(savePath);
            resolve();
          }
        });
      });
    }

    const result = await sequelize.query(
      'INSERT INTO product (name, description, categoryId, price, createdBy, images) VALUES (?, ?, ?, ?, ?,?)',
      {
        replacements: [name, description, categoryId, price, createdBy, imagePaths.join(',')],
        type: QueryTypes.INSERT
      }
    );

    res.json({ message: 'Product created!', id: result[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// all products
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const products = await sequelize.query(
      `SELECT
      p.id,
      p.name,
      p.description,
      c.categoryName AS category_name,
      p.price,
      p.images
    FROM
      product AS p
      JOIN category AS c ON p.categoryId = c.id
    LIMIT ${pageSize}
    OFFSET ${offset};`,
      { type: QueryTypes.SELECT }
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get a specific product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const product = await sequelize.query(
      'SELECT * FROM product WHERE id = ?',
      { replacements: [productId], type: QueryTypes.SELECT }
    );
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, categoryId, price } = req.body;

    // flat is used for merging an array of files into a single array
    const images = req.files ? Array.from(Object.values(req.files).flat()) : [];

    
    const dirExists = fs.existsSync(`public/assets/`);
    if (!dirExists) {
      fs.mkdirSync(`public/assets/`, { recursive: true });
    }

    let imagePaths = [];

    for (const image of images) {
      if (!image || !image.name) {
        throw new Error("Image or image name is undefined");
      }

      const savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`;

      // Move the file to the destination
      await new Promise((resolve, reject) => {
        image.mv(path.join(__dirname, ".." + savePath), (err) => {
          if (err) {
            reject(new Error("Error in uploading"));
          } else {
            imagePaths.push(savePath);
            resolve();
          }
        });
      });
    }

    await sequelize.query(
      'UPDATE product SET name = ?, description = ?, categoryId = ?, price = ?, images = ? WHERE id = ?',
      { replacements: [name, description, categoryId, price, imagePaths.join(','), productId] }
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {

    const productId = req.params.id;
    const userId = req.user.id;

      const product = await sequelize.query(
      `SELECT * FROM product WHERE id = :productId AND createdBy = :userId`,
      {
        replacements: { productId, userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
 
    if (product.length === 0) {
      return res.status(404).json({ message: "product not found!" });
    }
 
    if (product[0].createdBy !== userId) {
      return res.status(403).json({ message: "Not Authorized" });
    }
 
    await sequelize.query(
      `DELETE FROM product WHERE id = :productId`,
      {
        replacements: { productId },
        type: sequelize.QueryTypes.DELETE,
      }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//search
const searchProducts = async (req, res) => {
  try {

    const { name } = req.query;
    console.log(name);

    if (!name) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await sequelize.query(
      `SELECT p.*, c.categoryName AS categoryName
       FROM product p
       LEFT JOIN category c ON p.categoryId = c.id
       WHERE LOWER(p.name) LIKE :query
         OR LOWER(p.description) LIKE :query
         OR CAST(p.categoryId AS CHAR) LIKE :query
         OR CAST(p.price AS CHAR) LIKE :query`,
      {
        replacements: { query: `%${name.toLowerCase()}%` }, 
        type: QueryTypes.SELECT,
      }
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts };