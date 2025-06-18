// PdfEventExporter.js (CommonJS)
const puppeteer = require("puppeteer-core");
const Handlebars = require("handlebars");
const fs = require("fs/promises");
const path = require("path");

class PdfEventExporter {
  async export(data: any) {
    const { default: chromium } = await import("@sparticuz/chromium");

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
      executablePath: await chromium.executablePath(),
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

module.exports = { PdfEventExporter };
