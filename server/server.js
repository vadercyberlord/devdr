import dotenv from "dotenv"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDB from "./database/dbConnect.js";
import authRouters from "./routes/authRoutes.js";
import imageRouters from "./routes/imageRoutes.js"
import commentRouters from "./routes/commentRoute.js"
import errorHandler from "./middleware/errorHandler.js";
dotenv.config()
// creating the server
const app = express();
const port = process.env.PORT || 4500;

// connect to Database
const start = async () => {
  await connectToDB();
  app.listen(port, () => console.log(`Running on server ${port}`));
};

start();


// allowed origins
const allowedOrigins = ["http://localhost:5173"];

// Middleware
app.use(
    express.json({
        verify: (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                throw new SyntaxError("Invalid JSON");
            }
        },
    })
);
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // 24 hours
}));


// routes
app.get("/", (req, res) => {
    res.send("Hello World, server is live");
});

app.use("/api/v1/auth", authRouters);
app.use("/api/v1/image", imageRouters);
app.use('/api/v1/comment',commentRouters)

app.use(errorHandler)
