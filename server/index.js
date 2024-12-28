import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

//env configuration
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("🔴 Database connection failed", error);
  });
