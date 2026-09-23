import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import QRCode from "./models/QRCode.js";

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QR Tracker API is running",
  });
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

/*
|--------------------------------------------------------------------------
| QR API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/qr",
  qrRoutes
);

/*
|--------------------------------------------------------------------------
| Public Tracked QR Redirect
|--------------------------------------------------------------------------
|
| Example:
|
| http://localhost:5000/r/P-CMDoOG
|
|--------------------------------------------------------------------------
*/

app.get(
  "/r/:code",
  async (req, res) => {
    try {
      const qr =
        await QRCode.findOne({
          code: req.params.code,
          type: "tracked",
        });

      if (!qr) {
        return res
          .status(404)
          .send("QR code not found");
      }

      /*
      |--------------------------------------------------------------------------
      | Analytics
      |--------------------------------------------------------------------------
      */

      qr.scans += 1;
      qr.redirects += 1;

      await qr.save();

      /*
      |--------------------------------------------------------------------------
      | Redirect
      |--------------------------------------------------------------------------
      */

      return res.redirect(
        qr.targetUrl
      );
    } catch (error) {
      console.error(
        "QR redirect error:",
        error
      );

      return res
        .status(500)
        .send(
          "Unable to process QR code"
        );
    }
  }
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(error);

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

/*
|--------------------------------------------------------------------------
| MongoDB
|--------------------------------------------------------------------------
*/

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is missing from .env"
  );

  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error
    );

    process.exit(1);
  });