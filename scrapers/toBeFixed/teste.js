import { PdfReader } from "pdfreader";
import fs from 'fs';

const searchKeywords = ["5653/AC", "3548/AC"];

















const charactersBeforeKeyword = 250;
const charactersAfterKeyword = 500;

const pdfPath = 'base2.pdf';
const outputFilePath = 'output.txt';

let currentPage = 0;
let currentSnippet = '';
let foundKeyword = false;

const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

new PdfReader().parseFileItems(pdfPath, (err, item) => {
    if (err) {
        console.error(err);
    } else if (!item) {
        console.log('EOF.');
        if (foundKeyword && currentSnippet.trim() !== '') {
            const snippet = currentSnippet.substring(0, charactersBeforeKeyword + searchKeywords[0].length + charactersAfterKeyword).trim();
            fs.appendFileSync(outputFilePath, `Página ${currentPage}: ${snippet}\n\n`);
        }
        currentSnippet = '';
        outputStream.end();
    } else if (item.page) {
        currentPage = item.page;
    } else if (item.text) {
        currentSnippet += item.text + ' ';

        if (searchKeywords.some(keyword => currentSnippet.includes(keyword))) {
            foundKeyword = true;
        }

        if (foundKeyword) {
            const regex = new RegExp(`([\\s\\S]{0,${charactersBeforeKeyword}}${searchKeywords[0]}[\\s\\S]{0,${charactersAfterKeyword}})`);
            const match = currentSnippet.match(regex);

            if (match) {
                const snippet = match[0].trim();
                fs.appendFileSync(outputFilePath, `Page ${currentPage}: ${snippet}\n`);
                currentSnippet = '';
                foundKeyword = false;
            }
        }
    }
});

outputStream.on('finish', () => {
    console.log('Output written to file:', outputFilePath);
});
