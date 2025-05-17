import { EmpleadosTable } from "../components/empleados/EmpleadosTable";

export default function EmpleadosPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Empleados</h1>
      <EmpleadosTable />
    </div>
  );
}
