import express from "express";
import dotenv from "dotenv";
import connectToDb from "./connectToDb.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

await connectToDb();

app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
