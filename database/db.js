 import mongoose from "mongoose";
 
 
 export const Connection = async(username, password) => {

  const URL = `mongodb+srv://${username}:${password}@eccomarce-website.xyjkc9y.mongodb.net/?retryWrites=true&w=majority&appName=eccomarce-website`;
  try{
    await mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser:true });
    console.log('DataBase connected successfully');
 
  } catch (error){
    console.log('Error while connecting with the database ', error.message);
  }
 }

 export default Connection;