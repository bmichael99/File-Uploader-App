const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const { isAuth } = require("../controllers/authMiddleware");
const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })


indexRouter.get("/", indexController.showHomePage);
indexRouter.get("/sign-up", indexController.showSignUp);
indexRouter.get("/log-in", indexController.showLogIn);
indexRouter.post("/sign-up", indexController.SignUpPost);
indexRouter.post("/log-in", indexController.LogInPost);
indexRouter.get("/log-out", indexController.LogOutGet);
indexRouter.get("/files", isAuth, indexController.showFileDashboard);
indexRouter.get("/file/:fileId", isAuth, indexController.showFileInfo);

indexRouter.post("/file/:fileId/link", isAuth, indexController.createShareLink);
indexRouter.get("/share/:linkId", indexController.getSharedFile)
indexRouter.get("/download-file/:fileId/:linkId", indexController.downloadSharedFile);

indexRouter.post("/upload-file", upload.single('uploaded_file'), indexController.uploadPost);
indexRouter.post("/upload-file/:folderId", upload.single('uploaded_file'), indexController.uploadPost);
indexRouter.get("/download-file/:fileId", isAuth, indexController.downloadFile);
indexRouter.post("/delete-file/:fileId", isAuth, indexController.deleteFile);
indexRouter.post("/delete-file/:fileId/:folderId", isAuth, indexController.deleteFile);

indexRouter.get("/create-folder", isAuth, indexController.CreateFolderGet);
indexRouter.post("/create-folder", isAuth, indexController.CreateFolderPost);
indexRouter.post("/delete-folder/:folderId", isAuth, indexController.deleteFolder);
indexRouter.get("/folder/:folderId", isAuth, indexController.getFolder);


module.exports = indexRouter;


