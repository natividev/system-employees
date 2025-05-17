"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

export function EmpleadosTable() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="p-6">Cargando empleados...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  console.log("characters", empleados);
  return (
    <div className="w-full p-6">
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
              <TableRow key={empleado._id}>
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
    </div>
  );
}
