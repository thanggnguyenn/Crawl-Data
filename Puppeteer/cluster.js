import { Cluster } from "puppeteer-cluster";
import puppeteer from "puppeteer";
import fs from 'fs';

const urls = [
    "https://amazon.com/s/?_encoding=UTF8&k=school%20supplies&pd_rd_w=b9AfP&content-id=amzn1.sym.3751854a-d965-4dc2-81d5-71485d47fe5d&pf_rd_p=3751854a-d965-4dc2-81d5-71485d47fe5d&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=gaming%20headsets&ref=nb_sb_noss_2&pd_rd_w=ZSVkn&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=cleaning%20tools&pd_rd_w=jaQcS&content-id=amzn1.sym.83009b1f-702c-4be7-814b-0240b8f687d2&pf_rd_p=83009b1f-702c-4be7-814b-0240b8f687d2&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=gaming&pd_rd_w=nUOE4&content-id=amzn1.sym.860dbf94-9f09-4ada-8615-32eb5ada253a&pf_rd_p=860dbf94-9f09-4ada-8615-32eb5ada253a&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=Jeans&rh=n%3A1040660%2Cn%3A1048188%2Cp_36%3A-5000&dc=&ds=v1%3AZrh2YeJ%2Bmo6tc5p1QJD9idnCpBDTF2pKNTUbGqlhFKk&crid=1TZCO6ZC2HZVA&qid=1684823801&rnid=2941120011&sprefix=jeans%2Caps%2C155&ref=sr_nr_n_4&pd_rd_w=zUn64&content-id=amzn1.sym.56e14e61-447a-443b-9528-4b285fddeeac&pf_rd_p=56e14e61-447a-443b-9528-4b285fddeeac&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=kitchen%20and%20dining&rh=p_36%3A-5000&s=date-desc-rank&pd_rd_w=seaGC&content-id=amzn1.sym.82545daf-9a90-4f78-b3cc-f9f3e191c9ad&pf_rd_p=82545daf-9a90-4f78-b3cc-f9f3e191c9ad&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=cooker&pd_rd_w=uPhYQ&content-id=amzn1.sym.2f889ce0-246f-467a-a086-d9a721167240&pf_rd_p=2f889ce0-246f-467a-a086-d9a721167240&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=Dinnerware%20%26%20accessories&crid=IBML6MYDLJ4A&sprefix=dinnerware%20%26%20accessorie%2Caps%2C190&ref=nb_sb_noss&pd_rd_w=U47D5&content-id=amzn1.sym.5a1e43ac-8800-488a-812b-a43cf4218174&pf_rd_p=5a1e43ac-8800-488a-812b-a43cf4218174&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=toys&rh=p_36%3A-2500&pd_rd_w=q2PI5&content-id=amzn1.sym.44da4965-9668-4613-bec2-a3a75f0c2ad4&pf_rd_p=44da4965-9668-4613-bec2-a3a75f0c2ad4&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=qhbsG&pd_rd_r=72f85893-c635-4f2d-801c-6024e331529b&ref_=pd_hp_d_atf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=women%20watch&pd_rd_w=rgV0D&content-id=amzn1.sym.db94be39-53f1-4c79-89b2-88aa81be709e&pf_rd_p=db94be39-53f1-4c79-89b2-88aa81be709e&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=makeup&pd_rd_w=OA4Ll&content-id=amzn1.sym.cfffd636-af52-48ff-a5dc-4f273c40ec67&pf_rd_p=cfffd636-af52-48ff-a5dc-4f273c40ec67&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=vacation%20handbags&pd_rd_w=bM9hv&content-id=amzn1.sym.e0870a2a-3b8f-43b4-b7d1-1cd06307771f&pf_rd_p=e0870a2a-3b8f-43b4-b7d1-1cd06307771f&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=gaming%20apparel&ref=nb_sb_noss&pd_rd_w=XB08u&content-id=amzn1.sym.09483392-9ac6-434a-a3d7-39d83662f54a&pf_rd_p=09483392-9ac6-434a-a3d7-39d83662f54a&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=desktop%20computers&pd_rd_w=JArux&content-id=amzn1.sym.1d3b8f55-c47a-4b7f-a127-3409d1ca6dd1&pf_rd_p=1d3b8f55-c47a-4b7f-a127-3409d1ca6dd1&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=pc%20gaming&pd_rd_w=o2tDP&content-id=amzn1.sym.f4dce7c3-dfcf-41bb-8922-50be98bf1e86&pf_rd_p=f4dce7c3-dfcf-41bb-8922-50be98bf1e86&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=travel%20backpack&pd_rd_w=Q3ndZ&content-id=amzn1.sym.1faf5a75-f10d-481a-9299-d0fe2e7649bd&pf_rd_p=1faf5a75-f10d-481a-9299-d0fe2e7649bd&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=kitchen&pd_rd_w=FDfB6&content-id=amzn1.sym.5b5b28b3-a1ac-480e-bf55-5b98e8879363&pf_rd_p=5b5b28b3-a1ac-480e-bf55-5b98e8879363&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=ride%20on%20toys&pd_rd_w=l3n0S&content-id=amzn1.sym.db4c8a8b-ebce-43d6-afeb-c39934278ec6&pf_rd_p=db4c8a8b-ebce-43d6-afeb-c39934278ec6&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=skincare&pd_rd_w=2b0J0&content-id=amzn1.sym.e41e40a2-6179-4ac1-9eea-477d5e2e5e97&pf_rd_p=e41e40a2-6179-4ac1-9eea-477d5e2e5e97&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=smartphones&pd_rd_w=abpnC&content-id=amzn1.sym.69a935ef-cee6-41d5-aefa-c36bfc7821bc&pf_rd_p=69a935ef-cee6-41d5-aefa-c36bfc7821bc&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk",
    "https://amazon.com/s/?_encoding=UTF8&k=Coffee%20Machines&pd_rd_w=AiXa9&content-id=amzn1.sym.490b3950-4b3d-4c3e-a485-a282eecc425e&pf_rd_p=490b3950-4b3d-4c3e-a485-a282eecc425e&pf_rd_r=SQSMM1T31PKVR8HZWSHE&pd_rd_wg=2nEbv&pd_rd_r=5e83e9cf-4a3a-48d8-b3cf-1de0a73ada40&ref_=pd_hp_d_btf_unk"
];

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 2,
        monitor: true,
        puppeteerOptions: {
            headless: false,
            defaultViewport: false,
            userDataDir: "./tmp",
        },
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);

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
                        `${title.replace(/,/g, ".")},${price},${img}\n`,
                        function (err) {
                            if (err) throw err;
                        }
                    );
                }
            }

            // wait until next button is loaded
            await page.waitForSelector("a.s-pagination-item", { visible: true });
            if ((await page.$("span.s-pagination-item.s-pagination-next.s-pagination-disabled")) !== null) {
                const is_disabled = true;
                isBtnDisabled = is_disabled;
            }
            if (!isBtnDisabled) {
                await page.click("a.s-pagination-item.s-pagination-next");
            }
        }
    });

    for (const url of urls) {
        await cluster.queue(url);
    }



    await cluster.idle();
    await cluster.close();
})();
