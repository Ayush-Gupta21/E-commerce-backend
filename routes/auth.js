var express = require("express");
var router = express.Router();
const {check, validationResult} = require("express-validator");
const {signout, signup, signin, isSignedIn} = require("../controllers/auth");

router.post(
    "/signup",
    [
        check("name").isLength({min:3}).withMessage("Name should be minimum 3 chars long"),
        check("email").isEmail().withMessage("Email is required"),
        check("password").isLength({min:3}).withMessage("Password should be at least 3 char")
    ], 
    signup
);

router.post(
    "/signin",
    [
        check("email").isEmail().withMessage("Email is required"),
        check("password").isLength({min:3}).withMessage("password is required")
    ], 
    signin
);

router.get("/signout", signout);



module.exports = router;