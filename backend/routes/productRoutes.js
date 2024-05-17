const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getUserProfile, getImage } = require('../controllers/userController');



// Create a new product
router.post('/createProducts', verifyToken, createProduct);

// Get all products
router.get('/products', verifyToken, getAllProducts);

// Get a specific product by ID
router.get('/productById/:id', verifyToken, getProductById);

// Update a product 
router.put('/updateProduct/:id', verifyToken, updateProduct);

// Delete a product
router.delete('/deleteProducts/:id', verifyToken, deleteProduct);

// Search products
router.get('/search', verifyToken, searchProducts);

module.exports = router;
