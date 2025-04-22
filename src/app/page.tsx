import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
  return (
    <header
      className="container-fluid px-4 text-white py-5"
      style={{
        background: "rgba(0,0,0,.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
      }}
    >
      <h1 className="text-center">Home</h1>
      <p className="text-center">Welcome to your home page!</p>
    </header>
  );
}