const express = require("express");
const router = express.Router();
const {getCategoryById, getCategory, createCategory, getAllCategories, updateCategory, deleteCategory} = require("../controllers/category");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//create
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

//read 
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory);



module.exports = router;