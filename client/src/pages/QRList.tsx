import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  QrCode,
  Plus,
  BarChart3,
  ExternalLink,
  Trash2,
  Eye,
  Hash,
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


type QRCardProps = {
  qr: QR;
  onDelete: (id: string) => void;
};


function QRCard({
  qr,
  onDelete,
}: QRCardProps) {

  const [image, setImage] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | Generate QR
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const generate = async () => {

      try {

        /*
        |--------------------------------------------------------------------------
        | Determine QR Content
        |--------------------------------------------------------------------------
        |
        | Tracked:
        | https://domain.com/r/P-CMDoOG
        |
        | Direct:
        | https://example.com
        |
        */

        const qrContent =
          qr.type === "tracked"
            ? `${import.meta.env.VITE_TRACKING_URL}/${qr.code}`
            : qr.targetUrl;


        const result =
          await QRCode.toDataURL(
            qrContent,
            {
              width: 500,
              margin: 4,

              errorCorrectionLevel:
                "H",

              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            }
          );


        setImage(result);

      } catch (error) {

        console.error(
          "QR generation failed:",
          error
        );

      }

    };


    generate();

  }, [
    qr.code,
    qr.type,
    qr.targetUrl,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Card
  |--------------------------------------------------------------------------
  */

  return (

    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">


      {/* =====================================================
          QR PREVIEW
      ====================================================== */}

      <div className="relative flex items-center justify-center bg-gray-50 p-8">


        {/* TYPE */}

        <div
          className={`absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm ${
            qr.type === "tracked"
              ? "bg-red-50 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >

          {qr.type === "tracked" ? (
            <>
              <BarChart3 size={12} />
              Tracked
            </>
          ) : (
            <>
              <Zap size={12} />
              Direct
            </>
          )}

        </div>


        {/* QR */}

        {image ? (

          <img
            src={image}
            alt={qr.name}
            className="h-48 w-48 rounded-lg object-contain"
          />

        ) : (

          <div className="flex h-48 w-48 animate-pulse items-center justify-center rounded-xl bg-gray-200">

            <QrCode
              size={48}
              className="text-gray-300"
            />

          </div>

        )}

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">


        {/* NAME */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h2 className="truncate text-lg font-semibold text-gray-900">
              {qr.name}
            </h2>

            <p className="mt-1 truncate text-xs text-gray-400">
              {qr.targetUrl}
            </p>

          </div>


          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">

            <QrCode
              size={18}
              className="text-red-600"
            />

          </div>

        </div>


        {/* =================================================
            STATS
        ================================================== */}

        {qr.type === "tracked" ? (

          <div className="mt-5 grid grid-cols-2 gap-3">


            {/* SCANS */}

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">

                  <BarChart3
                    size={14}
                    className="text-red-600"
                  />

                </div>

                <p className="text-xs font-medium text-gray-500">
                  Scans
                </p>

              </div>


              <p className="mt-2 text-2xl font-bold text-gray-900">
                {qr.scans}
              </p>

            </div>


            {/* REDIRECTS */}

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">

                  <ExternalLink
                    size={14}
                    className="text-red-600"
                  />

                </div>

                <p className="text-xs font-medium text-gray-500">
                  Redirects
                </p>

              </div>


              <p className="mt-2 text-2xl font-bold text-gray-900">
                {qr.redirects}
              </p>

            </div>

          </div>

        ) : (

          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200">

                <Zap
                  size={17}
                  className="text-gray-600"
                />

              </div>


              <div>

                <p className="text-sm font-semibold text-gray-800">
                  Direct QR
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  No scan tracking enabled
                </p>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            TRACKING CODE
        ================================================== */}

        {qr.type === "tracked" && qr.code && (

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">

            <Hash
              size={14}
              className="shrink-0 text-red-500"
            />

            <span className="truncate font-mono text-xs text-gray-600">
              {qr.code}
            </span>

          </div>

        )}


        {/* =================================================
            ACTIONS
        ================================================== */}

        <div className="mt-5 flex gap-3">


          {/* VIEW */}

          <Link
            to={`/qr/${qr._id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700"
          >

            <Eye size={16} />

            View Details

          </Link>


          {/* DELETE */}

          <button
            onClick={() =>
              onDelete(qr._id)
            }
            className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-red-600 transition hover:bg-red-50"
            title="Delete QR"
          >

            <Trash2 size={17} />

          </button>

        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| QR LIST
|--------------------------------------------------------------------------
*/

export default function QRList() {

  const [qrs, setQrs] =
    useState<QR[]>([]);

  const [loading, setLoading] =
    useState(true);


  /*
  |--------------------------------------------------------------------------
  | Fetch QR
  |--------------------------------------------------------------------------
  */

  const fetchQRs = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/qr");

      const data =
        response.data.qrs ||
        response.data;

      setQrs(data);

    } catch (error) {

      console.error(error);

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

    fetchQRs();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteQR = async (
    id: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this QR code?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `/qr/${id}`
      );


      setQrs(
        (current) =>
          current.filter(
            (qr) =>
              qr._id !== id
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete QR code"
      );

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
              size={25}
              className="animate-pulse text-red-600"
            />

          </div>

          <p className="text-sm text-gray-500">
            Loading QR codes...
          </p>

        </div>

      </div>

    );

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

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">

              <QrCode
                size={23}
                className="text-white"
              />

            </div>


            <div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Generated QR Codes
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your direct and tracked QR codes.
              </p>

            </div>

          </div>

        </div>


        {/* CREATE */}

        <Link
          to="/qr/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
        >

          <Plus size={18} />

          Create QR

        </Link>

      </div>


      {/* =====================================================
          SUMMARY
      ====================================================== */}

      {qrs.length > 0 && (

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">

          <span className="font-semibold text-gray-900">
            {qrs.length}
          </span>

          {qrs.length === 1
            ? "QR code"
            : "QR codes"}

          <span>
            generated
          </span>

        </div>

      )}


      {/* =====================================================
          EMPTY
      ====================================================== */}

      {qrs.length === 0 ? (

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">

            <QrCode
              size={32}
              className="text-red-600"
            />

          </div>


          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No QR codes yet
          </h2>


          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your first direct or trackable QR code.
          </p>


          <Link
            to="/qr/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
          >

            <Plus size={17} />

            Create QR

          </Link>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {qrs.map((qr) => (

            <QRCard
              key={qr._id}
              qr={qr}
              onDelete={deleteQR}
            />

          ))}

        </div>

      )}

    </div>

  );
}