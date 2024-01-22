import { PdfReader } from 'pdfreader';
import fs from 'fs';

const search = (req, res) => {
    try {
        const searchKeywords = req.params.keyword.split(',');


        const pdfPath = 'C:/Users/WEBACADEMY/Documents/GitHub/ll-scraper/src/base2.pdf';
        const outputFilePath = `C:/Users/WEBACADEMY/Documents/GitHub/ll-scraper/searchResults/output.txt`;

        const charactersBeforeKeyword = 350;
        const charactersAfterKeyword = 350;

        let currentPage = 0;
        let currentSnippet = '';
        let outputText = '';
        let searchResults = [];

        const outputStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

        const processItem = (item) => {
            if (item.page) {
                currentPage = item.page;
            } else if (item.text) {
                searchKeywords.forEach(keyword => {
                    const keywordRegex = new RegExp(keyword, 'gi');
                    let match;

                    while ((match = keywordRegex.exec(item.text)) !== null) {
                        const start = Math.max(0, match.index - charactersBeforeKeyword);
                        const end = Math.min(item.text.length, match.index + keyword.length + charactersAfterKeyword);
                        const snippet = item.text.substring(start, end).trim();

                        const resultObject = {
                            keyword: keyword,
                            page: {
                                number: currentPage.number,
                                content: snippet
                            },
                            pageNumber: currentPage.number
                        };

                        searchResults.push(resultObject);

                        outputText += `(keyword: ${keyword}) - Page ${currentPage.number}:\n ${snippet}\n\n_____________________________________________________________________________\n`;
                    }
                });
            }
        };

        new PdfReader().parseFileItems(pdfPath, (err, item) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (!item) {
                console.log('EOF.');
                outputStream.end(() => {
                    res.json(searchResults);
                });
            } else {
                processItem(item);
            }
        });
    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    search
};
