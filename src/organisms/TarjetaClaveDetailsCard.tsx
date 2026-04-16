"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Divider } from "@/src/atoms";
import { FormField } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TarjetaClaveAction } from "@/src/types/tarjeta-clave";
import {
  tarjetaClaveAsignarSchema,
  TarjetaClaveAsignarFormData,
} from "@/src/schemas/tarjetaClaveAsignarSchema";
import {
  tarjetaClaveCambiarSchema,
  TarjetaClaveCambiarFormData,
} from "@/src/schemas/tarjetaClaveCambiarSchema";
import {
  tarjetaClaveOlvideSchema,
  TarjetaClaveOlvideFormData,
} from "@/src/schemas/tarjetaClaveOlvideSchema";

const HEADER: Record<
  TarjetaClaveAction,
  { title: string; description: string }
> = {
  asignar: {
    title: "Asignar Nueva Clave",
    description:
      "Crea una clave de 4 dígitos para tu tarjeta. No la compartas con nadie.",
  },
  cambiar: {
    title: "Cambiar Clave de Seguridad",
    description:
      "Ingresa tu clave actual y define una nueva clave de 4 dígitos.",
  },
  olvide: {
    title: "Recuperar Clave por Olvido",
    description: "Valida tu identidad y establece una nueva clave.",
  },
};

interface ShellProps {
  mode: TarjetaClaveAction;
  product: TarjetaCreditoProduct;
  children: React.ReactNode;
}

const ClaveCardShell: React.FC<ShellProps> = ({ mode, product, children }) => {
  const { title, description } = HEADER[mode];
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">{title}</h2>
        <p className="text-[14px] text-brand-text-black mt-2">{description}</p>
      </div>

      <div className="rounded-lg border border-brand-border p-4">
        <p className="text-[15px] font-bold text-brand-navy">{product.title}</p>
        <p className="text-[13px] text-brand-gray-secondary mt-1">
          {product.maskedNumber}
        </p>
      </div>

      {children}
    </Card>
  );
};

interface CommonFieldProps {
  formId: string;
  onValidityChange?: (isValid: boolean) => void;
}

interface AsignarProps extends CommonFieldProps {
  mode: "asignar";
  product: TarjetaCreditoProduct;
  onSubmit: (data: TarjetaClaveAsignarFormData) => void;
}

interface CambiarProps extends CommonFieldProps {
  mode: "cambiar";
  product: TarjetaCreditoProduct;
  onSubmit: (data: TarjetaClaveCambiarFormData) => void;
}

interface OlvideProps extends CommonFieldProps {
  mode: "olvide";
  product: TarjetaCreditoProduct;
  onSubmit: (data: TarjetaClaveOlvideFormData) => void;
}

type TarjetaClaveDetailsCardProps = AsignarProps | CambiarProps | OlvideProps;

function useValiditySync(isValid: boolean, cb?: (v: boolean) => void) {
  React.useEffect(() => {
    cb?.(isValid);
  }, [isValid, cb]);
}

const AsignarForm: React.FC<AsignarProps> = ({
  product,
  formId,
  onSubmit,
  onValidityChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TarjetaClaveAsignarFormData>({
    resolver: yupResolver(tarjetaClaveAsignarSchema),
    mode: "onChange",
  });
  useValiditySync(isValid, onValidityChange);

  return (
    <ClaveCardShell mode="asignar" product={product}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          label="Fecha de vencimiento (MM/AA)"
          placeholder="MM/AA"
          maxLength={5}
          autoComplete="cc-exp"
          inputMode="numeric"
          error={errors.fechaVencimiento?.message}
          {...register("fechaVencimiento")}
        />
        <FormField
          label="CVV"
          placeholder="***"
          maxLength={3}
          autoComplete="cc-csc"
          inputMode="numeric"
          type="password"
          error={errors.cvv?.message}
          {...register("cvv")}
        />
        <FormField
          label="Nueva Clave (4 dígitos)"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.nuevaClave?.message}
          {...register("nuevaClave")}
        />
        <FormField
          label="Confirmar Nueva Clave"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.confirmarClave?.message}
          {...register("confirmarClave")}
        />
      </form>
    </ClaveCardShell>
  );
};

const CambiarForm: React.FC<CambiarProps> = ({
  product,
  formId,
  onSubmit,
  onValidityChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TarjetaClaveCambiarFormData>({
    resolver: yupResolver(tarjetaClaveCambiarSchema),
    mode: "onChange",
  });
  useValiditySync(isValid, onValidityChange);

  return (
    <ClaveCardShell mode="cambiar" product={product}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          label="Fecha de vencimiento (MM/AA)"
          placeholder="MM/AA"
          maxLength={5}
          autoComplete="cc-exp"
          inputMode="numeric"
          error={errors.fechaVencimiento?.message}
          {...register("fechaVencimiento")}
        />
        <FormField
          label="CVV"
          placeholder="***"
          maxLength={3}
          autoComplete="cc-csc"
          inputMode="numeric"
          type="password"
          error={errors.cvv?.message}
          {...register("cvv")}
        />

        <Divider />

        <FormField
          label="Clave Actual"
          placeholder="****"
          maxLength={4}
          autoComplete="current-password"
          inputMode="numeric"
          type="password"
          error={errors.claveActual?.message}
          {...register("claveActual")}
        />
        <FormField
          label="Nueva Clave (4 dígitos)"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.nuevaClave?.message}
          {...register("nuevaClave")}
        />
        <FormField
          label="Confirma Nueva Clave"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.confirmarClave?.message}
          {...register("confirmarClave")}
        />
      </form>
    </ClaveCardShell>
  );
};

const OlvideForm: React.FC<OlvideProps> = ({
  product,
  formId,
  onSubmit,
  onValidityChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TarjetaClaveOlvideFormData>({
    resolver: yupResolver(tarjetaClaveOlvideSchema),
    mode: "onChange",
  });
  useValiditySync(isValid, onValidityChange);

  return (
    <ClaveCardShell mode="olvide" product={product}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          label="Fecha de vencimiento (MM/AA)"
          placeholder="MM/AA"
          maxLength={5}
          autoComplete="cc-exp"
          inputMode="numeric"
          error={errors.fechaVencimiento?.message}
          {...register("fechaVencimiento")}
        />
        <FormField
          label="CVV"
          placeholder="***"
          maxLength={3}
          autoComplete="cc-csc"
          inputMode="numeric"
          type="password"
          error={errors.cvv?.message}
          {...register("cvv")}
        />

        <Divider />

        <FormField
          label="Clave Transaccional (la de tu portal)"
          autoComplete="current-password"
          type="password"
          error={errors.claveTransaccional?.message}
          {...register("claveTransaccional")}
        />
        <FormField
          label="Nueva Clave (4 dígitos)"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.nuevaClave?.message}
          {...register("nuevaClave")}
        />
        <FormField
          label="Confirma Nueva Clave"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.confirmarClave?.message}
          {...register("confirmarClave")}
        />
      </form>
    </ClaveCardShell>
  );
};

export const TarjetaClaveDetailsCard: React.FC<TarjetaClaveDetailsCardProps> = (
  props,
) => {
  switch (props.mode) {
    case "asignar":
      return <AsignarForm {...props} />;
    case "cambiar":
      return <CambiarForm {...props} />;
    case "olvide":
      return <OlvideForm {...props} />;
  }
};
