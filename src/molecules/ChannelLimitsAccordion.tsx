"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Accordion } from "@/src/atoms";
import { ProductLimitsRow } from "./ProductLimitsRow";
import { ADMIN_CHANNEL_LABELS, type AdminChannel } from "@/src/types";
import type { AdminProductoFormValues } from "@/src/schemas/adminProductoSchema";

interface ChannelLimitsAccordionProps {
  channel: AdminChannel;
  defaultOpen?: boolean;
  register: UseFormRegister<AdminProductoFormValues>;
  control: Control<AdminProductoFormValues>;
  errors: FieldErrors<AdminProductoFormValues>;
}

export function ChannelLimitsAccordion({
  channel,
  defaultOpen = false,
  register,
  control,
  errors,
}: ChannelLimitsAccordionProps) {
  return (
    <Accordion title={ADMIN_CHANNEL_LABELS[channel]} defaultOpen={defaultOpen}>
      <ProductLimitsRow
        pathPrefix={`channelLimits.${channel}`}
        register={register}
        control={control}
        errors={errors}
      />
    </Accordion>
  );
}
