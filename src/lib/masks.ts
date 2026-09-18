/**
 * Máscara dinâmica de telefone brasileiro: (99) 9999-9999 (fixo) enquanto
 * tem até 10 dígitos e (99) 99999-9999 (celular) a partir do 11º. Aceita
 * colar números com +55; guarda só o que o usuário digitou — a normalização
 * para gravar no banco continua em `normalizePhone` (lib/clientId.ts).
 */
export function maskPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const NAME_PARTICLES = new Set(["da", "de", "di", "do", "du", "das", "dos", "e"]);

/** Remove espaços duplicados/nas pontas e capitaliza cada parte do nome ("carlos DA silva" -> "Carlos da Silva"). */
export function formatName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word, index) => {
      const lower = word.toLocaleLowerCase("pt-BR");
      if (index > 0 && NAME_PARTICLES.has(lower)) return lower;
      return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
    })
    .join(" ");
}
