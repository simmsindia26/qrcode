import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  QrCode,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  BarChart3,
  CalendarDays,
  Hash,
  Download,
  Zap,
} from "lucide-react";

import QRCode from "qrcode";

import api from "../services/api";

type QR = {
  _id: string;
  name: string;
  code: string | null;
  targetUrl: string;
  type: "tracked" | "direct";
  scans: number;
  redirects: number;
  createdAt: string;
};

export default function QRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [qr, setQr] = useState<QR | null>(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | QR Content
  |--------------------------------------------------------------------------
  |
  | Tracked:
  | https://your-domain.com/r/ABC123
  |
  | Direct:
  | https://example.com
  |
  */

  const qrContent = qr
    ? qr.type === "tracked" && qr.code
      ? `${import.meta.env.VITE_TRACKING_URL}/${qr.code}`
      : qr.targetUrl
    : "";

  /*
  |--------------------------------------------------------------------------
  | Fetch QR
  |--------------------------------------------------------------------------
  */

  const fetchQR = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/qr/${id}`);

      /*
       * Supports:
       *
       * response.data
       *
       * and:
       *
       * response.data.qr
       */

      const data: QR =
        response.data.qr || response.data;

      setQr(data);

      /*
       |--------------------------------------------------------------------------
       | Generate QR image
       |--------------------------------------------------------------------------
       */

      const content =
        data.type === "tracked" && data.code
          ? `${import.meta.env.VITE_TRACKING_URL}/${data.code}`
          : data.targetUrl;

      const qrImage =
        await QRCode.toDataURL(
          content,
          {
            width: 800,
            margin: 4,
            errorCorrectionLevel: "H",

            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          }
        );

      setImage(qrImage);
    } catch (error) {
      console.error(
        "Failed to load QR:",
        error
      );

      alert("QR code not found");

      navigate("/qr");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (id) {
      fetchQR();
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Download QR
  |--------------------------------------------------------------------------
  */

  const downloadQR = () => {
    if (!image || !qr) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = image;

    link.download =
      `${qr.name.replace(/\s+/g, "-")}-QR.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /*
  |--------------------------------------------------------------------------
  | Copy QR URL
  |--------------------------------------------------------------------------
  */

  const copyQRUrl = async () => {
    if (!qrContent) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        qrContent
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete QR
  |--------------------------------------------------------------------------
  */

  const deleteQR = async () => {
    if (!qr) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${qr.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/qr/${qr._id}`
      );

      navigate("/qr");
    } catch (error) {
      console.error(
        "Delete QR error:",
        error
      );

      alert("Failed to delete QR");
    } finally {
      setDeleting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <QrCode
              size={24}
              className="animate-pulse text-red-600"
            />
          </div>

          <p className="text-sm text-gray-500">
            Loading QR details...
          </p>

        </div>
      </div>
    );
  }

  if (!qr) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto max-w-7xl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

        <div>

          <Link
            to="/qr"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-red-600"
          >
            ← Back to Generated QR
          </Link>

          <div className="mt-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
              <QrCode
                size={23}
                className="text-white"
              />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {qr.name}
                </h1>

                {/* TYPE BADGE */}

                {qr.type === "tracked" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    <BarChart3 size={12} />
                    Tracked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    <Zap size={12} />
                    Direct
                  </span>
                )}

              </div>

              <p className="mt-1 text-sm text-gray-500">
                {qr.type === "tracked"
                  ? "QR code details and tracking analytics"
                  : "QR code details and destination information"}
              </p>

            </div>

          </div>

        </div>


        {/* DELETE */}

        <button
          onClick={deleteQR}
          disabled={deleting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Trash2 size={17} />

          {deleting
            ? "Deleting..."
            : "Delete QR"}

        </button>

      </div>


      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* =================================================
            QR PREVIEW
        ================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5">

            <div className="flex items-center gap-2">

              <QrCode
                size={18}
                className="text-red-600"
              />

              <h2 className="font-semibold text-gray-900">
                QR Code
              </h2>

            </div>

            <p className="mt-1 text-xs text-gray-500">
              {qr.type === "tracked"
                ? "Scan this code to test the tracking redirect."
                : "Scan this code to open the destination directly."}
            </p>

          </div>


          {/* QR */}

          <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-6">

            {image ? (
              <img
                src={image}
                alt={qr.name}
                className="w-full max-w-[320px]"
              />
            ) : (
              <div className="flex h-[320px] w-full max-w-[320px] items-center justify-center">
                <QrCode
                  size={60}
                  className="text-gray-300"
                />
              </div>
            )}

          </div>


          {/* Download */}

          <button
            onClick={downloadQR}
            disabled={!image}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Download size={18} />

            Download QR PNG

          </button>

        </div>


        {/* =================================================
            DETAILS
        ================================================== */}

        <div className="space-y-6 lg:col-span-2">


          {/* =================================================
              ANALYTICS
          ================================================== */}

          {qr.type === "tracked" ? (

            <div className="grid gap-5 md:grid-cols-2">

              {/* SCANS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Scans
                    </p>

                    <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                      {qr.scans}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                    <BarChart3
                      size={21}
                      className="text-red-600"
                    />

                  </div>

                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Number of times the tracking URL was opened.
                </p>

              </div>


              {/* REDIRECTS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-gray-500">
                      Total Redirects
                    </p>

                    <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                      {qr.redirects}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                    <ExternalLink
                      size={21}
                      className="text-red-600"
                    />

                  </div>

                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Number of redirects performed.
                </p>

              </div>

            </div>

          ) : (

            /* =================================================
               DIRECT QR INFO
            ================================================== */

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">

                  <Zap
                    size={22}
                    className="text-gray-600"
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-gray-900">
                    Direct QR Code
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    This QR code opens the destination URL
                    directly. Scan tracking and redirect
                    analytics are not enabled for this QR code.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              DESTINATION URL
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-2">

              <ExternalLink
                size={18}
                className="text-red-600"
              />

              <p className="text-sm font-semibold text-gray-900">
                Destination URL
              </p>

            </div>


            <a
              href={qr.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-start gap-2 break-all text-sm text-blue-600 hover:underline"
            >

              <span>
                {qr.targetUrl}
              </span>

              <ExternalLink
                size={14}
                className="mt-0.5 shrink-0"
              />

            </a>

          </div>


          {/* =================================================
              QR URL
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-2">

              <LinkIcon />

              <p className="text-sm font-semibold text-gray-900">
                {qr.type === "tracked"
                  ? "Tracking URL"
                  : "QR URL"}
              </p>

            </div>


            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              <input
                value={qrContent}
                readOnly
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
              />


              <button
                onClick={copyQRUrl}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >

                {copied ? (
                  <>
                    <Check size={17} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={17} />
                    Copy
                  </>
                )}

              </button>

            </div>

          </div>


          {/* =================================================
              INFORMATION
          ================================================== */}

          <div className="grid gap-5 md:grid-cols-2">


            {/* TRACKING CODE */}

            {qr.type === "tracked" && qr.code ? (

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <Hash
                    size={18}
                    className="text-red-600"
                  />

                  <p className="text-sm font-medium text-gray-500">
                    Tracking Code
                  </p>

                </div>

                <p className="mt-3 break-all font-mono text-sm font-semibold text-gray-900">
                  {qr.code}
                </p>

              </div>

            ) : (

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <Zap
                    size={18}
                    className="text-gray-500"
                  />

                  <p className="text-sm font-medium text-gray-500">
                    QR Type
                  </p>

                </div>

                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Direct QR
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  No tracking code assigned.
                </p>

              </div>

            )}


            {/* CREATED */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={18}
                  className="text-red-600"
                />

                <p className="text-sm font-medium text-gray-500">
                  Created
                </p>

              </div>

              <p className="mt-3 text-sm font-semibold text-gray-900">
                {new Date(
                  qr.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>


          {/* =================================================
              QR TYPE
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  QR Type
                </p>

                <p className="mt-2 text-base font-semibold text-gray-900">

                  {qr.type === "tracked"
                    ? "Tracked QR"
                    : "Direct QR"}

                </p>

              </div>


              {qr.type === "tracked" ? (

                <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">

                  <BarChart3 size={13} />

                  Analytics Enabled

                </div>

              ) : (

                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">

                  <Zap size={13} />

                  Direct Link

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Link Icon
|--------------------------------------------------------------------------
*/

function LinkIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">

      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-red-600"
      >

        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />

        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />

      </svg>

    </div>
  );
}