import puppeteer from 'puppeteer';


// funciona mas baixa em user/downloads

async function getPDF() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://diario.tjac.jus.br/edicoes.php');

    console.log('pagina carregada');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.click('a[href^="/edicoes.php?Ano=2024"]');
    console.log('elemento clicado');

    await page.waitForNavigation();

    const hrefValor = await page.$eval('td a[href^="/edicoes.php?Ano=2024"]', element => element.getAttribute('href'));

    console.log('elemento <a>:', hrefValor);

    await page.evaluate(url => {
        window.location.href = url;
    }, hrefValor);

    console.log("Clicando em:", hrefValor);

    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
}

getPDF();
