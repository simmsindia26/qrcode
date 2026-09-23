import mongoose from "mongoose";

const qrSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Tracking code
    |--------------------------------------------------------------------------
    |
    | Tracked QR:
    | P-CMDoOG
    |
    | Direct QR:
    | null
    |
    */

    code: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Destination
    |--------------------------------------------------------------------------
    */

    targetUrl: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | QR Type
    |--------------------------------------------------------------------------
    |
    | tracked = Uses /r/:code
    | direct  = Opens targetUrl directly
    |
    */

    type: {
      type: String,
      enum: ["tracked", "direct"],
      default: "tracked",
      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    */

    scans: {
      type: Number,
      default: 0,
    },

    redirects: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const QRCode = mongoose.model(
  "QRCode",
  qrSchema
);

export default QRCode;