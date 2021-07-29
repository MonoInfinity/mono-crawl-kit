//@ts-nocheck
import puppeteer from 'puppeteer';
import fs from 'fs';
import download from 'download';
import { getNewName } from './helper';

async function bootCrawl() {
        const browser = await puppeteer.launch({
                // the amount of delay time for each action by bot
                slowMo: 500,
                // False: show the browser, True: not show the browser
                headless: false,
        });

        const page = await browser.newPage();
        await page.goto(
                'https://divineshop.vn/steam?filter_price_from=0&filter_price_to=15000000&sort=op.quantity&order=DESC&limit=100'
        );

        // get text data
        const items = await page.evaluate(() => {
                let data = [];
                for (let index = 1; index <= 5; index++) {
                        const name = document.querySelector(
                                `body > div.container > div.list-sp > div.list-container > div > div:nth-child(${index}) > div > div.item-info > div.item-title > a`
                        );

                        const img = document.querySelector(
                                `body > div.container > div.list-sp > div.list-container > div > div:nth-child(${index}) > div > div.img > a > img`
                        );

                        if (name) {
                                data.push({
                                        name: name?.textContent,
                                        imageUrl: img?.getAttribute('src'),
                                });
                        }
                }

                return data;
        });

        // download file data
        const folderPath = './output/images';
        for (let item = 0; item < items.length; item++) {
                const filename = getNewName(items[item].imageUrl, 10, 'lettersLowerCase');
                if (items[item].imageUrl?.includes('https')) {
                        await download(`${items[item].imageUrl}`, folderPath, { filename });
                } else await download(`https://divineshop.vn/${items[item].imageUrl}`, folderPath, { filename });

                items[item].imageUrl = folderPath + '/' + filename;
        }

        const data = JSON.stringify(items);

        // write JSON string to a file
        fs.writeFile('./output/data.json', data, (err) => {
                if (err) {
                        throw err;
                }
                console.log('JSON data is saved.');
        });

        await browser.close();
}

bootCrawl();
