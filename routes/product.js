const express = require("express");
const router = express.Router();
const {getProductById,
       getProduct,
       photo,
       createProduct,
       getAllProducts,
       updateProduct,
       removeProduct,
       getAllUniqueCategories} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//params
router.param("productId", getProductById);
router.param("userId", getUserById);

//create
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//read
router.get("/products", getAllProducts);//listing route
router.get("/product/:productId", getProduct);
//This is performance optimization and it can be understood when we will be in the frontend
router.get("/product/photo/:productId", photo);

//update
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//delete
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, removeProduct);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;