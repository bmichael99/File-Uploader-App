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
  console.log(user);

  return user;
}


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
};