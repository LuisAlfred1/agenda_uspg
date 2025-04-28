export default function Notas() {
  return (
    <div className="d-flex" style={{ height: "600px" }}>
      {/* Sidebar de notas */}
      <div
        className="p-3"
        style={{
          width: "300px",
          backgroundColor: "rgba(0,0,0,.8)",
          color: "white",
          backdropFilter: "blur(70px)",
        }}
      >
        <h5 className="mt-3">Mis Notas</h5>
        <div className="mb-2 d-flex gap-2">
          <button className="btn btn-sm btn-light mb-3">
            <i className="bi bi-folder-plus"></i> Crear carpeta
          </button>
          <button className="btn btn-sm btn-light mb-3">
            <i className="bi bi-file-earmark-plus"></i> Crear Nota
          </button>
        </div>
        <ul className="list-unstyled" style={{ cursor: "pointer" }}>
          <li className="mb-3">Nota 1</li>
          <li className="mb-3">Nota 2</li>
          <li className="mb-3">Nota 3</li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div
        className="flex-grow-1 d-flex flex-column p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(70px)",
          color: "white",
        }}
      >
        <h1 className="text-center">Título de la Nota</h1>
        <p className="lead text-center">Aquí va el contenido de la nota...</p>
        <p>
          Este es un ejemplo de <strong>texto en negrita</strong> y más
          contenido...
        </p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    </div>
  );
}
