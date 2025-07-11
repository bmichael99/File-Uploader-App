const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()


const projectURL = process.env.SUPABASE_PROJECT_URL;
const supabaseApiKey = process.env.SUPERBASE_API_KEY;
const supabase = createClient(projectURL, supabaseApiKey);

exports.uploadFile = async (bucketName, userID, fileBuffer, fileAbout) => {

const { data, error } = await supabase.storage
  .from(bucketName)
  .upload(`${userID}/${fileAbout.originalname}`, fileBuffer,{
    contentType: fileAbout.mimetype,
    upsert: false,
  })
  if(error){
    console.error(error);
  }else{
    console.log("sucess");
    console.log(data);
    return {path: `${userID}/${fileAbout.originalname}`, data: data, error: error};
  }

}

exports.downloadFile = async (bucketName,filePath) => {
  const {data,error} = await supabase.storage.from(bucketName).download(filePath);
  
  return {data, error};

}

exports.deleteFile = async (bucketName,filePath) => {
  const {data,error} = await supabase.storage.from(bucketName).remove(filePath);
  
  return {data, error};

}