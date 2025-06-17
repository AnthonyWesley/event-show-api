// generateEventReportPuppeteer.ts
import puppeteer from "puppeteer";
import path from "path";

type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  goal: number;
  goalType: "QUANTITY" | "VALUE";
  createdAt: Date;
  partnerName: string;
};

function generateHTML(event: Event): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          h1 { color: #d00; }
          .label { font-weight: bold; }
          .line { margin-bottom: 10px; }
          .card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Relatório do Evento</h1>
          <div class="line"><span class="label">ID:</span> ${event.id}</div>
          <div class="line"><span class="label">Nome:</span> ${event.name}</div>
          <div class="line"><span class="label">Parceiro:</span> ${event.partnerName}</div>
          <div class="line"><span class="label">Data de Início:</span> ${event.startDate.toLocaleDateString()}</div>
          <div class="line"><span class="label">Data de Fim:</span> ${event.endDate?.toLocaleDateString() || "---"}</div>
          <div class="line"><span class="label">Meta:</span> ${event.goal} (${event.goalType})</div>
          <div class="line"><span class="label">Ativo:</span> ${event.isActive ? "Sim" : "Não"}</div>
          <div class="line"><span class="label">Criado em:</span> ${event.createdAt.toLocaleString()}</div>
        </div>
      </body>
    </html>
  `;
}

async function generatePDF(event: Event) {
  const html = generateHTML(event);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputPath = path.join(__dirname, "relatorio-evento.pdf");
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });

  await browser.close();
  console.log(`✅ PDF gerado em: ${outputPath}`);
}

generatePDF({
  id: "evt_456",
  name: "Semana do Parceiro",
  startDate: new Date("2025-06-10"),
  endDate: new Date("2025-06-15"),
  isActive: true,
  goal: 200,
  goalType: "VALUE",
  createdAt: new Date(),
  partnerName: "Motospeed",
});
