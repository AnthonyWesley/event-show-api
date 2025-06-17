import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

export class PdfEventExporter {
  constructor(readonly props: any) {}

  async export(data: any): Promise<Buffer> {
    const templatePath = path.resolve(
      __dirname,
      "templates",
      "event-report.html"
    );

    const templateHtml = await fs.readFile(templatePath, "utf-8");
    const template = Handlebars.compile(templateHtml);
    const html = template(data);

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: null,
      executablePath: await chromium.executablePath(), // crucial para Vercel
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "30px", right: "30px" },
    });

    await browser.close();
    return Buffer.from(pdf);
  }
}
