"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empleado } from "@/src/types/empleado";
import { useRouter } from "next/navigation";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";

export function EmpleadosTable() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const router = useRouter();

  const { show } = useContextMenu({
    id: "empleado-menu",
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/empleados`)
      .then((res) => {
        setEmpleados(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ocurrió un error al cargar los empleados");
        setLoading(false);
      });
  }, []);

  const handleContextMenu = (event: React.MouseEvent, empleado: Empleado) => {
    event.preventDefault();
    setSelectedEmpleado(empleado);
    show({ event });
  };

  const handleEliminar = async () => {
    if (!selectedEmpleado) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/empleados/${selectedEmpleado._id}`
      );
      setEmpleados(empleados.filter((e) => e._id !== selectedEmpleado._id));
      toast.success("Empleado eliminado correctamente");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const message =
        err.response?.data?.error ||
        "No se pudo eliminar el empleado. Intenta nuevamente.";
      console.error("Error al eliminar:", err);
      toast.error(message);
    }
  };

  const handleActualizar = () => {
    if (!selectedEmpleado) return;
    router.push(`/empleados/editar/${selectedEmpleado._id}`);
  };

  if (loading) return <p className="p-6">Cargando empleados...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="w-full p-6">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/empleados/nuevo")}
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Salario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow
                key={empleado._id}
                onContextMenu={(e) => handleContextMenu(e, empleado)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{empleado._id}</TableCell>
                <TableCell>{empleado.nombre}</TableCell>
                <TableCell>{empleado.apellido}</TableCell>
                <TableCell>{empleado.edad}</TableCell>
                <TableCell>{empleado.departamento}</TableCell>
                <TableCell>{empleado.salario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">{empleados.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Menu id="empleado-menu">
        <Item onClick={handleActualizar}>Actualizar</Item>
        <Item onClick={handleEliminar}>Eliminar</Item>
      </Menu>
    </div>
  );
}
