/**
 * Normaliza um telefone brasileiro para um formato único (só dígitos, com DDD,
 * sem +55). Isso garante que "(11) 91234-5678", "11912345678" e
 * "+55 11 91234-5678" resolvam sempre para o mesmo cliente.
 */
export function normalizePhone(rawPhone: string): string {
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }
  return digits;
}

/**
 * Gera o id determinístico do cliente dentro de um tenant: mesmo telefone,
 * mesma barbearia, sempre o mesmo documento em `clients`. É isso que permite
 * o agendamento sem cadastro — o cliente só informa nome + telefone e o
 * sistema decide sozinho se é um cliente novo ou recorrente.
 */
export function buildClientId(tenantId: string, phone: string): string {
  return `${tenantId}_${normalizePhone(phone)}`;
}

export function isValidBrazilianPhone(rawPhone: string): boolean {
  const digits = normalizePhone(rawPhone);
  return digits.length === 10 || digits.length === 11;
}
