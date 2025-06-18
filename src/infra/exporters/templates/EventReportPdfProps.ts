export interface EventReportPdfProps {
  data: {
    event: {
      name: string;
      startDate: string;
      endDate: string;
      goal: number | string;
      goalType: string;
      totalUnits: number;
      totalValue: number;
      goalReached: boolean;
    };
    sellers: Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      totalUnits: number;
      totalValue: number;
      goal: number | string;
      goalReached: boolean;
    }>;
    sales: Array<{
      id: string;
      date: string;
      seller: string;
      product: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}
