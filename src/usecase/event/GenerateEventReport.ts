import puppeteer from "puppeteer";
import { IEventExporter } from "../../infra/exporters/IEventExporter";

export class PdfEventExporter implements IEventExporter {
  public readonly contentType = "application/pdf";
  public readonly fileName = "relatorio-eventos.pdf";

  constructor(readonly props?: any) {}

  async export(data: any[]): Promise<Buffer> {
    const html = this.generateHTML(data[0]);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    await browser.close();
    return Buffer.from(await page.pdf());
  }

  private generateHTML(event: any): string {
    const goalLabel = event.goalType === "QUANTITY" ? "Unidades" : "Valor (R$)";
    const goalReached = event.totalAchieved >= event.goal;

    const sellerRows = event.allSellers
      .map(
        (s: any, i: any) => `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.totalSalesCount}</td>
        <td>R$ ${s.totalSalesValue.toFixed(2)}</td>
        <td>${s.metaPercent?.toFixed(1) ?? 0}%</td>
        <td>${s.metaAchieved ? "✔️" : "❌"}</td>
      </tr>
    `
      )
      .join("");

    const chartImgBase64 = this.generatePieChartBase64(event);

    return `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #c00; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #eee; }
          .summary { margin-top: 20px; }
          .summary p { margin: 6px 0; }
        </style>
      </head>
      <body>
        <h1>Relatório do Evento: ${event.name}</h1>
        <p><strong>Período:</strong> ${this.formatDate(event.startDate)} - ${event.endDate ? this.formatDate(event.endDate) : "em andamento"}</p>
        <p><strong>Meta:</strong> ${event.goal} ${goalLabel} (${event.goalType})</p>
        <p><strong>Status:</strong> ${goalReached ? "🎯 Meta Atingida" : "⛔ Meta Não Atingida"}</p>
        <div class="summary">
          <p><strong>Total de Vendas:</strong> ${event.totalSalesCount} unidades / R$ ${event.totalSalesValue.toFixed(2)}</p>
          <p><strong>Vendedores no Evento:</strong> ${event.allSellers.length}</p>
          <p><strong>Leads Registrados:</strong> ${event.totalLeads}</p>
        </div>

        <h2>Ranking de Vendedores</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Qtd. Vendida</th>
              <th>Valor Total</th>
              <th>% da Meta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sellerRows}
          </tbody>
        </table>

        <h2>Distribuição de Meta</h2>
        <img src="data:image/png;base64,${chartImgBase64}" width="500" />
      </body>
      </html>
    `;
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  }

  private generatePieChartBase64(event: any): string {
    const { createCanvas } = require("canvas");
    const Chart = require("chart.js/auto");
    const { registerFont } = require("canvas");
    const { Buffer } = require("buffer");

    const canvas = createCanvas(500, 300);
    const ctx = canvas.getContext("2d");

    const data = {
      labels: event.allSellers.map((s: any) => s.name),
      datasets: [
        {
          data: event.allSellers.map((s: any) => s.metaPercent ?? 0),
          backgroundColor: this.generateHexColors(event.allSellers.length),
        },
      ],
    };

    new Chart(ctx, {
      type: "pie",
      data: data,
      options: { responsive: false },
    });

    return canvas.toBuffer("image/png").toString("base64");
  }

  private generateHexColors(n: number): string[] {
    const colors = [];
    for (let i = 0; i < n; i++) {
      const hue = ((i * 360) / n) % 360;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors.map((hsl) => this.hslToHex(hsl));
  }

  private hslToHex(hsl: string): string {
    const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
    const a = (s * Math.min(l / 100, 1 - l / 100)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}
