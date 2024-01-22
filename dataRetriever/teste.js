import puppeteer from 'puppeteer';

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://diario.tjac.jus.br/edicoes.php');

    console.log('Página carregada com sucesso.');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.click('a[href^="/edicoes.php?Ano=2024"]');
    console.log('Elemento clicado com sucesso.');

    await page.waitForNavigation();

    const hrefValor = await page.$eval('td a[href^="/edicoes.php?Ano=2024"]', element => element.getAttribute('href'));

    console.log('Valor do atributo href do elemento <a>:', hrefValor);

    await page.evaluate(url => {
        window.location.href = url;
    }, hrefValor);

    console.log("Clicado em:", hrefValor);

    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
}

run();
