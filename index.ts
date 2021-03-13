//@ts-nocheck
import puppeteer from "puppeteer";
import fs from "fs";
import download from "download";

async function boot() {
        const browser = await puppeteer.launch({
                slowMo: 5000,
        });
        const mapKey = "male";

        const page = await browser.newPage();
        await page.goto(
                "https://us.wconcept.com/wplp/men/clothing.html?is_first_call=yes&sort=releaseDate+desc&start=0&rows=108"
        );

        const items = await page.evaluate(() => {
                let data = [];
                for (let index = 1; index <= 72; index++) {
                        const name = document.querySelector(
                                `#search-product-list > div.products.wrapper.grid.products-grid > ol > li:nth-child(${index}) > div > div.product-item-details > strong > a`
                        );
                        const price = document.querySelector(
                                `#search-product-list > div.products.wrapper.grid.products-grid > ol > li:nth-child(${index}) > div > div.product-item-details > div.price-box.price-final_price > span.normal-price > span > span > span`
                        );
                        const img = document.querySelector(
                                `#search-product-list > div.products.wrapper.grid.products-grid > ol > li:nth-child(${index}) > div > div.product-image-block > a > img`
                        );

                        if (name) {
                                data.push({
                                        name: name?.textContent,
                                        sex: "male",
                                        price: price?.textContent
                                                ?.replace("$", "")
                                                .replace(".00", ""),
                                        size: ["XS", "S", "M", "L", "XL"],
                                        color: ["slategrey", "grey", "beige"],
                                        imageUrl: img?.getAttribute("data-src"),
                                });
                        }
                }

                return data;
        });

        for (let item = 0; item < items.length; item++) {
                await download(
                        `https://us.wconcept.com${items[item].imageUrl}`,
                        "./images",
                        {
                                filename: `image-${mapKey}-${item}.jpg`,
                        }
                );
                items[item].imageUrl = `/images/image-${mapKey}-${item}.jpg`;
        }

        const data = JSON.stringify(items);

        // write JSON string to a file
        fs.writeFile("data.json", data, (err) => {
                if (err) {
                        throw err;
                }
                console.log("JSON data is saved.");
        });

        await browser.close();
}

boot();
