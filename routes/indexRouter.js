const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const { isAuth } = require("../controllers/authMiddleware");


indexRouter.get("/", indexController.showHomePage);
indexRouter.get("/sign-up", indexController.showSignUp);
indexRouter.post("/sign-up", indexController.SignUpPost);
indexRouter.post("/log-in", indexController.LogInPost);
indexRouter.get("/log-out", indexController.LogOutGet);



module.exports = indexRouter;


