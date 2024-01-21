const fs = require('fs');
import PdfReader from "pdfreader";

const searchBy = (req, res) => {
    try {
        const keyword = req.params.keyword;


        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();

        const outputFilePath = `../searchResults/output_${currentHour}_${currentMinutes}.txt`;
        const content = fs.readFileSync(outputFilePath, 'utf-8');


        const lines = content.split('\n').filter(line => line.trim() !== '');

        const filteredResults = lines.filter(line => line.includes(keyword));

        const jsonResponse = filteredResults.map((line, index) => ({
            page: index + 1,
            content: line.trim()
        }));

        res.json(jsonResponse);
    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
const search = (req, res) => {
    try {

        const searchKeywords = req.params.keyword;

        const pdfPath = '../src/base2.pdf';

        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();

        const outputFilePath = `../searchResults/output_${currentHour}_${currentMinutes}.txt`;

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


        res.json(jsonResponse);
    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = {
    searchBy,
    search
};