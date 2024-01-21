import { PdfReader } from "pdfreader";
import fs from 'fs';

const searchKeywords = ["5653/AC", "3548/AC"];

const pdfPath = 'base2.pdf';
const outputFilePath = 'output.txt';

let currentPage = 0;
let currentParagraph = '';
let outputText = '';

const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

new PdfReader().parseFileItems(pdfPath, (err, item) => {
    if (err) {
        console.error(err);
    } else if (!item) {
        console.log('EOF.');

        // guarda
        if (currentParagraph.includes(searchKeywords[0])) {
            outputText += `Page ${currentPage}: ${currentParagraph.trim()}\n\n`;
        }


        outputStream.end();
    } else if (item.page) {
        currentPage = item.page;
    } else if (item.text) {
        if (currentParagraph.trim() === '') {
            currentParagraph = item.text + ' ';
        } else {
            currentParagraph += item.text + ' ';
        }

        searchKeywords.forEach(keyword => {
            const keywordRegex = new RegExp(keyword, 'gi');
            let match;

            while ((match = keywordRegex.exec(item.text)) !== null) {

                // paragrafo
                if (currentParagraph.includes(keyword)) {
                    outputText += `Page ${currentPage}: ${currentParagraph.trim()}\n\n`;
                }

                currentParagraph = '';
            }
        });
    }
});

outputStream.on('finish', () => {
    fs.writeFileSync(outputFilePath, outputText, { flag: 'a' });
    console.log('Output written to file:', outputFilePath);
});

console.log = function (message) {
    outputStream.write(message + '\n');
};