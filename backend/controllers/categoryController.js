const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const fs = require('fs');
const path = require('path');

// Function to create a new category

const createCategory = async (req, res) => {
  try {
    const { categoryname } = req.body;
    const createdBy = req.user.id

    const result = await sequelize.query(
      'INSERT INTO category (categoryname, createdBy) VALUES (?, ?)',
      {
        replacements: [categoryname, createdBy],
        type: QueryTypes.INSERT
      }
    );

    res.json({ message: 'Category created!', id: result[0] });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get all categories
const getAllCategories = async (req, res) => {

  try {
    
  const userRole  = req.user.userRole
  console.log(userRole)

  if(userRole != 'Admin'){
    return res.status(401).json({ error: 'Unauthorized' });
  }

    const categories = await sequelize.query(
      'SELECT * FROM category',
      { type: QueryTypes.SELECT }
    );

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get a specific category by ID

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
 
    const category = await sequelize.query(
      'SELECT * FROM categories WHERE id = ?',
      { replacements: [categoryId], type: QueryTypes.SELECT }
    );
    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to update a category

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { categoryname } = req.body;

    await sequelize.query(
      'UPDATE categories SET categoryname = ? WHERE id = ?',
      { replacements: [categoryname, categoryId], type: QueryTypes.UPDATE }
    );
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to delete a category

const deleteCategory = async (req, res) => {


  const categoryId = req.params.id;
  const createdBy = req.user.id;

  try {

    const category = await sequelize.query(
      `SELECT * FROM category WHERE id = :categoryId`,
      {
        replacements: { categoryId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
 
    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found!" });
    }
 
    if (category[0].createdBy !== createdBy) {
      return res.status(403).json({ message: "Not Authorized" });
    }
 
    await sequelize.query(
      `DELETE FROM category WHERE id = :categoryId`,
      {
        replacements: { categoryId },
        type: sequelize.QueryTypes.DELETE,
      }
    );
 
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory}