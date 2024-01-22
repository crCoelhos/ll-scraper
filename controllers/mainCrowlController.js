import { PdfReader } from 'pdfreader';

const limitCharactersAroundKeyword = (text, keyword, maxLength) => {
    const keywordIndex = text.indexOf(keyword);

    if (keywordIndex === -1) {
        return "key not found";
    }

    const start = Math.max(0, keywordIndex - Math.floor(maxLength / 2));
    const end = Math.min(text.length, start + maxLength);

    let truncatedContent = text.substring(start, end);

    const lastSpaceIndex = truncatedContent.lastIndexOf(' ');
    truncatedContent = truncatedContent.substring(0, lastSpaceIndex);

    return truncatedContent;
};

const readPdf = async (pdfFilePath, keyword, maxLength) => {
    const reader = new PdfReader();
    let pageNumber = null;
    let content = '';
    let results = [];

    const parsePromise = (resolve, reject) => {
        reader.parseFileItems(pdfFilePath, (err, item) => {
            if (err) {
                reject(err);
                return;
            }

            if (!item || item.page) {
                if (pageNumber && content.includes(keyword)) {
                    const truncatedContent = limitCharactersAroundKeyword(content, keyword, maxLength);

                    const result = {
                        keyword: keyword,
                        page: {
                            number: pageNumber,
                            content: truncatedContent
                        }
                    };
                    results.push(result);
                }

                pageNumber = item && item.page;
                content = '';
            } else if (item.text) {
                content += item.text;
            }

            if (!item) {
                resolve(results);
            }
        });
    };

    return new Promise(parsePromise);
};

const search = async (req, res) => {
    const keyword = req.params.keyword;
    const pdfFilePath = 'C:/Users/WEBACADEMY/Documents/GitHub/ll-scraper/src/base2.pdf';

    const outputFilePath = `C:/Users/WEBACADEMY/Documents/GitHub/ll-scraper/searchResults/output.txt`;

    const maxLength = 500;

    try {
        const results = await readPdf(pdfFilePath, keyword, maxLength);
        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(404).json({ error: 'Keyword not found' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message || 'Error reading PDF' });
    }
};

export default {
    search
};
