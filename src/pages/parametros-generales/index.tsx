import { useParametrosGenerales } from "@/api/use-parametros-generales";

export default function ParametrosGenerales() {
  const { data, loading, error } = useParametrosGenerales();
  const rows = Array.isArray(data) ? data : [];

  return (
    <div>
      <h1>Parámetros Generales de Gastos de Cobranza</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>No hay datos para mostrar</td>
              </tr>
            ) : (
              rows.map((param, idx) => (
                <tr key={idx}>
                  <td>{param.parametro}</td>
                  <td>{param.valor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 