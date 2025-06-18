import PDFDocument from "pdfkit";

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

export async function generateEventReportPdf(
  data: EventReportPdfProps["data"]
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  // Para capturar o PDF gerado em buffer
  const chunks: Uint8Array[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // Quando acabar de gerar o PDF, resolve o buffer
  const pdfBufferPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // --- Cabeçalho ---
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(`Relatório do Evento: ${data.event.name}`, {
      underline: true,
    });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Período: ${data.event.startDate} a ${data.event.endDate}`);
  doc.text(`Meta Geral: R$ ${data.event.goal} (${data.event.goalType})`);
  doc.moveDown();

  // --- Resumo Geral ---
  doc.fontSize(14).font("Helvetica-Bold").text("Resumo Geral");
  doc.moveDown(0.2);
  doc.fontSize(12).font("Helvetica");
  doc.text(`Total de Unidades Vendidas: ${data.event.totalUnits}`);
  doc.text(
    `Valor Total Vendido: R$ ${Number(data.event.totalValue).toFixed(2)}`
  );
  doc.text(`Meta Atingida: ${data.event.goalReached ? "Sim ✅" : "Não ❌"}`);
  doc.moveDown();

  // --- Tabela Vendedores ---
  doc.fontSize(14).font("Helvetica-Bold").text("Vendedores");
  doc.moveDown(0.3);

  const sellersTableStartX = doc.x;
  let y = doc.y;
  const rowHeight = 25;

  // Definindo colunas da tabela
  const sellerColumns = [
    { title: "Nome", width: 110 },
    { title: "Email", width: 140 },
    { title: "Telefone", width: 90 },
    { title: "Unid.", width: 50 },
    { title: "Valor", width: 70 },
    { title: "Meta", width: 50 },
    { title: "Atingiu", width: 50 },
  ];

  // Função para desenhar cabeçalho
  function drawTableHeader(
    x: number,
    y: number,
    columns: { title: string; width: number }[]
  ) {
    let posX = x;
    columns.forEach((col) => {
      doc.rect(posX, y, col.width, rowHeight).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(col.title, posX + 5, y + 7, {
          width: col.width - 10,
          align: "center",
        });
      posX += col.width;
    });
  }

  // Função para desenhar uma linha da tabela
  function drawTableRow(
    x: number,
    y: number,
    columns: { width: number }[],
    values: (string | number)[],
    highlight = false
  ) {
    if (highlight) {
      // Fundo verde claro para meta atingida
      doc
        .rect(
          x,
          y,
          columns.reduce((acc, c) => acc + c.width, 0),
          rowHeight
        )
        .fillAndStroke("#d4edda", "#ddd");
      doc.fillColor("black");
    } else {
      doc.fillColor("black");
    }

    let posX = x;
    values.forEach((val, i) => {
      const text = typeof val === "number" ? val.toString() : val;
      const alignRight = i >= 3; // alinhar colunas numéricas à direita
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(text, posX + 5, y + 7, {
          width: columns[i].width - 10,
          align: alignRight ? "right" : "left",
        });
      doc.rect(posX, y, columns[i].width, rowHeight).stroke();
      posX += columns[i].width;
    });
  }

  // Desenha cabeçalho da tabela vendedores
  drawTableHeader(sellersTableStartX, y, sellerColumns);
  y += rowHeight;

  // Preenche linhas dos vendedores
  for (const seller of data.sellers) {
    if (y + rowHeight > doc.page.height - 50) {
      doc.addPage();
      y = doc.y;
      drawTableHeader(sellersTableStartX, y, sellerColumns);
      y += rowHeight;
    }

    drawTableRow(
      sellersTableStartX,
      y,
      sellerColumns,
      [
        seller.name,
        seller.email,
        seller.phone,
        seller.totalUnits,
        `R$ ${Number(seller.totalValue).toFixed(2)}`,
        seller.goal.toString(),
        seller.goalReached ? "Sim" : "Não",
      ],
      seller.goalReached
    );

    y += rowHeight;
  }

  doc.moveDown(2);
  y = doc.y;

  // --- Tabela Vendas Detalhadas ---
  doc.fontSize(14).font("Helvetica-Bold").text("Vendas Detalhadas");
  doc.moveDown(0.3);

  const salesTableStartX = doc.x;

  const salesColumns = [
    { title: "Data", width: 70 },
    { title: "Vendedor", width: 100 },
    { title: "Produto", width: 100 },
    { title: "Qtd", width: 40 },
    { title: "Valor Unit.", width: 70 },
    { title: "Total", width: 70 },
  ];

  // Desenha cabeçalho da tabela vendas
  drawTableHeader(salesTableStartX, y, salesColumns);
  y += rowHeight;

  // Preenche linhas das vendas
  for (const sale of data.sales) {
    if (y + rowHeight > doc.page.height - 50) {
      doc.addPage();
      y = doc.y;
      drawTableHeader(salesTableStartX, y, salesColumns);
      y += rowHeight;
    }

    drawTableRow(
      salesTableStartX,
      y,
      salesColumns,
      [
        sale.date,
        sale.seller,
        sale.product,
        sale.quantity,
        `R$ ${Number(sale.unitPrice).toFixed(2)}`,
        `R$ ${Number(sale.total).toFixed(2)}`,
      ],
      false
    );

    y += rowHeight;
  }

  // Finaliza o documento
  doc.end();

  // Espera o buffer completo
  return pdfBufferPromise;
}
