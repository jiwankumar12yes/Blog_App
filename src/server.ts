import cookieParser from "cookie-parser";
import dotnet from "dotenv";
import express from "express";
import morgan from "morgan";
import authRoute from "./auth/auth.route";
import blogRouter from "./routes/blog.routes";
import CategoryRouter from "./routes/category.routes";
import comment from "./routes/comment.routes";
import like from "./routes/like.routes";

dotnet.config();

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use('/api',userRouter);
app.use("/api/auth", authRoute);
app.use("/api/category", CategoryRouter);
app.use("/api/blog", blogRouter);
app.use("/api/like", like);
app.use("/api/comment", comment);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
