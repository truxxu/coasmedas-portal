"use client";

import { useState } from "react";
import { Card, Tabs, type TabItem } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import {
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
} from "@/src/mocks/mockDatosPersonalesData";
import type { DatosPersonalesFormData, DatosPersonalesTab } from "@/src/types";
import { formatCurrency } from "@/src/utils";

interface DatosPersonalesCardProps {
  firstName: string;
  defaultValues: DatosPersonalesFormData;
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
  onCancel,
}: DatosPersonalesCardProps) {
  const [activeTab, setActiveTab] = useState<DatosPersonalesTab>("info-basica");

  return (
    <div>
      <Card className="p-6 md:p-8 space-y-6">
        <h2 className="text-[19px] font-bold text-brand-navy-deep">
          Bienvenido {firstName} al módulo datos personales
        </h2>

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
            name="contacto.gender"
            options={GENDER_OPTIONS}
            defaultValue={defaultValues.contacto.gender}
            disabled
          />
          <FormField
            label="Teléfono celular"
            name="contacto.mobilePhone"
            inputMode="numeric"
            defaultValue={defaultValues.contacto.mobilePhone}
            disabled
          />
          <FormField
            label="E-mail"
            name="contacto.email"
            type="email"
            defaultValue={defaultValues.contacto.email}
            disabled
          />
          <FormField
            label="Departamento de residencia"
            name="contacto.residenceState"
            defaultValue={defaultValues.contacto.residenceState}
            disabled
          />
          <FormField
            label="Ciudad/Municipio de residencia"
            name="contacto.residenceCity"
            defaultValue={defaultValues.contacto.residenceCity}
            disabled
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
            name="laborales.company"
            defaultValue={defaultValues.laborales.company}
            disabled
          />
          <FormField
            label="Teléfono celular"
            name="laborales.workPhone"
            inputMode="numeric"
            defaultValue={defaultValues.laborales.workPhone}
            disabled
          />
          <FormField
            label="Cargo"
            name="laborales.position"
            defaultValue={defaultValues.laborales.position}
            disabled
          />
          <FormField
            label="Dirección de trabajo"
            name="laborales.workAddress"
            defaultValue={defaultValues.laborales.workAddress}
            disabled
          />
          <FormField
            label="Ciudad de trabajo"
            name="laborales.workCity"
            defaultValue={defaultValues.laborales.workCity}
            disabled
          />
          <FormField
            label="Departamento de trabajo"
            name="laborales.workState"
            defaultValue={defaultValues.laborales.workState}
            disabled
          />
          <SelectField
            label="Ocupación"
            name="laborales.occupation"
            options={OCCUPATION_OPTIONS}
            defaultValue={defaultValues.laborales.occupation}
            disabled
          />
          <FormField
            label="Actividad económica"
            name="laborales.economicActivity"
            defaultValue={defaultValues.laborales.economicActivity}
            disabled
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
            name="financieros.monthlyIncome"
            defaultValue={formatCurrency(
              defaultValues.financieros.monthlyIncome,
            )}
            disabled
          />
          <FormField
            label="Otros ingresos"
            name="financieros.otherIncome"
            defaultValue={formatCurrency(defaultValues.financieros.otherIncome)}
            disabled
          />
          <FormField
            label="Egresos mensuales"
            name="financieros.monthlyExpenses"
            defaultValue={formatCurrency(
              defaultValues.financieros.monthlyExpenses,
            )}
            disabled
          />
          <FormField
            label="Total activos"
            name="financieros.totalAssets"
            defaultValue={formatCurrency(defaultValues.financieros.totalAssets)}
            disabled
          />
          <FormField
            label="Total pasivos"
            name="financieros.totalLiabilities"
            defaultValue={formatCurrency(
              defaultValues.financieros.totalLiabilities,
            )}
            disabled
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
      </div>
    </div>
  );
}
