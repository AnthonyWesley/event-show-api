// EventReportPdf.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  strong: {
    fontWeight: "bold",
  },
  sectionText: {
    marginBottom: 4,
  },
  list: {
    marginLeft: 20,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 2,
  },
  table: {
    // display: "table",
    width: "auto",
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f4f4f4",
    padding: 6,
    flex: 1,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    flex: 1,
  },
  highlightRow: {
    backgroundColor: "#d4edda",
  },
});

export default function EventReportPdf({ data }: EventReportPdfProps) {
  const { event, sellers, sales } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.title}>Relatório do Evento: {event.name}</Text>
        <Text style={styles.sectionText}>
          <Text style={styles.strong}>Período: </Text>
          {event.startDate} a {event.endDate}
        </Text>
        <Text style={styles.sectionText}>
          <Text style={styles.strong}>Meta Geral: </Text>
          {event.goal} ({event.goalType})
        </Text>

        {/* Resumo Geral */}
        <Text style={styles.subtitle}>Resumo Geral</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.strong}>Total de Unidades Vendidas: </Text>
            {event.totalUnits}
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.strong}>Valor Total Vendido: </Text>{" "}
            {event.totalValue}
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.strong}>Meta Atingida: </Text>
            {event.goalReached ? "Sim ✅" : "Não ❌"}
          </Text>
        </View>

        {/* Vendedores */}
        <Text style={styles.subtitle}>Vendedores</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Nome</Text>
            <Text style={styles.tableColHeader}>Email</Text>
            <Text style={styles.tableColHeader}>Telefone</Text>
            <Text style={styles.tableColHeader}>Unidades Vendidas</Text>
            <Text style={styles.tableColHeader}>Valor Total</Text>
            <Text style={styles.tableColHeader}>Meta</Text>
            <Text style={styles.tableColHeader}>Meta Atingida</Text>
          </View>
          {sellers.map((seller) => (
            <View
              key={seller.id}
              style={[
                styles.tableRow,
                seller.goalReached ? styles.highlightRow : {},
              ]}
            >
              <Text style={styles.tableCol}>{seller.name}</Text>
              <Text style={styles.tableCol}>{seller.email}</Text>
              <Text style={styles.tableCol}>{seller.phone}</Text>
              <Text style={styles.tableCol}>{seller.totalUnits}</Text>
              <Text style={styles.tableCol}>{seller.totalValue}</Text>
              <Text style={styles.tableCol}>{seller.goal}</Text>
              <Text style={styles.tableCol}>
                {seller.goalReached ? "Sim" : "Não"}
              </Text>
            </View>
          ))}
        </View>

        {/* Vendas Detalhadas */}
        <Text style={styles.subtitle}>Vendas Detalhadas</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Data</Text>
            <Text style={styles.tableColHeader}>Vendedor</Text>
            <Text style={styles.tableColHeader}>Produto</Text>
            <Text style={styles.tableColHeader}>Quantidade</Text>
            <Text style={styles.tableColHeader}>Valor Unitário</Text>
            <Text style={styles.tableColHeader}>Total</Text>
          </View>
          {sales.map((sale) => (
            <View key={sale.id} style={styles.tableRow}>
              <Text style={styles.tableCol}>{sale.date}</Text>
              <Text style={styles.tableCol}>{sale.seller}</Text>
              <Text style={styles.tableCol}>{sale.product}</Text>
              <Text style={styles.tableCol}>{sale.quantity}</Text>
              <Text style={styles.tableCol}>{sale.unitPrice}</Text>
              <Text style={styles.tableCol}>{sale.total}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
