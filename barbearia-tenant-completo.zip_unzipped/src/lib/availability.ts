import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Professional } from "../types";

export interface BusyRange {
  horaInicio: string;
  horaFim: string;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export interface UpcomingDay {
  date: string; // "2026-09-20"
  weekday: number;
  diaSemana: string; // "sáb"
  diaMes: string; // "20/09"
}

/** Próximos dias em que o profissional efetivamente trabalha. */
export function getUpcomingDays(professional: Professional, count = 14): UpcomingDay[] {
  const days: UpcomingDay[] = [];
  const today = new Date();

  for (let i = 0; days.length < count && i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const weekday = d.getDay();

    if (professional.jornada[weekday]) {
      days.push({
        date: format(d, "yyyy-MM-dd"),
        weekday,
        diaSemana: format(d, "EEE", { locale: ptBR }),
        diaMes: format(d, "dd/MM"),
      });
    }
  }

  return days;
}

/**
 * Horários livres para um profissional, num dia específico, para um serviço
 * de X minutos. `busySlots` vem da coleção `availability` (sem dado pessoal
 * de cliente nenhum, ver firestore.rules).
 */
export function getAvailableSlots({
  professional,
  weekday,
  serviceDurationMinutes,
  busySlots,
  slotStepMinutes = 15,
}: {
  professional: Professional;
  weekday: number;
  serviceDurationMinutes: number;
  busySlots: BusyRange[];
  slotStepMinutes?: number;
}): string[] {
  const jornada = professional.jornada[weekday];
  if (!jornada) return [];

  const inicioExpediente = timeToMinutes(jornada.inicio);
  const fimExpediente = timeToMinutes(jornada.fim);

  const ocupados = busySlots.map(
    (b): [number, number] => [timeToMinutes(b.horaInicio), timeToMinutes(b.horaFim)],
  );

  const livres: string[] = [];
  for (
    let inicio = inicioExpediente;
    inicio + serviceDurationMinutes <= fimExpediente;
    inicio += slotStepMinutes
  ) {
    const fim = inicio + serviceDurationMinutes;
    const conflita = ocupados.some(([bInicio, bFim]) => inicio < bFim && fim > bInicio);
    if (!conflita) livres.push(minutesToTime(inicio));
  }

  return livres;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}
