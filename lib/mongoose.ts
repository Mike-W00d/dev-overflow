import { Eclipse } from "lucide-react";
import mongoose, { Mongoose } from "mongoose";
import { promise } from "zod";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is not defined");
}
/// create a cache object to store the connection and promise so that we can reuse the connection without creating a new one.
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

/// if cached doesn't exist setting mongoose connection = to null and promise = null.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// create a function to connect to the database
const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
      })
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB", error);
        throw error;
      });
  }
  cached.conn = await cached.promise;

  return cached.conn;
};
// exporting the function to use throughout the application
export default dbConnect;
