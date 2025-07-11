const prisma = require("./prisma");

async function createUser(first_name,username,password){
  return await prisma.user.create({
    data: {
      first_name: first_name,
      username: username,
      password: password,
    }
  });
}

async function getUserByUsername(username){
  const user = await prisma.user.findUnique({
    where: {username: username}
  });

  return user;
}

async function getUserById(id){
  const user = await prisma.user.findUnique({
    where: {id: id}
  });

  return user;
}

async function createFileInFolder(name,originalName,mimeType,size,url,folderId,userId){
  return await prisma.file.create({
    data: {name, originalName, mimeType, size, url, folderId, userId}
  });
}

async function createFile(name,originalName,mimeType,size,url,userId){
  return await prisma.file.create({
    data: {name, originalName, mimeType, size, url, userId}
  });
}

async function createFolder(name,userId){
  return await prisma.folder.create({
    data: {name, userId}
  });
}

async function getFoldersByUser(userId){
  const folders = await prisma.folder.findMany({
    where: {userId}
  });

  return folders;
}

async function getFolderbyFolderId(folderId){
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    }
  });

  return folder;
}

async function getFilesByUser(userId){
  const files = await prisma.file.findMany({
    where: {
      userId,
      folderId: null,
    }
  });

  return files;
}

async function getFilebyFileId(fileId){
  const file = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
    }
  });

  return file;
}

async function getFilesByFolder(folderId,userId){
  const files = await prisma.file.findMany({
    where: {folderId: Number(folderId), userId}
  });

  return files;
}

async function deleteFileById(fileId){
  return await prisma.file.delete({
    where: {id: Number(fileId)}
  });
}

async function deleteFolderById(folderId){
  return await prisma.folder.delete({
    where: {id: Number(folderId)}
  });
}



module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  createFile,
  createFileInFolder,
  createFolder,
  getFoldersByUser,
  getFilesByUser,
  getFilesByFolder,
  deleteFileById,
  getFilebyFileId,
  deleteFolderById,
  getFolderbyFolderId,
};