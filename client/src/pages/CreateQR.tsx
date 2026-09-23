import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Link as LinkIcon,
  BarChart3,
  Zap,
} from "lucide-react";

import api from "../services/api";

type QRType = "tracked" | "direct";

export default function CreateQR() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const [qrType, setQrType] =
    useState<QRType>("tracked");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("QR name is required.");
      return;
    }

    if (!targetUrl.trim()) {
      setError("Destination URL is required.");
      return;
    }

    try {
      new URL(targetUrl.trim());
    } catch {
      setError(
        "Please enter a valid destination URL."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/qr",
        {
          name: name.trim(),
          targetUrl: targetUrl.trim(),
          type: qrType,
        }
      );

      const qrId =
        response.data.qr._id;

      navigate(`/qr/${qrId}`);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to create QR code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">

            <QrCode
              size={24}
              strokeWidth={2.5}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Create QR Code
            </h1>

            <p className="mt-1 text-gray-500">
              Create a direct or trackable QR code.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >

        {/* HEADER */}

        <div className="border-b border-gray-100 px-8 py-6">

          <h2 className="text-lg font-semibold text-gray-900">
            QR Code Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure your QR code before generating it.
          </p>

        </div>


        <div className="p-8">

          {/* =================================================
              QR NAME
          ================================================== */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-semibold text-gray-800">
              QR Name
            </label>

            <div className="relative">

              <QrCode
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Example: Boffles Menu"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />

            </div>

            <p className="mt-2 text-xs text-gray-400">
              This name is only used to identify your QR code.
            </p>

          </div>


          {/* =================================================
              DESTINATION URL
          ================================================== */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Destination URL
            </label>

            <div className="relative">

              <LinkIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                value={targetUrl}
                onChange={(e) =>
                  setTargetUrl(e.target.value)
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />

            </div>

          </div>


          {/* =================================================
              QR TYPE
          ================================================== */}

          <div className="mb-6">

            <label className="mb-3 block text-sm font-semibold text-gray-800">
              QR Code Type
            </label>


            <div className="grid gap-4 md:grid-cols-2">

              {/* TRACKED */}

              <button
                type="button"
                onClick={() =>
                  setQrType("tracked")
                }
                className={`relative rounded-2xl border-2 p-5 text-left transition ${
                  qrType === "tracked"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >

                {qrType === "tracked" && (
                  <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">

                    <span className="text-xs">
                      ✓
                    </span>

                  </div>
                )}

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">

                  <BarChart3
                    size={21}
                    className="text-red-600"
                  />

                </div>

                <h3 className="font-semibold text-gray-900">
                  Tracked QR
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Uses your tracking URL and records scans and redirects.
                </p>

                <div className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-[10px] text-gray-500">

                  /r/random-code

                </div>

              </button>


              {/* DIRECT */}

              <button
                type="button"
                onClick={() =>
                  setQrType("direct")
                }
                className={`relative rounded-2xl border-2 p-5 text-left transition ${
                  qrType === "direct"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >

                {qrType === "direct" && (
                  <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">

                    <span className="text-xs">
                      ✓
                    </span>

                  </div>
                )}

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                  <Zap
                    size={21}
                    className="text-gray-700"
                  />

                </div>

                <h3 className="font-semibold text-gray-900">
                  Direct QR
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Opens the destination URL directly without tracking.
                </p>

                <div className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-[10px] text-gray-500 truncate">

                  https://example.com

                </div>

              </button>

            </div>

          </div>


          {/* =================================================
              SELECTED TYPE INFO
          ================================================== */}

          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">

            {qrType === "tracked" ? (

              <div className="flex gap-3">

                <BarChart3
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    Tracking enabled
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your QR will contain a unique tracking URL.
                    Every scan will be recorded before redirecting
                    the visitor to the destination.
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex gap-3">

                <Zap
                  size={18}
                  className="mt-0.5 shrink-0 text-gray-700"
                />

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    Direct link enabled
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your QR will contain the destination URL
                    directly. No tracking URL or scan analytics
                    will be used.
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </div>

              <p className="text-sm">
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-6">

            <button
              type="button"
              onClick={() =>
                navigate("/qr")
              }
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <QrCode size={18} />

              {loading
                ? "Generating..."
                : "Generate QR"}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}