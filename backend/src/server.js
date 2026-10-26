import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import { startStaleOrderJob } from './jobs/cancel-stale-orders.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.getConnection();
    console.log("MySql server is connected.");
    startStaleOrderJob();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("MySql connection error : " , error.message)
  }
};

startServer()
