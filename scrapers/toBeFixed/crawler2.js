import { PdfReader } from "pdfreader";

const searchKeywords = ["TALYSON DA SILVA NOGUEIRA"];

const pdfPath = 'base2.pdf';

let currentPage = 0;

new PdfReader().parseFileItems(pdfPath, (err, item) => {
    if (err) {
        console.error(err);
    } else if (!item) {
        console.log('EOF.');
    } else if (item.page) {
        currentPage = item.page;
    } else if (item.text) {
        searchKeywords.forEach(keyword => {
            const keywordRegex = new RegExp(keyword, 'gi');
            let match;

            while ((match = keywordRegex.exec(item.text)) !== null) {
                console.log(`Found keyword: ${keyword} on page ${currentPage}`);
            }
        });
    }
});