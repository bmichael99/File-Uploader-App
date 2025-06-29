exports.isAuth = (req,res,next) => {
  if (req.isAuthenticated()){
    next();
  } else {
    res.redirect("/");
  }
}

exports.isAdmin = (req,res,next) => {

}