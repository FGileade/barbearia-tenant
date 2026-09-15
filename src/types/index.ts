// Tipos centrais do domínio. Todo documento do Firestore que pertence a uma
// barbearia carrega o campo `tenantId` — é isso que garante o isolamento
// entre uma barbearia e outra dentro do mesmo backend.

export interface Tenant {
  id: string; // igual ao slug usado na URL (/b/{slug})
  slug: string;
  nome: string;
  logoUrl?: string;
  corPrimaria?: string; // permite marca própria por barbearia, ex. "#1E293B"
  endereco?: string;
  telefone?: string; // usado nos links de WhatsApp
  ativo: boolean;
  criadoEm: number;
}

export interface Professional {
  id: string;
  tenantId: string;
  nome: string;
  fotoUrl?: string;
  especialidades: string[]; // ex. ["Corte", "Barba", "Sobrancelha"]
  ativo: boolean;
  // jornada de trabalho por dia da semana (0 = domingo ... 6 = sábado)
  jornada: Record<number, { inicio: string; fim: string } | null>;
}

export interface Service {
  id: string;
  tenantId: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

export type AppointmentStatus =
  | "confirmado"
  | "concluido"
  | "cancelado";

export interface Appointment {
  id: string;
  tenantId: string;
  professionalId: string;
  serviceId: string;
  clientId: string;
  clientNome: string;
  clientTelefone: string; // usado para localizar/confirmar sem login
  data: string; // "2026-09-20"
  horaInicio: string; // "14:30"
  horaFim: string;
  status: AppointmentStatus;
  criadoEm: number;
}

export interface Client {
  id: string; // gerado a partir do telefone normalizado (ver lib/clientId.ts)
  tenantId: string;
  nome: string;
  telefone: string;
  criadoEm: number;
  ultimoAgendamentoEm?: number;
}
