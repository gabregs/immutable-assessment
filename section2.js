// Import the sheet.js file and the fetch module
const Sheet = require("./sheets")
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))

;(async () => {
  // Create a new instance of the Sheet class and pass in the google spreadsheet ID
  const sheet = new Sheet("1_OB7KIX-RYc7ZMspJ0QSaWnElfFCgVLfDDTOvXHl6DU")
  await sheet.load()

  // var newDate = new Date()
  // var globalTodayDate = newDate.toISOString().slice(0, 10)
  // newDate.setDate(newDate.getDate() - 1)
  // var globalYdayDate = newDate.toISOString().slice(0, 10)
  var globalTodayDate = "2022-08-26"
  var globalYdayDate = "2022-08-25"

  console.log(globalTodayDate)
  console.log(globalYdayDate)

  // var remaining = 1
  // var cursorCode = ""
  // var uniqueTokenAddresses = []

  // while (remaining != 0) {
  //   var reqIMXTrades = await fetch(
  //     `https://api.x.immutable.com/v1/trades?page_size=200&order_by=transaction_id&direction=desc&min_timestamp=${globalYdayDate}T00%3A00%3A00Z&max_timestamp=${globalTodayDate}T00%3A00%3A00Z&cursor=` +
  //       cursorCode,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       method: "GET",
  //     }
  //   )

  //   var resIMXTrades = await reqIMXTrades.json()

  //   var results = resIMXTrades.result

  //   for (let i = 0; i < results.length; i++) {
  //     var result = results[i]
  //     var nftTokenAddress = result.b.token_address
  //     if (uniqueTokenAddresses.includes(nftTokenAddress) == false) {
  //       uniqueTokenAddresses.push(nftTokenAddress)
  //     }
  //   }

  //   remaining = resIMXTrades.remaining
  //   cursorCode = resIMXTrades.cursor
  // }
  // console.log(`${uniqueTokenAddresses.length} unique projects traded today`)

  // var projectDetails = []

  // for (var j = 0; j < uniqueTokenAddresses.length; j++) {
  //   var projectTokenAddress = uniqueTokenAddresses[j]
  //   var reqProjectDetails = await fetch(
  //     `https://api.x.immutable.com/v1/collections/` + projectTokenAddress,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       method: "GET",
  //     }
  //   )

  //   var resProjectDetails = await reqProjectDetails.json()

  //   var projectNameIS = resProjectDetails.name
  //   var projectNameCS =
  //     projectNameIS == "Gods Unchained"
  //       ? "Gods Unchained Immutable"
  //       : projectNameIS

  //   projectDetails.push({
  //     date: globalYdayDate,
  //     immutascan: projectNameIS,
  //     token_address: projectTokenAddress,
  //     cryptoslam: projectNameCS,
  //     chain_id: projectNameCS.toLowerCase().replaceAll(" ", "-"),
  //   })
  // }

  // sheet.addRows(projectDetails, 154986296)

  var projectDetails = [
    // {
    //   date: globalYdayDate,
    //   immutascan: "Gods Unchained",
    //   token_address: "0xacb3c6a43d15b907e8433077b6d38ae40936fe2c",
    //   cryptoslam: "Gods Unchained Immutable",
    //   chain_id: "gods-unchained-immutable",
    // },
    // {
    //   date: globalYdayDate,
    //   immutascan: "ImmutaSwap.io",
    //   token_address: "0x49bc6ef4daf9441571ed1578ca8407ca2a333785",
    //   cryptoslam: "ImmutaSwap.io",
    //   chain_id: "immutaswap.io",
    // },
    {
      date: globalYdayDate,
      immutascan: "Hro",
      token_address: "0x8cb332602d2f614b570c7631202e5bf4bb93f3f6",
      cryptoslam: "Hro",
      chain_id: "hro",
    },
  ]

  var allMetrics = []

  for (var k = 0; k < projectDetails.length; k++) {
    var details = projectDetails[k]

    var reqISProject = await fetch(
      "https://3vkyshzozjep5ciwsh2fvgdxwy.appsync-api.us-west-2.amazonaws.com/graphql",
      {
        headers: {
          "x-api-key": "da2-ihd6lsinwbdb3e6c6ocfkab2nm",
          "Content-Type": "application/json",
        },
        body: `{"operationName":"getMetricsAll","variables":{"address":"${details.token_address}"},"query":"query getMetricsAll($address: String!) {\\n  getMetricsAll(address: $address) {\\n    items {\\n      type\\n      trade_volume_usd\\n      trade_volume_eth\\n      floor_price_usd\\n      floor_price_eth\\n      trade_count\\n      owner_count\\n      __typename\\n    }\\n    __typename\\n  }\\n  latestTrades(address: $address) {\\n    items {\\n      transfers {\\n        token {\\n          token_address\\n          quantity\\n          token_id\\n          type\\n          usd_rate\\n          __typename\\n        }\\n        __typename\\n      }\\n      txn_time\\n      txn_id\\n      __typename\\n    }\\n    __typename\\n  }\\n}" }`,
        method: "POST",
      }
    )

    var resISProject = await reqISProject.json()

    var metricsIS = resISProject.data.getMetricsAll.items

    var metricsIS24 = metricsIS.find((day) => day.type == globalYdayDate)
    var metricsIS24Sales = metricsIS24.trade_volume_usd
    var metricsIS24Trades = metricsIS24.trade_count

    // How to get unique buyers for IS
    var remainingBuyers = 1
    var buyerCursorCode = ""
    var uniqueBuyers = []

    while (remainingBuyers != 0) {
      var reqGetBuyersIS24 = await fetch(
        `https://api.x.immutable.com/v1/orders?page_size=200&order_by=created_at&status=filled&buy_token_address=${details.token_address}&min_timestamp=${globalYdayDate}T00%3A00%3A00Z&max_timestamp=${globalTodayDate}T00%3A00%3A00Z&cursor=${buyerCursorCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      )

      var resGetBuyersIS24 = await reqGetBuyersIS24.json()

      var orderResults = resGetBuyersIS24.result

      for (var l = 0; l < orderResults.length; l++) {
        var order = orderResults[l]
        var buyerAddress = order.user
        if (uniqueBuyers.includes(buyerAddress) == false) {
          uniqueBuyers.push(buyerAddress)
        }
      }

      remainingBuyers = resGetBuyersIS24.remaining
      buyerCursorCode = resGetBuyersIS24.cursor
    }

    var metricsIS24Buyers = uniqueBuyers.length

    var metricsIS7 = metricsIS.slice(2, 9)
    var metricsIS7Sales = 0
    var metricsIS7Trades = 0
    metricsIS7.forEach((day) => {
      metricsIS7Sales += day.trade_volume_usd
      metricsIS7Trades += day.trade_count
    })

    var metricsIS30 = metricsIS.slice(2, 32)
    var metricsIS30Sales = 0
    var metricsIS30Trades = 0
    metricsIS30.forEach((day) => {
      metricsIS30Sales += day.trade_volume_usd
      metricsIS30Trades += day.trade_count
    })

    var metricsISALL = metricsIS.find((record) => record.type == "total")
    var metricsISALLSales = metricsISALL.trade_volume_usd
    var metricsISALLTrades = metricsISALL.trade_count
    var metricsISALLBuyers = metricsISALL.owner_count

    var reqCSProject = await fetch(
      `https://api2.cryptoslam.io/api/sales/${details.chain_id.replaceAll(
        "-",
        "%20"
      )}/summary`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )

    var resCSProject = await reqCSProject.json()

    var currentYear = globalYdayDate.split("-")[0]
    var currentMonth = globalYdayDate.split("-")[1][1]

    var metricsCS = resCSProject
      .find(
        (record) => record.month == currentMonth && record.year == currentYear
      )
      .dailyAggregations.reverse()

    if (metricsCS.length != 30) {
      metricsCS = metricsCS.concat(
        resCSProject
          .find(
            (record) =>
              record.month == Number(currentMonth) - 1 &&
              record.year == currentYear
          )
          .dailyAggregations.slice(metricsCS.length - 30)
          .reverse()
      )
    }

    var metricsCS24 = metricsCS.find(
      (day) => day.salesDateEST == globalYdayDate + "T00:00:00"
    ).dailySummary.summary
    var metricsCS24Sales = metricsCS24.priceUSD
    var metricsCS24Trades = metricsCS24.totalTransactions
    var metricsCS24Buyers = metricsCS24.uniqueBuyers

    var metricsCS7 = metricsCS.slice(0, 7)
    var metricsCS7Sales = 0
    var metricsCS7Trades = 0
    var metricsCS7Buyers = 0
    metricsCS7.forEach((day) => {
      var summary = day.dailySummary.summary
      metricsCS7Sales += summary.priceUSD
      metricsCS7Trades += summary.totalTransactions
      metricsCS7Buyers += summary.uniqueBuyers
    })

    var metricsCS30 = metricsCS
    var metricsCS30Sales = 0
    var metricsCS30Trades = 0
    var metricsCS30Buyers = 0
    metricsCS30.forEach((day) => {
      var summary = day.dailySummary.summary
      metricsCS30Sales += summary.priceUSD
      metricsCS30Trades += summary.totalTransactions
      metricsCS30Buyers += summary.uniqueBuyers
    })

    var metricsCSALL = resCSProject
    var metricsCSALLSales = 0
    var metricsCSALLTrades = 0
    var metricsCSALLBuyers = 0
    metricsCSALL.forEach((month) => {
      metricsCSALLSales += month.monthlyAggregation.summary.priceUSD
      metricsCSALLTrades += month.monthlyAggregation.summary.totalTransactions
      metricsCSALLBuyers += month.monthlyAggregation.summary.uniqueBuyers
    })

    allMetrics.push({
      date: globalYdayDate,
      project: details.immutascan,
      is_sales_24hrs: metricsIS24Sales,
      is_trades_24hrs: metricsIS24Trades,
      is_buyers_24hrs: metricsIS24Buyers,
      cs_sales_24hrs: metricsCS24Sales,
      cs_trades_24hrs: metricsCS24Trades,
      cs_buyers_24hrs: metricsCS24Buyers,
      diff_sales_24hrs: Math.abs(metricsIS24Sales - metricsCS24Sales),
      diff_trades_24hrs: Math.abs(metricsIS24Trades - metricsCS24Trades),
      diff_buyers_24hrs: Math.abs(metricsIS24Buyers - metricsCS24Buyers),

      is_sales_7days: metricsIS7Sales,
      is_trades_7days: metricsIS7Trades,
      // is_buyers_7days: metricsIS7Buyers,
      cs_sales_7days: metricsCS7Sales,
      cs_trades_7days: metricsCS7Trades,
      cs_buyers_7days: metricsCS7Buyers,
      diff_sales_7days: Math.abs(metricsIS7Sales - metricsCS7Sales),
      diff_trades_7days: Math.abs(metricsIS7Trades - metricsCS7Trades),

      is_sales_30days: metricsIS30Sales,
      is_trades_30days: metricsIS30Trades,
      // is_buyers_30days: metricsIS30Buyers,
      cs_sales_30days: metricsCS30Sales,
      cs_trades_30days: metricsCS30Trades,
      cs_buyers_30days: metricsCS30Buyers,
      diff_sales_30days: Math.abs(metricsIS30Sales - metricsCS30Sales),
      diff_trades_30days: Math.abs(metricsIS30Trades - metricsCS30Trades),

      is_sales_Total: metricsISALLSales,
      is_trades_Total: metricsISALLTrades,
      is_buyers_Total: metricsISALLBuyers,
      cs_sales_Total: metricsCSALLSales,
      cs_trades_Total: metricsCSALLTrades,
      cs_buyers_Total: metricsCSALLBuyers,
      diff_sales_Total: Math.abs(metricsISALLSales - metricsCSALLSales),
      diff_trades_Total: Math.abs(metricsISALLTrades - metricsCSALLTrades),
      diff_buyers_Total: Math.abs(metricsISALLBuyers - metricsCSALLBuyers),
    })
  }

  sheet.addRows(allMetrics, 1643147692)
})()

// sheet.addRows(allMetrics, 273149048)
// allMetrics.push(
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "24hrs",
//     platform: "Immutascan",
//     sales: metricsIS24Sales,
//     trades: metricsIS24Trades,
//     buyers: metricsIS24Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "24hrs",
//     platform: "CryptoSlam",
//     sales: metricsCS24Sales,
//     trades: metricsCS24Trades,
//     buyers: metricsCS24Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "7days",
//     platform: "Immutascan",
//     sales: metricsIS7Sales,
//     trades: metricsIS7Trades,
//     // buyers: metricsIS7Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "7days",
//     platform: "CryptoSlam",
//     sales: metricsCS7Sales,
//     trades: metricsCS7Trades,
//     buyers: metricsCS7Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "30days",
//     platform: "Immutascan",
//     sales: metricsIS30Sales,
//     trades: metricsIS30Trades,
//     // buyers: metricsIS30Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "30days",
//     platform: "CryptoSlam",
//     sales: metricsCS30Sales,
//     trades: metricsCS30Trades,
//     buyers: metricsCS30Buyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "Total",
//     platform: "Immutascan",
//     sales: metricsISALLSales,
//     trades: metricsISALLTrades,
//     buyers: metricsISALLBuyers,
//   },
//   {
//     date: globalYdayDate,
//     project: details.immutascan,
//     range: "Total",
//     platform: "CryptoSlam",
//     sales: metricsCSALLSales,
//     trades: metricsCSALLTrades,
//     buyers: metricsCSALLBuyers,
//   }
// )
