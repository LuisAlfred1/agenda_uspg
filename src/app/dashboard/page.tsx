export default function DashboardPage() {
  return (
    <header
      className="container-fluid px-4 text-white py-5"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(30px)",
        borderRadius: "20px",
      }}
    >
      <h1 className="text-center">Tareas</h1>
      <p className="text-center">Welcome to your Tareas!</p>
    </header>
  );
}
