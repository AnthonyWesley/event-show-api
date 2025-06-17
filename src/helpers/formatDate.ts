// helpers/dateFormatter.ts
import { format } from "date-fns";

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return "Data inválida";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) return "Data inválida";

  return format(parsedDate, "HH:mm - dd/MM/yyyy");
};
