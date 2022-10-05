const puppeteer = require("puppeteer");

var hotel = [
  ["frankfurt-hbf", "Frankfurt"],
  ["luebeck", "Lübeck"],
];

//nicht buchbar aktuell:  ['Amity', 'Potsdam'], ['Hub', 'Düsseldorf'], ['Hub', 'Düsseldorf'],

var arrivalDate, departureDate, link, datum;
var adults = 1;
var rooms = 1;
var hotelPrices = [];
var tageImVoraus = 1;
var browser = "";
const EXTENSIONS = [
  __dirname + "/extensions/fihnjjcciajhdojfnbdddfaoknhalnja/3.4.3_0", // I don't care about cookies
];

var test = 0;

const prices = async () => {
  for (var daysAhead = 0; daysAhead < tageImVoraus; daysAhead++) {
    arrivalDate = dates(daysAhead, 0);
    departureDate = dates(daysAhead, 1);

    for (var i = 0; i < hotel.length; i++) {
      link =
        "https://www.hotel-bb.com/de/hotel/" +
        hotel[i][0] +
        "?r1_ad=" +
        adults +
        "&arrival_date=" +
        arrivalDate +
        "&departure_date=" +
        departureDate;
      var price = await getPrice(hotel[i][0], arrivalDate, link);
      if (price == null) {
        console.log(
          "------- B&B Hotel  " +
            hotel[i][0].charAt(0).toUpperCase() +
            hotel[i][0].slice(1) +
            " in " +
            hotel[i][1] +
            " ist am " +
            datum +
            " nicht buchbar. -------"
        );
      } else if (price < 60) {
        console.log(
          "----------------------------------------------------------------- \nB&B Hotel " +
            hotel[i][0].charAt(0).toUpperCase() +
            hotel[i][0].slice(1) +
            " in " +
            hotel[i][1] +
            " für " +
            price +
            "€ am " +
            datum +
            " gefunden.\n-----------------------------------------------------------------"
        );
        hotelPrices.push([
          arrivalDate,
          "B&B Hotel " +
            hotel[i][0].charAt(0).toUpperCase() +
            hotel[i][0].slice(1) +
            " in " +
            hotel[i][1],
          price,
        ]);
      } else if (price >= 60) {
        console.log(
          "B&B Hotel " +
            hotel[i][0].charAt(0).toUpperCase() +
            hotel[i][0].slice(1) +
            " in " +
            hotel[i][1] +
            " für " +
            price +
            "€ am " +
            datum +
            " gefunden."
        );
      }
    }
  }

  //   console.clear();
  await browser.close();
  await console.log(hotelPrices);
};

prices();

async function getPrice(hotel, arrivalDate, link) {
  test = 0;
  console.log("link: " + link);
  if (browser == "") {
    browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [`--disable-extensions-except=${EXTENSIONS.toString()}`],
    });
  }

  const page = await browser.newPage();
  await page.goto(link);

  // try catch block to catch the error if unavailable-title element is not found
  try {
    //check if value of unavailable-title is "Kein Zimmer Verfügbar" with 5s timeout
    await page
      .waitForSelector(".unavailable-title", { timeout: 5000 })
      .then(() => page.$eval(".unavailable-title", (el) => el.innerText))
      .then((text) => {
        console.log("text: " + text);
        if (text == "Kein Zimmer verfügbar") {
          console.log("...");

          test = 1;
          console.log(".");
        }
      });
  } catch (error) {
    console.log("error");
  }

  if (test == 1) {
    return null;
  }

  const price = await page.$eval(".room-rate__price-main", (e) => e.innerText);
  console.log("!");
  try {
    await page
      .waitForSelector(".room-rate__price-main")
      .then(() => page.$eval(".room-rate__price-main", (el) => el.textContent))
      .then((price) => {
        console.log("2: " + price);
      });
  } catch (e) {
    console.log("price: " + price);

    await page.close();
    return null;
  }
  await page.close();
  console.log("price: " + price);

  //   price = parseFloat(price.slice(3, -2));
  //   console.log("price: " + price);
  return price;
}

function dates(daysAhead, nextday) {
  var date = new Date();
  date.setDate(date.getDate() + daysAhead + nextday);
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var yyyy = date.getFullYear();

  datum = dd.toString() + "." + mm.toString() + "." + yyyy.toString();
  return mm.toString() + "%2F" + dd.toString() + "%2F" + yyyy.toString();
}
