import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "\n MONGO_URI dossent exist in the dotenv file, please check the token"
      );
    }
    // specifying a database name
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    // if (process.env.NODE_ENV !== 'production') {
    //   console.info("MongoDB connected successfully.");
    // }
  } catch (error) {
    // if (process.env.NODE_ENV !== "production") {
    //   console.error("\n Error occured while connecting to DataBase", error);
    // }
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
