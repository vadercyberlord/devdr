import mongoose from "mongoose";

const connectToDB = async ()=>{
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
              "\n MONGO_URI dossent exist in the dotenv file, please check the token"
            );
          }
      
          // specifying a database name
        await mongoose.connect(`${process.env.MONGO_URI}/terramapx`);

        if (process.env.NODE_ENV !== 'production') {
          console.info("MongoDB connected successfully.");
        }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
          console.error('\n Error occured while connecting to DataBase', error);
      }
     
        process.exit(1);
    }
}

export default connectToDB;