export class Validator {
  static isValidCNPJ(cnpj?: string): boolean {
    if (!cnpj) return true;
    const cleaned = cnpj.replace(/\D/g, "");
    if (cleaned.length !== 14 || /^(\d)\1{13}$/.test(cleaned)) return false;

    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;

    size += 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === Number(digits.charAt(1));
  }

  static normalizeCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }

  static isValidPhone(phone: string): boolean {
    return /^(\d{10}|\d{11})$/.test(this.normalizePhone(phone));
  }

  static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  static isValidEmail(email?: string): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
