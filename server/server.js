import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_DB).then(() => {
	console.log(`DB Connected to ${process.env.MONGO_DB}`);
});

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// routes
app.use("/api", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`));
