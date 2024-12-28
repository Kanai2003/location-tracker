import mongoose from "mongoose";
import pkg from "pg";

const { Pool } = pkg;

export const pgPoll = new Pool({
  user: "kanailal",
  password: "kanai@2003",
  database: "mydatabase",
  host: "postgres",
  port: 5432,
});

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("🚀 MongoDB connected"))
    .catch((error) => console.log("🔴 MongoDB connection error: ", error));

  pgPoll
    .query(
      `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user'
      );`,
    )
    .then(() => console.log("🚀 Postgres connected"))
    .catch((error) => console.log("🔴 Postgres connection error: ", error));
};

export default connectDB;
