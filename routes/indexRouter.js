const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const { isAuth } = require("../controllers/authMiddleware");
const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })


indexRouter.get("/", indexController.showHomePage);
indexRouter.get("/sign-up", indexController.showSignUp);
indexRouter.post("/sign-up", indexController.SignUpPost);
indexRouter.post("/log-in", indexController.LogInPost);
indexRouter.get("/log-out", indexController.LogOutGet);

indexRouter.get("/create-folder", indexController.CreateFolderGet);
indexRouter.post("/create-folder", indexController.CreateFolderPost);

indexRouter.post("/stats", upload.single('uploaded_file'), indexController.uploadPost);

indexRouter.post("/delete-file/:fileId", isAuth, indexController.deleteFile);
indexRouter.post("/delete-folder/:folderId", isAuth, indexController.deleteFolder);


module.exports = indexRouter;


