"use client";

export function WkToolbar({
  detailsOpen,
  onToggleDetails,
  onSubmit,
  canSubmit,
  onContinue,
  awaitingContinue,
}: {
  detailsOpen: boolean;
  onToggleDetails: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  onContinue?: () => void;
  awaitingContinue?: boolean;
}) {
  return (
    <div className="flex border-b border-[#bbb] bg-[#e8e8e8] text-[#666]">
      <button
        type="button"
        onClick={() => {
          if (awaitingContinue) {
            onContinue?.();
          } else {
            onSubmit();
          }
        }}
        disabled={awaitingContinue ? false : !canSubmit}
        className="flex flex-1 items-center justify-center border-r border-[#bbb] py-3.5 hover:bg-[#ddd] disabled:cursor-default disabled:opacity-40"
        title={awaitingContinue ? "Continuar" : "Verificar (Enter)"}
        aria-label={awaitingContinue ? "Continuar" : "Verificar resposta"}
      >
        <CheckIcon />
      </button>
      <button
        type="button"
        onClick={onToggleDetails}
        className={`relative flex flex-1 items-center justify-center border-r border-[#bbb] py-3.5 hover:bg-[#ddd] ${
          detailsOpen ? "bg-[#ddd]" : ""
        }`}
        title="Mostrar significado e leitura"
        aria-label="Alternar detalhes"
        aria-expanded={detailsOpen}
      >
        <EyeIcon />
        {detailsOpen ? (
          <span
            className="pointer-events-none absolute -bottom-px left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[10px] border-x-transparent border-t-white"
            aria-hidden
          />
        ) : null}
      </button>
      <button
        type="button"
        onClick={awaitingContinue ? onContinue : undefined}
        disabled={!awaitingContinue}
        className="flex flex-1 items-center justify-center py-3.5 text-lg font-medium hover:bg-[#ddd] disabled:opacity-40"
        title="Continuar"
      >
        ひ
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
