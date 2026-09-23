import { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";

import api from "../services/api";

type QR = {
  _id: string;
  name: string;
  targetUrl: string;
  scans: number;
  redirects: number;
  createdAt: string;
};


export default function Dashboard() {

  const [qrs, setQrs] =
    useState<QR[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchData = async () => {

      try {

        const response =
          await api.get("/qr");

        setQrs(response.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, []);


  const totalScans =
    qrs.reduce(
      (total, qr) =>
        total + qr.scans,
      0
    );


  const totalRedirects =
    qrs.reduce(
      (total, qr) =>
        total + qr.redirects,
      0
    );


  return (

    <div>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Overview of your QR tracking system.
          </p>

        </div>


        <Link
          to="/qr/create"
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          + Create QR
        </Link>

      </div>


      {/* STATISTICS */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-2xl p-6">

          <p className="text-gray-500">
            Total QR Codes
          </p>

          <p className="text-4xl font-bold mt-3">
            {qrs.length}
          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <p className="text-gray-500">
            Total Scans
          </p>

          <p className="text-4xl font-bold mt-3">
            {totalScans}
          </p>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <p className="text-gray-500">
            Total Redirects
          </p>

          <p className="text-4xl font-bold mt-3">
            {totalRedirects}
          </p>

        </div>

      </div>


      {/* RECENT */}

      <div className="bg-white border rounded-2xl mt-8">

        <div className="p-6 border-b flex justify-between">

          <h2 className="text-lg font-semibold">
            Recent QR Codes
          </h2>


          <Link
            to="/qr"
            className="text-sm text-blue-600"
          >
            View All
          </Link>

        </div>


        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>

        ) : qrs.length === 0 ? (

          <div className="p-10 text-center">

            <p className="text-gray-500">
              You haven't created any QR codes yet.
            </p>

            <Link
              to="/qr/create"
              className="inline-block mt-4 bg-black text-white px-5 py-3 rounded-xl"
            >
              Create QR
            </Link>

          </div>

        ) : (

          <div>

            {qrs.slice(0, 5).map((qr) => (

              <Link
                key={qr._id}
                to={`/qr/${qr._id}`}
                className="flex items-center justify-between p-5 border-b hover:bg-gray-50"
              >

                <div>

                  <p className="font-medium">
                    {qr.name}
                  </p>

                  <p className="text-sm text-gray-400 max-w-md truncate">
                    {qr.targetUrl}
                  </p>

                </div>


                <div className="flex gap-8">

                  <div>

                    <p className="text-xs text-gray-400">
                      Scans
                    </p>

                    <p className="font-bold">
                      {qr.scans}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-400">
                      Redirects
                    </p>

                    <p className="font-bold">
                      {qr.redirects}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}