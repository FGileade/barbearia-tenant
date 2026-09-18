import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, AtSign, MapPin, MessageCircle, User } from "lucide-react";
import { useTenant } from "../../context/TenantContext";
import { watchProfessionals, watchServices } from "../../lib/repositories/catalog";
import type { Professional, Service } from "../../types";

function formatPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Primeira tela do deploy de uma barbearia: vitrine com marca, serviços e
// equipe (tudo vindo do Firestore) e o botão que leva ao agendamento.
export default function LandingPage() {
  const { tenant, loading, error } = useTenant();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!tenant) return;
    const unsubProfessionals = watchProfessionals(tenant.id, setProfessionals);
    const unsubServices = watchServices(tenant.id, setServices);
    return () => {
      unsubProfessionals();
      unsubServices();
    };
  }, [tenant]);

  if (loading) return <p className="status-message">Carregando barbearia…</p>;
  if (error || !tenant) {
    return <p className="status-message status-message--error">{error ?? "Barbearia não encontrada."}</p>;
  }

  const whatsappDigits = tenant.telefone?.replace(/\D/g, "");
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits.length <= 11 ? `55${whatsappDigits}` : whatsappDigits}`
    : null;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      <header
        className="relative border-b border-[#383129] overflow-hidden"
        style={
          tenant.heroImagemUrl
            ? {
                backgroundImage: `linear-gradient(rgba(21,19,16,0.75), rgba(21,19,16,0.95)), url(${tenant.heroImagemUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="max-w-2xl mx-auto px-5 py-14 flex flex-col items-center text-center gap-4">
          <img
            src={tenant.logoUrl || "/logo.svg"}
            alt={tenant.nome}
            className="h-20 w-auto object-contain rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.svg";
            }}
          />
          <h1 className="text-3xl font-bold tracking-tight">{tenant.nome}</h1>
          {tenant.descricao && (
            <p className="text-sm text-on-surface-variant max-w-md">{tenant.descricao}</p>
          )}
          <Link
            to="/agendar"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-[#191714] font-bold shadow-md active:scale-[0.98] transition"
          >
            <Calendar size={18} />
            Agendar horário
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="font-label-caps text-primary tracking-widest text-xs">SERVIÇOS</h2>
          {services.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Serviços em breve.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="bg-surface-container p-4 rounded-xl border border-[#383129] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{service.nome}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Clock size={12} /> {service.duracaoMinutos} min
                    </p>
                  </div>
                  <span className="font-bold text-primary flex-shrink-0">{formatPreco(service.preco)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {professionals.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-label-caps text-primary tracking-widest text-xs">NOSSA EQUIPE</h2>
            <ul className="grid grid-cols-2 gap-3">
              {professionals.map((professional) => (
                <li
                  key={professional.id}
                  className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col items-center text-center gap-2"
                >
                  {professional.fotoUrl ? (
                    <img
                      src={professional.fotoUrl}
                      alt={professional.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                      <User size={28} />
                    </div>
                  )}
                  <p className="font-bold text-sm">{professional.nome}</p>
                  {professional.especialidades.length > 0 && (
                    <p className="text-xs text-on-surface-variant">{professional.especialidades.join(" · ")}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(tenant.endereco || whatsappUrl || tenant.instagram) && (
          <section className="flex flex-col gap-3">
            <h2 className="font-label-caps text-primary tracking-widest text-xs">CONTATO</h2>
            <div className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col gap-3 text-sm">
              {tenant.endereco && (
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" /> {tenant.endereco}
                </p>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-semibold">
                  <MessageCircle size={16} /> Falar no WhatsApp
                </a>
              )}
              {tenant.instagram && (
                <a
                  href={`https://instagram.com/${tenant.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary font-semibold"
                >
                  <AtSign size={16} /> {tenant.instagram.startsWith("@") ? tenant.instagram : `@${tenant.instagram}`}
                </a>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#383129] py-5 text-center text-xs text-on-surface-variant">
        <Link to="/admin/login" className="hover:text-primary transition-colors">
          Área do barbeiro
        </Link>
      </footer>
    </div>
  );
}
