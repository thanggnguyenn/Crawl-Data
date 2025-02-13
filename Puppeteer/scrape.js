import puppeteer from "puppeteer";
import fs from 'fs';

const scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/s?k=bedding&qid=1738816066&ref=sr_pg_1");

    // let items = [];
    let isBtnDisabled = false;
    while (!isBtnDisabled) {
        await page.waitForSelector('[cel_widget_id="MAIN-SEARCH_RESULTS-2"]');
        const productsHandles = await page.$$(
            "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
        );

        for (const producthandle of productsHandles) {
            // data to scrape
            let title = "Null";
            let price = "Null";
            let img = "Null";
    
            // scraping data ...
            try {
                title = await page.evaluate((el) => el.querySelector("a > h2 > span").textContent, producthandle);
            } catch (error) { }
    
            try {
                price = await page.evaluate((el) => el.querySelector(".a-price > .a-offscreen").textContent, producthandle);
            } catch (error) { }
    
            try {
                img = await page.evaluate((el) => el.querySelector(".s-image").getAttribute("src"), producthandle);
            } catch (error) { }
    
            if (title !== "Null") {
                // items.push({ title, price, img });
                fs.appendFile(
                    "results.csv",
                    `${title.replace(/,/g,".")},${price},${img}\n`,
                    function(err) {
                        if (err) throw err;
                    }
                );
            }
        }

        // wait until next button is loaded
        await page.waitForSelector("a.s-pagination-item", { visible: true });
        if ((await page.$("span.s-pagination-item.s-pagination-next.s-pagination-disabled")) !== null){
            const is_disabled = true;
            isBtnDisabled = is_disabled;
        }
        if(!isBtnDisabled){
            await page.click("a.s-pagination-item.s-pagination-next");
        }
    }
    
    // console.log(items)
    // console.log(items.length);
    await browser.close();
};

scrape();
