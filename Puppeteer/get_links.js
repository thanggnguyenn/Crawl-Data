import puppeteer from "puppeteer";
import fs from 'fs';

const scrape_links = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/");

    // returns all links matching the selector
    const linksHandles = await page.$$("div.gw-card-layout > div.gw-col");

    const site = "https://amazon.com";
    for (const linkHandle of linksHandles) {
        try {
            const link = await page.evaluate((el) => el.querySelector("div > div > a").getAttribute("href"), linkHandle);
            if(link !== "#"){
                fs.appendFile(
                    "links.csv",
                    `${site.concat(link)}\n`,
                    function(err) {
                        if (err) throw err;
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
        
    }

    await browser.close();
};

scrape_links();
