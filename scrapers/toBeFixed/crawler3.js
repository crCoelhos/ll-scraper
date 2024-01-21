const fs = require('fs');
const PDFParser = require('pdf-parse');

const searchKeywords = ["Aluno", "Justiça", "Oficial"];

const pdfPath = 'base2.pdf';

const pdfBuffer = fs.readFileSync(pdfPath);

PDFParser(pdfBuffer)
  .then(data => {
    const text = data.text;

    searchKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(keyword, 'gi');
      const matches = text.match(keywordRegex);

      if (matches) {
        console.log(`Found keyword: ${keyword} - Total matches: ${matches.length}`);
      }
    });
  })
  .catch(error => {
    console.error(error);
  });
