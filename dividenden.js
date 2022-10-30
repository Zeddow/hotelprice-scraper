// load pdf files from folder buchungen and parse them to json

const fs = require("fs");
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", (errData) =>
  console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
  fs.writeFile("./pdf2json/test/F1040EZ.json", JSON.stringify(pdfData));
});

pdfParser.loadPDF(
  "buchungen/KAUF_328826667_ord235834297_001_wknLYX0AG_dat20220601_id1121895382.pdf"
);
