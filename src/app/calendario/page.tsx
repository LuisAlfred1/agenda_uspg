"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarioPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  return (
    <>
      <main className="container-fluid px-4 py-2">
        <div className="row">
          {/* Calendario */}
          <div className="col-md-4 mb-4">
            <div
              className="p-4 d-flex flex-column"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                //minHeight: "250px",
                //width: "100%",
              }}
            >
              <h2 className="text-white text-center">Eventos</h2>
              {/* Aquí puedes agregar el componente del calendario */}
            </div>
          </div>
          <div className="col-md-8 mb-4">
            <div
              className="p-4 d-flex flex-column"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(40px)",
                borderRadius: "20px",
                //minHeight: "250px",
                //width: "100%",
              }}
            >
              <h2 className="text-white text-center">Calendario</h2>
              {/* Aquí puedes agregar el componente del calendario */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
