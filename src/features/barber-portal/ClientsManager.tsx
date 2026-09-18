import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Check, MessageCircle, Pencil, Search, Trash2, X } from "lucide-react";
import type { Appointment, AppointmentStatus, Client, Professional, Service } from "../../types";
import { deleteClient, renameClient, watchClients } from "../../lib/repositories/clients";
import { watchClientAppointments } from "../../lib/repositories/appointments";
import { formatName, maskPhone } from "../../lib/masks";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  confirmado: "bg-primary/15 text-primary border-primary/30",
  concluido: "bg-secondary-container/20 text-secondary border-secondary/30",
  cancelado: "bg-error-container/20 text-[#ffb4ab] border-error/30",
};

// Comparação de busca sem acento e sem diferença de maiúsculas ("jose" acha "José").
function normalizeSearch(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatMillis(ms?: number): string {
  return ms ? new Date(ms).toLocaleDateString("pt-BR") : "—";
}

function whatsappUrl(telefone: string): string {
  return `https://wa.me/55${telefone.replace(/\D/g, "")}`;
}

export default function ClientsManager({
  tenantId,
  professionals,
  services,
}: {
  tenantId: string;
  professionals: Professional[];
  services: Service[];
}) {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(
    () =>
      watchClients(
        tenantId,
        (list) => {
          setLoadError(false);
          setClients(list);
        },
        () => setLoadError(true),
      ),
    [tenantId],
  );

  const filtered = useMemo(() => {
    const list = [...(clients ?? [])].sort(
      (a, b) => (b.ultimoAgendamentoEm ?? 0) - (a.ultimoAgendamentoEm ?? 0) || a.nome.localeCompare(b.nome, "pt-BR"),
    );
    const term = normalizeSearch(search.trim());
    const digits = search.replace(/\D/g, "");
    if (!term) return list;
    return list.filter(
      (c) => normalizeSearch(c.nome).includes(term) || (digits.length > 0 && c.telefone.includes(digits)),
    );
  }, [clients, search]);

  const selected = clients?.find((c) => c.id === selectedId) ?? null;

  if (selected) {
    return (
      <ClientDetail
        client={selected}
        tenantId={tenantId}
        professionals={professionals}
        services={services}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="manager-section">
      <div className="manager-section__header">
        <h2 className="step__title">Clientes</h2>
        {clients && (
          <span className="font-label-data text-primary text-xs">
            {clients.length} {clients.length === 1 ? "cliente" : "clientes"}
          </span>
        )}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou telefone"
          aria-label="Buscar cliente por nome ou telefone"
          autoComplete="off"
          className="w-full bg-surface text-on-surface placeholder-[#6C6255] border border-[#383129] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg pl-9 pr-3.5 py-2.5 text-sm transition-colors"
        />
      </div>

      {loadError && <p className="status-message status-message--error">Não foi possível carregar os clientes.</p>}
      {!loadError && clients === null && <p className="status-message">Carregando clientes…</p>}
      {clients && clients.length === 0 && (
        <p className="status-message">Nenhum cliente ainda. Eles aparecem aqui após o primeiro agendamento.</p>
      )}
      {clients && clients.length > 0 && filtered.length === 0 && (
        <p className="status-message">Nenhum cliente encontrado para “{search}”.</p>
      )}

      <ul className="manager-list">
        {filtered.map((client) => (
          <li key={client.id} className="manager-list__item">
            <button
              type="button"
              onClick={() => setSelectedId(client.id)}
              className="flex-1 min-w-0 text-left cursor-pointer"
            >
              <strong className="block truncate">{client.nome}</strong>
              <p className="manager-list__meta">
                {maskPhone(client.telefone)} · última visita {formatMillis(client.ultimoAgendamentoEm)}
              </p>
            </button>
            <a
              href={whatsappUrl(client.telefone)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chamar ${client.nome} no WhatsApp`}
              className="btn-ghost"
            >
              <MessageCircle size={16} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClientDetail({
  client,
  tenantId,
  professionals,
  services,
  onBack,
}: {
  client: Client;
  tenantId: string;
  professionals: Professional[];
  services: Service[];
  onBack: () => void;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(client.nome);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => watchClientAppointments(tenantId, client.id, setAppointments), [tenantId, client.id]);

  const total = appointments.length;
  const concluidos = appointments.filter((a) => a.status === "concluido").length;
  const cancelados = appointments.filter((a) => a.status === "cancelado").length;

  async function handleRename(event: FormEvent) {
    event.preventDefault();
    const novoNome = formatName(nome);
    if (novoNome.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      await renameClient(client.id, novoNome);
      setEditing(false);
    } catch {
      setError("Não foi possível salvar o nome. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const confirmado = window.confirm(
      `Excluir ${client.nome}? O cadastro será removido, mas os agendamentos dele continuam no histórico. Se ele agendar de novo, um novo cadastro é criado.`,
    );
    if (!confirmado) return;
    setBusy(true);
    setError(null);
    try {
      await deleteClient(client.id);
      onBack();
    } catch {
      setError("Não foi possível excluir o cliente. Tente novamente.");
      setBusy(false);
    }
  }

  return (
    <div className="manager-section">
      <button type="button" onClick={onBack} className="btn-ghost self-start cursor-pointer">
        <ArrowLeft size={16} /> Clientes
      </button>

      <section className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col gap-3">
        {editing ? (
          <form onSubmit={handleRename} className="flex items-center gap-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onBlur={() => setNome((n) => formatName(n))}
              aria-label="Nome do cliente"
              autoComplete="off"
              autoCapitalize="words"
              autoFocus
              required
              className="flex-1 min-w-0 bg-surface text-on-surface border border-[#383129] focus:border-primary focus:outline-none rounded-lg px-3 py-2 text-sm"
            />
            <button type="submit" disabled={busy} aria-label="Salvar nome" className="btn-ghost cursor-pointer">
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setNome(client.nome);
                setEditing(false);
              }}
              aria-label="Cancelar edição"
              className="btn-ghost cursor-pointer"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-on-surface truncate">{client.nome}</h2>
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Editar nome"
              className="btn-ghost cursor-pointer"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}

        <p className="text-sm text-on-surface-variant">{maskPhone(client.telefone)}</p>

        <a
          href={whatsappUrl(client.telefone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-lg bg-primary text-[#191714] font-bold text-xs"
        >
          <MessageCircle size={14} /> Chamar no WhatsApp
        </a>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-[#383129]/70">
          <Stat label="Agendamentos" value={String(total)} />
          <Stat label="Concluídos" value={String(concluidos)} />
          <Stat label="Cancelados" value={String(cancelados)} />
          <Stat label="Cliente desde" value={formatMillis(client.criadoEm)} />
        </dl>
      </section>

      {error && (
        <div role="alert" className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-[#ffb4ab] text-xs">
          {error}
        </div>
      )}

      <h3 className="font-label-caps text-primary tracking-widest text-xs">HISTÓRICO</h3>
      {appointments.length === 0 && <p className="status-message">Nenhum agendamento encontrado.</p>}
      <ul className="manager-list">
        {appointments.map((a) => (
          <li key={a.id} className="manager-list__item">
            <div className="min-w-0">
              <strong className="block truncate">
                {formatDate(a.data)} às {a.horaInicio}
              </strong>
              <p className="manager-list__meta">
                {services.find((s) => s.id === a.serviceId)?.nome ?? "—"} ·{" "}
                {professionals.find((p) => p.id === a.professionalId)?.nome ?? "—"}
              </p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLE[a.status]}`}>
              {STATUS_LABEL[a.status]}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-error/30 text-[#ffb4ab] hover:bg-error-container/20 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Trash2 size={14} /> Excluir cliente
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] text-on-surface-variant font-label-caps">{label}</dt>
      <dd className="font-bold text-on-surface">{value}</dd>
    </div>
  );
}
