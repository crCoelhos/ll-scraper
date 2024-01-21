import { PdfReader } from "pdfreader";

import fs from 'fs';


const searchKeywords = ["5653/AC", "3548/AC"];

const pdfPath = 'base2.pdf';
const outputFilePath = 'output.txt';

const charactersBeforeKeyword = 350;
const charactersAfterKeyword = 350;

let currentPage = 0;
let currentSnippet = '';
let outputText = '';

const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

new PdfReader().parseFileItems(pdfPath, (err, item) => {
    if (err) {
        console.error(err);
    } else if (!item) {
        console.log('EOF.');

        // verifica a kweyord no texto, em sequencia
        searchKeywords.forEach(keyword => {
            const keywordRegex = new RegExp(keyword, 'gi');
            let match;

            while ((match = keywordRegex.exec(currentSnippet)) !== null) {
                // extrai o ao redor da keyword
                const start = Math.max(0, match.index - charactersBeforeKeyword);
                const end = Math.min(currentSnippet.length, match.index + keyword.length + charactersAfterKeyword);
                const snippet = currentSnippet.substring(start, end).trim();
                outputText += `(keyword: ${keyword}) - Page ${currentPage}:
                \n ${snippet}\n\n_____________________________________________________________________________\n`;
            }
        });

        currentSnippet = '';
        outputStream.end();
    } else if (item.page) {
        currentPage = item.page;
    } else if (item.text) {
        currentSnippet += item.text + '\n';
    }
});

outputStream.on('finish', () => {
    fs.writeFileSync(outputFilePath, outputText, { flag: 'a' });
    console.log('Output written to file:', outputFilePath);
});

console.log = function (message) {
    outputStream.write(message + '\n');
};

