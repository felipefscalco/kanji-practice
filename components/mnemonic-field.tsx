"use client";

import { useId } from "react";

import { cx } from "@/components/ui/cx";

/** The learner's own memory aid for an item. */
export function MnemonicField({
  placeholder = "Uma imagem ou história que ajude a lembrar…",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  // TODO(design): persist the mnemonic with the item once there is per-item storage,
  // and show it again when the learner misses the item in practice.
  return (
    <div className={cx("flex flex-col gap-2.5", className)}>
      <label className="eyebrow" htmlFor={id}>
        Seu mnemônico
      </label>
      <textarea
        id={id}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-y rounded-md border border-line-strong bg-surface-2 p-3.5 text-base text-text placeholder:text-text-3"
      />
      <span className="text-[13px] text-text-3">Ainda não fica salvo entre sessões.</span>
    </div>
  );
}
