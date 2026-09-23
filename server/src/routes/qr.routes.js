import express from "express";
import { nanoid } from "nanoid";

import QRCode from "../models/QRCode.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CREATE QR
|--------------------------------------------------------------------------
| POST /api/qr
|--------------------------------------------------------------------------
|
| Body:
|
| {
|   "name": "Boffles Menu",
|   "targetUrl": "https://example.com",
|   "type": "tracked"
| }
|
| OR
|
| {
|   "name": "Boffles Menu",
|   "targetUrl": "https://example.com",
|   "type": "direct"
| }
|
|--------------------------------------------------------------------------
*/

router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      targetUrl,
      type = "tracked",
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Name
    |--------------------------------------------------------------------------
    */

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "QR name is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate URL
    |--------------------------------------------------------------------------
    */

    if (!targetUrl || !targetUrl.trim()) {
      return res.status(400).json({
        message: "Destination URL is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate QR Type
    |--------------------------------------------------------------------------
    */

    if (
      type !== "tracked" &&
      type !== "direct"
    ) {
      return res.status(400).json({
        message:
          "QR type must be either tracked or direct",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate URL Format
    |--------------------------------------------------------------------------
    */

    try {
      new URL(targetUrl.trim());
    } catch {
      return res.status(400).json({
        message: "Invalid destination URL",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Tracking Code
    |--------------------------------------------------------------------------
    |
    | Only tracked QR gets a code.
    |
    */

    const code =
      type === "tracked"
        ? nanoid(8)
        : null;

    /*
    |--------------------------------------------------------------------------
    | Create QR
    |--------------------------------------------------------------------------
    */

    const qr = await QRCode.create({
      user: req.user.id,

      name: name.trim(),

      targetUrl: targetUrl.trim(),

      type,

      code,

      scans: 0,

      redirects: 0,
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      message: "QR code created successfully",
      qr,
    });
  } catch (error) {
    console.error(
      "Create QR error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create QR code",
    });
  }
});


/*
|--------------------------------------------------------------------------
| GET ALL USER QR CODES
|--------------------------------------------------------------------------
| GET /api/qr
|--------------------------------------------------------------------------
*/

router.get("/", auth, async (req, res) => {
  try {
    const qrs = await QRCode.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json(qrs);
  } catch (error) {
    console.error(
      "Get QR list error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch QR codes",
    });
  }
});


/*
|--------------------------------------------------------------------------
| GET SINGLE QR
|--------------------------------------------------------------------------
| GET /api/qr/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", auth, async (req, res) => {
  try {
    const qr = await QRCode.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!qr) {
      return res.status(404).json({
        message: "QR code not found",
      });
    }

    return res.status(200).json(qr);
  } catch (error) {
    console.error(
      "Get QR details error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch QR code",
    });
  }
});


/*
|--------------------------------------------------------------------------
| DELETE QR
|--------------------------------------------------------------------------
| DELETE /api/qr/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const qr =
        await QRCode.findOneAndDelete({
          _id: req.params.id,
          user: req.user.id,
        });

      if (!qr) {
        return res.status(404).json({
          message: "QR code not found",
        });
      }

      return res.status(200).json({
        message:
          "QR code deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete QR error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete QR code",
      });
    }
  }
);


export default router;