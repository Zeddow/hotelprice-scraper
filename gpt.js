const puppeteer = require("puppeteer");
const fs = require("fs");

const hotel = [
    ["welly", "Kiel"],
    ["crusoe", "Bremen"],
    ["dwarf", "Berlin"],
    ["hide", "Berlin"],
    ["Star", "Sindelfingen"]
];

const arrivalDate = "14.01.2023";
const departureDate = "15.01.2023";
const rooms = 1;
const adults = 1;
const results = {};

const getLowestPrice = async (link, hotelName) => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'path/to/chromium',
        args: [
            `--disable-extensions-except=${EXTENSIONS.join(",")}`,
            `--load-extension=${EXTENSIONS.join(",")}`,
        ],
    });
    const page = await browser.newPage();
    await page.goto(link);

    const price = await page.$eval('.room-lowest-price', el => el.innerText);
    results[hotelName] = price;
    console.log(`The lowest price for ${hotelName} is ${price}`);

    await browser.close();
}

const buildLink = (hotelName) =>
    `https://onepagebooking.com/niu${hotelName}?module=public&rooms=${rooms}&arrival=${arrivalDate}&departure=${departureDate}&adults=${adults}`;

const main = async () => {
    for (let i = 0; i < hotel.length; i++) {
        const link = buildLink(hotel[i][0]);
        const hotelName = hotel[i][1];
        await getLowestPrice(link, hotelName);
    }
    fs.writeFileSync("results.json", JSON.stringify(results));
}

main();
