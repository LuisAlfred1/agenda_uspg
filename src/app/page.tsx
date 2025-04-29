import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  return (
    <header
      className="container-fluid px-4 text-white py-5 text-center"
      style={{
        background: "rgba(0,0,0,.3)",
        backdropFilter: "blur(30px)",
        borderRadius: "20px",
      }}
    >
      <h1 className="">Mi día</h1>
      <p className="fs-6 text-shadow-custom">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
    </header>
  );
}
