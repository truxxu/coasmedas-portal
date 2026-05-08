"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Tabs, type TabItem } from "@/src/atoms";
import { FormField, InfoNoteBox, SelectField } from "@/src/molecules";
import {
  datosPersonalesSchema,
  type DatosPersonalesFormValues,
} from "@/src/schemas/datosPersonalesSchema";
import {
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
} from "@/src/mocks/mockDatosPersonalesData";
import type { DatosPersonalesTab } from "@/src/types";

interface DatosPersonalesCardProps {
  firstName: string;
  defaultValues: DatosPersonalesFormValues;
  onSubmit: (data: DatosPersonalesFormValues) => void;
  onCancel: () => void;
}

const TABS: TabItem[] = [
  { id: "info-basica", label: "Info. Básica" },
  { id: "contacto", label: "Contacto" },
  { id: "laborales", label: "Datos Laborales" },
  { id: "financieros", label: "Datos Financieros" },
];

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-brand-text-secondary">{label}</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}

export function DatosPersonalesCard({
  firstName,
  defaultValues,
  onSubmit,
  onCancel,
}: DatosPersonalesCardProps) {
  const [activeTab, setActiveTab] = useState<DatosPersonalesTab>("info-basica");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<DatosPersonalesFormValues>({
    resolver: yupResolver(datosPersonalesSchema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6 md:p-8 space-y-6">
        <h2 className="text-[19px] font-bold text-[#04193e]">
          Bienvenido {firstName} al módulo datos personales
        </h2>

        <InfoNoteBox>
          Por favor ten en cuenta que esta actualización será enviada para
          validación y si es aprobada tus datos se actualizarán, también serás
          notificado de este cambio por los canales actuales que tienes con la
          cooperativa (Mail-SMS).
        </InfoNoteBox>

        <Tabs
          tabs={TABS}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as DatosPersonalesTab)}
        />

        {/* Info. Básica (read-only) */}
        <div
          role="tabpanel"
          hidden={activeTab !== "info-basica"}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2"
        >
          <ReadOnlyRow
            label="Tipo de documento"
            value={defaultValues.infoBasica.documentType}
          />
          <ReadOnlyRow
            label="Número de identificación"
            value={defaultValues.infoBasica.documentNumber}
          />
          <ReadOnlyRow
            label="Fecha de nacimiento"
            value={defaultValues.infoBasica.birthDate}
          />
          <ReadOnlyRow
            label="Nombre completo"
            value={defaultValues.infoBasica.fullName}
          />
        </div>

        {/* Contacto */}
        <div
          role="tabpanel"
          hidden={activeTab !== "contacto"}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2"
        >
          <SelectField
            label="Género"
            options={GENDER_OPTIONS}
            {...register("contacto.gender")}
            error={errors.contacto?.gender?.message}
          />
          <FormField
            label="Teléfono celular"
            inputMode="numeric"
            {...register("contacto.mobilePhone")}
            error={errors.contacto?.mobilePhone?.message}
          />
          <FormField
            label="E-mail"
            type="email"
            {...register("contacto.email")}
            error={errors.contacto?.email?.message}
          />
          <FormField
            label="Departamento de residencia"
            {...register("contacto.residenceState")}
            error={errors.contacto?.residenceState?.message}
          />
          <FormField
            label="Ciudad/Municipio de residencia"
            {...register("contacto.residenceCity")}
            error={errors.contacto?.residenceCity?.message}
          />
        </div>

        {/* Datos Laborales */}
        <div
          role="tabpanel"
          hidden={activeTab !== "laborales"}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2"
        >
          <FormField
            label="Empresa"
            {...register("laborales.company")}
            error={errors.laborales?.company?.message}
          />
          <FormField
            label="Teléfono celular"
            inputMode="numeric"
            {...register("laborales.workPhone")}
            error={errors.laborales?.workPhone?.message}
          />
          <FormField
            label="Cargo"
            {...register("laborales.position")}
            error={errors.laborales?.position?.message}
          />
          <FormField
            label="Dirección de trabajo"
            {...register("laborales.workAddress")}
            error={errors.laborales?.workAddress?.message}
          />
          <FormField
            label="Ciudad de trabajo"
            {...register("laborales.workCity")}
            error={errors.laborales?.workCity?.message}
          />
          <FormField
            label="Departamento de trabajo"
            {...register("laborales.workState")}
            error={errors.laborales?.workState?.message}
          />
          <SelectField
            label="Ocupación"
            options={OCCUPATION_OPTIONS}
            {...register("laborales.occupation")}
            error={errors.laborales?.occupation?.message}
          />
          <FormField
            label="Actividad económica"
            {...register("laborales.economicActivity")}
            error={errors.laborales?.economicActivity?.message}
          />
        </div>

        {/* Datos Financieros */}
        <div
          role="tabpanel"
          hidden={activeTab !== "financieros"}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2"
        >
          <FormField
            label="Ingresos mensuales"
            type="number"
            inputMode="numeric"
            {...register("financieros.monthlyIncome", { valueAsNumber: true })}
            error={errors.financieros?.monthlyIncome?.message}
          />
          <FormField
            label="Otros ingresos"
            type="number"
            inputMode="numeric"
            {...register("financieros.otherIncome", { valueAsNumber: true })}
            error={errors.financieros?.otherIncome?.message}
          />
          <FormField
            label="Egresos mensuales"
            type="number"
            inputMode="numeric"
            {...register("financieros.monthlyExpenses", {
              valueAsNumber: true,
            })}
            error={errors.financieros?.monthlyExpenses?.message}
          />
          <FormField
            label="Total activos"
            type="number"
            inputMode="numeric"
            {...register("financieros.totalAssets", { valueAsNumber: true })}
            error={errors.financieros?.totalAssets?.message}
          />
          <FormField
            label="Total pasivos"
            type="number"
            inputMode="numeric"
            {...register("financieros.totalLiabilities", {
              valueAsNumber: true,
            })}
            error={errors.financieros?.totalLiabilities?.message}
          />
        </div>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:opacity-80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </button>
        <Button
          type="submit"
          variant={isDirty ? "primary" : "disabled"}
          disabled={!isDirty || isSubmitting}
        >
          Actualizar Datos
        </Button>
      </div>
    </form>
  );
}
