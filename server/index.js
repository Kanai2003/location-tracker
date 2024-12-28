import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { flushLocationBatch } from "./controllers/locationController.js";

dotenv.config({
  path: "./.env",
});

const FLUSH_INTERVAL = 60000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🟢 Database connected");

    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port: ${process.env.PORT || 8000}`);
    });

    const intervalId = setInterval(async () => {
      try {
        await flushLocationBatch();
      } catch (error) {
        console.error(">>>>>🔴 Error executing flushLocationBatch:", error);
      }
    }, FLUSH_INTERVAL);

    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down server...");
      clearInterval(intervalId);
      server.close();
      await connectDB.disconnect();
      console.log("🔴 Server shut down");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n🛑 Shutting down server...");
      clearInterval(intervalId);
      server.close();
      await connectDB.disconnect();
      console.log("🔴 Server shut down");
      process.exit(0);
    });
  } catch (error) {
    console.error("🔴 Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
