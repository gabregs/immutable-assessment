// Import the sheet.js file and the puppeteer module
const Sheet = require("./sheets")
const puppeteer = require("puppeteer")

;(async () => {
  // Create a new instance of the Sheet class and pass in the google spreadsheet ID
  const sheet = new Sheet("1_OB7KIX-RYc7ZMspJ0QSaWnElfFCgVLfDDTOvXHl6DU")
  await sheet.load()

  var globalTodayDate = new Date().toISOString().slice(0, 10)

  // Create a new instance of the puppeteer browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()

  // Go to CryptoSlam website
  await page.goto("https://cryptoslam.io/", {
    waitUntil: "domcontentloaded",
  })
  await page.waitForTimeout(3000)

  // Select each row in the "Blockchains by NFT Sales Vloume (24 hours)"
  var rows = await page.$$("table.js-top-by-sales-table-24h")
  rows = await rows[2].$$("tbody tr")

  var imxIndex = 0
  var bcName = ""
  var top10 = []

  // Scrape the top 10 Blockchains with the highest NFT Sales Volume
  for (let i = 0; i < 10; i++) {
    var productName = await rows[i].$eval(
      "tbody tr span.summary-sales-table__column-product-name",
      (el) => el.textContent
    )
    var salesUSD = await rows[i].$eval(
      "tbody tr td.fantokens-sales a span",
      (el) => Number(el.textContent.replaceAll(",", "").replace("$", ""))
    )
    var change24hr = await rows[i].$eval(
      "tbody tr td.summary-sales-table__column-change span",
      (el) => el.textContent.trim()
    )
    var buyers = await rows[i].$eval(
      "tbody tr td.summary-sales-table__column-buyers",
      (el) => Number(el.textContent.replace(",", ""))
    )
    var txns = await rows[i].$eval(
      "tbody tr td.summary-sales-table__column-txns",
      (el) => Number(el.textContent.replace(",", ""))
    )

    top10.push({
      date: globalTodayDate,
      rank: i + 1,
      chain_name: productName,
      total_sales: salesUSD,
      percent_change: change24hr,
      total_buyers: buyers,
      total_txns: txns,
    })

    if (productName == "ImmutableX") {
      imxIndex = i
      bcName = productName
    }
  }

  // Append rows to specific Sheet ID
  sheet.addRows(top10, 1463447903)

  await page.close()
})()
