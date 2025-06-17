export const currencyFormatter = {
  ToBRL: (value: string | number): string => {
    if (typeof value === "number") {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    if (typeof value === "string") {
      const numeric = value.replace(/\D/g, "");
      const number = parseFloat(numeric || "0") / 100;

      return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    return "R$ 0,00";
  },

  ToNumber(value: string | number): number {
    if (typeof value !== "string") {
      value = String(value);
    }

    const cleaned = value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(cleaned) || 0;
  },
};
