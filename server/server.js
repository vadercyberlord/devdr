import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectToDB from "./database/db.js";
import authRouters from "./routes/authRoutes.js";

// creating the server
const app = express();
const PORT = process.env.PORT || 4500;

// connect to Database
connectToDB();

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

app.use("/api/auth", authRouters);

// Error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid or empty JSON payload" });
    }
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err.message,
    });
});

//listening to the server
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
        console.log("Server is running on port:", PORT);
    }
});
