import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected!")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/Huso`);
  } catch (error) {
    console.log(error.massage);
  }
};
export default connectDB;
