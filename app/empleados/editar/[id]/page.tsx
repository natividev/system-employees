"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

const departamentosSV = [
  "Ahuachapán",
  "Santa Ana",
  "Sonsonate",
  "Chalatenango",
  "La Libertad",
  "San Salvador",
  "Cuscatlán",
  "La Paz",
  "Cabañas",
  "San Vicente",
  "Usulután",
  "San Miguel",
  "Morazán",
  "La Unión",
];

const empleadoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  apellido: z.string().min(1, "Apellido requerido"),
  edad: z.coerce.number().int().positive("Edad debe ser mayor que 0"),
  departamento: z.string().min(1, "Departamento requerido"),
  salario: z.coerce.number().min(0, "Salario debe ser positivo"),
});

type EmpleadoForm = z.infer<typeof empleadoSchema>;

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex justify-center mb-8 gap-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition
                ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-gray-300 text-gray-400"
                }`}
            >
              {stepNumber}
            </div>
            <span
              className={`mt-2 text-sm ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function EditarEmpleadoPage() {
  const router = useRouter();
  const params = useParams();
  const empleadoId = params.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmpleadoForm>({
    resolver: zodResolver(empleadoSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/empleados/${empleadoId}`)
      .then((res) => {
        reset(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el empleado");
        setLoading(false);
      });
  }, [empleadoId, reset]);

  const steps = ["Datos personales", "Departamento", "Salario"];

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof EmpleadoForm)[] = [];
    if (step === 1) fieldsToValidate = ["nombre", "apellido"];
    if (step === 2) fieldsToValidate = ["edad", "departamento"];
    if (step === 3) fieldsToValidate = ["salario"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep(step + 1);
  };

  const handlePrevStep = () => setStep(step - 1);

  const onSubmit: SubmitHandler<EmpleadoForm> = async (data) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/empleados/${empleadoId}`,
        data
      );
      toast.success("Empleado actualizado exitosamente");
      router.push("/empleados");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.error("Error al actualizar el empleado:", err);

      const message =
        err.response?.data?.error ||
        "Error inesperado al actualizar el empleado. Intenta nuevamente.";

      toast.error(message);
    }
  };

  if (loading) return <p className="p-6">Cargando datos del empleado...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar empleado</h1>

      <StepIndicator steps={steps} currentStep={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <input
                type="text"
                placeholder="Nombre"
                {...register("nombre")}
                className="w-full p-2 border rounded"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Apellido"
                {...register("apellido")}
                className="w-full p-2 border rounded"
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <input
                type="number"
                placeholder="Edad"
                {...register("edad")}
                className="w-full p-2 border rounded"
              />
              {errors.edad && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.edad.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("departamento")}
                className="w-full p-2 border rounded"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un departamento
                </option>
                {departamentosSV.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departamento.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <div>
            <input
              type="number"
              placeholder="Salario"
              {...register("salario")}
              className="w-full p-2 border rounded"
            />
            {errors.salario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.salario.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 border rounded hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Atrás
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Siguiente
            </button>
          )}

          {step === 3 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
