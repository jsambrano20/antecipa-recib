/**
 * Remove tudo que não for dígito e aplica a máscara XX.XXX.XXX/0001-XX
 */
export function formatarCnpj(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '').slice(0, 14);
  return clean
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Converte uma string formatada para apenas números (útil antes de salvar no backend)
 */
export function limparCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '').slice(0, 14);
}

/**
 * Valida o CNPJ usando algoritmo oficial
 */
export function validarCnpj(cnpj: string): boolean {
  const cleaned = limparCnpj(cnpj);
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const calcCheckDigit = (cnpj: string, positions: number[]): number => {
    let sum = 0;
    for (let i = 0; i < positions.length; i++) {
      sum += parseInt(cnpj[i]) * positions[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const base = cleaned.slice(0, 12);
  const firstDigit = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcCheckDigit(base + firstDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cleaned.endsWith(`${firstDigit}${secondDigit}`);
}

/**
 * Formata o valor numérico para moeda BRL
 */
export function formatarParaMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Limita e normaliza input numérico com até 18 inteiros e 2 decimais
 */
export function normalizarDecimal(valor: string | number): number {
  const stringValor = typeof valor === 'number' ? valor.toString() : valor;
  let clean = stringValor.replace(/[^\d,\.]/g, '').replace(',', '.');
  const [inteiros, decimais = ''] = clean.split('.');
  const resultado = `${inteiros.slice(0, 18)}${decimais ? '.' + decimais.slice(0, 2) : ''}`;
  return parseFloat(resultado) || 0;
}