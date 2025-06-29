const { body, validationResult } = require("express-validator");
const db = require("../db/queries")
const passport = require("passport");
const bcrypt = require("bcryptjs")
const { isAuth } = require("../controllers/authMiddleware");
require('dotenv').config()

exports.showHomePage = (req,res) => {
  res.render('index', {title: 'Express Template!'});
};

exports.SignUpPost = async (req,res, next) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.first_name, req.body.last_name, req.body.username,hashedPassword);
    res.redirect("/");
  }
  catch(err){
    return next(err);
  }
};

exports.LogInPost = (req,res,next) => {
    passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
    })(req, res, next);
};