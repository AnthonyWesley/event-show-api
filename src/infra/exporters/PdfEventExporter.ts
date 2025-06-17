import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

export class PdfEventExporter {
  constructor(readonly props: any) {}

  create() {}

  async export(data: any): Promise<Buffer> {
    const templatePath = path.resolve(
      __dirname,
      "templates",
      "event-report.html"
    );

    const templateHtml = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateHtml);
    const html = template(data);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const uint8array = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "30px", right: "30px" },
    });

    await browser.close();
    return Buffer.from(uint8array); // ✅ corrigido
  }
}
