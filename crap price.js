const puppeteer = require('puppeteer');

var price;
var hotel = ['niuwelly','niucrusoe', 'niudwarf', 'niuhide', 'niuflash'];
var arrivalDate;
var departureDate;
var adults = 1;
var rooms = 1;
var link;
var hotelPrices = [];


(async () => {


for (var daysAhead = 0; daysAhead < 2; daysAhead++) {


    var date = new Date();
    date.setDate(date.getDate() + daysAhead);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    
    arrivalDate = dd.toString() + '.' + mm.toString() + '.' + yyyy.toString();;
    
    var date = new Date();
    date.setDate(date.getDate() + daysAhead + 1);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    departureDate = dd.toString() + '.' + mm.toString() + '.' + yyyy.toString();
    
    
        for (var i = 0; i < hotel.length; i++) {
            link = 'https://onepagebooking.com/' + hotel[i] + '?module=public&rooms=' + rooms + '&arrival=' + arrivalDate + '&departure=' + departureDate + '&adults=' + adults;
            getPrice(hotel[i], arrivalDate, link);
            }      
        }


})();



async function getPrice(hotel, arrivalDate, link) {
     const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        await page.waitForSelector('#submit-btn-wrap');
        await page.
            waitForSelector('.room-lowest-price')
            .then(() => page.$eval('.room-lowest-price', el => el.textContent))
            .then(text => {
                price = parseFloat(text.slice(3, -2));
                if (price < 100) {
                hotelPrices.push([arrivalDate, hotel, price])
                }
            });

        await browser.close();
}