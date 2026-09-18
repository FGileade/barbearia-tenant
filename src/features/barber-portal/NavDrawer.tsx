import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem<Id extends string> {
  id: Id;
  label: string;
  icon: LucideIcon;
}

// Gaveta lateral de navegação do painel. Só existe no DOM enquanto aberta;
// fecha com Esc, clique no fundo ou ao escolher uma tela, trava o scroll da
// página por baixo e devolve o foco ao botão que a abriu.
export default function NavDrawer<Id extends string>({
  open,
  onClose,
  items,
  current,
  onSelect,
  header,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem<Id>[];
  current: Id;
  onSelect: (id: Id) => void;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="drawer-backdrop absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="drawer-panel absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-surface-container-low border-r border-[#383129] shadow-2xl flex flex-col"
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#383129] flex-shrink-0">
          <span className="font-label-caps text-primary tracking-widest text-[11px]">MENU</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {header && <div className="px-4 py-3 border-b border-[#383129] flex-shrink-0">{header}</div>}

        <nav aria-label="Telas do painel" className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.id === current;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                aria-current={active ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                  active
                    ? "bg-primary text-[#191714] font-bold shadow-md"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {footer && <div className="p-3 border-t border-[#383129] flex-shrink-0">{footer}</div>}
      </aside>
    </div>
  );
}
