const prisma = require("./prisma");

async function createUser(first_name,username,password){
  try{
    return await prisma.user.create({
    data: {
      first_name: first_name,
      username: username,
      password: password,
    }
  });
  } catch(err){
    throw(err);
  }
  
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

async function getFolderWithFilesByFolderId(folderId){
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
    include: {
      files: true,
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
  try{
    const file = await prisma.file.findUnique({
      where: {
      id: Number(fileId),

      }
    });

    return file;
  } catch(err){
    throw err;
  }
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

async function createLink(fileId,linkId,expiresAt){
  try{
    return await prisma.link.create({
      data: {id:linkId, fileId, expiresAt}
    })
  }catch(err){
    throw err;
  }
}

async function getFileByLinkId(fileId){
  try{
    return await prisma.link.findUnique({
    where: {id: fileId},
    include: {
      file: true,
    }
  })
  } catch(err){
    throw err;
  }
  
}

async function getLinksByFileId(fileId){
  try{
    return await prisma.link.findMany({
    where: {id: fileId}
  })
  } catch(err){
    throw err;
  }
  
}

async function deleteLink(linkId){
  try{
    return await prisma.link.delete({
    where: {id: linkId}
  })
  } catch(err){
    throw err;
  }
}

async function getLinkByLinkId(linkId){
  try{
    return await prisma.link.findUnique({
    where: {id: linkId}
  })
  } catch(err){
    throw err;
  }
}

async function getFileWithLinksbyFileId(fileId){
  try{
    const file = await prisma.file.findUnique({
      where: {
      id: Number(fileId),
      },
      include:{
        links: true,
      }
    });
    return file;
  } catch(err){
    throw err;
  }
}

async function deleteLinkByLinkId(linkId){
  try{
    const link = await prisma.link.delete({
      where: {
      id: linkId,
      }
    });
    return link;
  } catch(err){
    throw err;
  }
}

async function getFileCountByUserId(userId){
  try{
    const fileCount = await prisma.file.count({
    where: {
      userId
    }
  })
  return fileCount;
  } catch(err){
    throw err;
  }
}

async function getFolderCountByUserId(userId){
  try {
    const folderCount = await prisma.folder.count({
      where: {
        userId
      }
    })
    return folderCount;
  } catch (err) {
    throw err;
  }
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
  createLink,
  getLinksByFileId,
  getFileByLinkId,
  deleteLink,
  getLinkByLinkId,
  getFileWithLinksbyFileId,
  deleteLinkByLinkId,
  getFileCountByUserId,
  getFolderCountByUserId,
  getFolderWithFilesByFolderId,
};