import { PdfReader } from 'pdfreader';


const readPdf = async (pdfFilePath, keyword, maxContentLength) => {
    const reader = new PdfReader();
    let pageNumber = null;
    let content = '';
    let results = [];

    const pushResult = () => {
        if (pageNumber && content.includes(keyword)) {
            const keywordIndex = content.indexOf(keyword);
            const startIdx = Math.max(0, keywordIndex - maxContentLength);
            const endIdx = Math.min(content.length, keywordIndex + keyword.length + maxContentLength);

            const limitedContent = content.substring(startIdx, endIdx);

            const result = {
                keyword: keyword,
                page: {
                    number: pageNumber,
                    content: limitedContent
                }
            };
            results.push(result);
        }
    };

    const parsePromise = (resolve, reject) => {
        reader.parseFileItems(pdfFilePath, (err, item) => {
            if (err) {
                reject(err);
                return;
            }

            if (!item || item.page) {
                pushResult();

                pageNumber = item && item.page;
                content = '';
            } else if (item.text) {
                content += item.text;

                if (content.length > maxContentLength) {
                    content = content.substring(content.length - maxContentLength);
                }
            }

            if (!item) {
                pushResult();
                resolve(results);
            }
        });
    };

    return new Promise((resolve, reject) => {
        parsePromise(resolve, reject);
    });
};

const search = async (req, res) => {
    const keyword = req.params.keyword;
    const pdfFilePath = 'C:/Users/WEBACADEMY/Documents/GitHub/ll-scraper/src/base2.pdf';
    const maxContentLength = 500;

    try {
        const results = await readPdf(pdfFilePath, keyword, maxContentLength);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error reading PDF' });
    }
};

export default {
    search
};
