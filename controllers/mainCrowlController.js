
import { PdfReader } from 'pdfreader';
import fs from 'fs';

const limitCharactersAroundKeyword = (text, keyword, maxLength) => {

    const keywordIndex = text.indexOf(keyword);

    if (keywordIndex === -1) {
        return `key not found`;
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
    console.log('\n')

    console.log('search function has been called at ' + new Date().toLocaleString());

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const pdfOfTheDay = `DE${currentYear}${currentMonth}${day}.pdf`;

    
    const pdfOfYesterday = `DE${currentYear}${currentMonth}${day - 1}.pdf`;





    const keyword = req.params.keyword;
    const rootPath = 'src/';
    const pdfFilePath = rootPath + pdfOfTheDay;


    const maxLength = 1500;

    try {

        console.log('\n')
        console.log('searching for ' + keyword + ' on ' + pdfOfTheDay + ' at ' + new Date().toLocaleString());

        if (!fs.existsSync(pdfFilePath)) {
            res.status(404).json({ error: `${pdfFilePath} PDF not found` });
            console.log('PDF not found');
            pdfFilePath = rootPath + pdfOfYesterday;
        }

        if (pdfFilePath === '') {
            res.status(404).json({ error: 'A PDF must be addressed' });
            return;
        }

        const results = await readPdf(pdfFilePath, keyword, maxLength);

        if (results.length > 0) {
            res.json(results);
            console.log(results);
        }

        else {
            res.status(404).json({ error: `Keyword -${keyword}- not found on -${pdfOfTheDay}-` });
        }

    } catch (error) {
        res.status(500).json({ error: error.message || 'Error reading PDF' });
    }
};

export default {
    search
};
