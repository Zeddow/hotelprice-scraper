const puppeteer = require('puppeteer');

var hotel = [['welly', 'Kiel'],['crusoe', 'Bremen'],['dwarf', 'Berlin'],['hide', 'Berlin'],['flash', 'Berlin']];
var arrivalDate;
var departureDate;
var adults = 1;
var rooms = 1;
var link;
var hotelPrices = [];
var tageImVoraus = 1;
var browser = '';


const prices = async () => {
    for (var daysAhead = 0; daysAhead < tageImVoraus; daysAhead++) {
        arrivalDate = dates(daysAhead, 0);
        departureDate = dates(daysAhead, 1);
     
        for (var i = 0; i < hotel.length; i++) {
            link = 'https://onepagebooking.com/niu' + hotel[i][0] + '?module=public&rooms=' + rooms + '&arrival=' + arrivalDate + '&departure=' + departureDate + '&adults=' + adults;
            var price = await getPrice(hotel[i][0], arrivalDate, link);
            console.log("The NIU " + hotel[i][0].charAt(0).toUpperCase() + hotel[i][0].slice(1) + " in " + hotel[i][1] + " für " + price + "€ am " + arrivalDate + " gefunden.");
            if (price < 100) {
                
                    hotelPrices.push([arrivalDate, "The NIU " + hotel[i][0].charAt(0).toUpperCase() + hotel[i][0].slice(1) + " in " + hotel[i][1], price])
                }
        }
    }

    console.clear();
    await browser.close();
    await console.log(hotelPrices);
}
 
prices();

    
    async function getPrice(hotel, arrivalDate, link) {
        
        if (browser == '') {
             browser = await puppeteer.launch(); 
        }

        const page = await browser.newPage();
        await page.goto(link);
        await page.waitForSelector('#submit-btn-wrap');
        await page.
            waitForSelector('.room-lowest-price')
            .then(() => page.$eval('.room-lowest-price', el => el.textContent))
            .then(text => {
                 price = parseFloat(text.slice(3, -2));
                
            });
        await page.close();
       
        return price;
    }



function dates(daysAhead, nextday) {

    var date = new Date();
    date.setDate(date.getDate() + daysAhead + nextday);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd.toString() + '.' + mm.toString() + '.' + yyyy.toString();
    }


