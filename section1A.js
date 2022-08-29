// Import the sheet.js file and the fetch module
const Sheet = require("./sheets")
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))

;(async () => {
  // Create a new instance of the Sheet class and pass in the google spreadsheet ID
  const sheet = new Sheet("1_OB7KIX-RYc7ZMspJ0QSaWnElfFCgVLfDDTOvXHl6DU")
  await sheet.load()

  var newDate = new Date()
  var globalTodayDate = newDate.toISOString().slice(0, 10)
  newDate.setDate(newDate.getDate() - 1)
  var globalYdayDate = newDate.toISOString().slice(0, 10)
//   var globalTodayDate = "2022-08-25"
//   var globalYdayDate = "2022-08-24"

  console.log(globalTodayDate)
  console.log(globalYdayDate)

  // GET API Request for Immutascan (IMX)
  var reqIS = await fetch(
    "https://3vkyshzozjep5ciwsh2fvgdxwy.appsync-api.us-west-2.amazonaws.com/graphql",
    {
      headers: {
        "x-api-key": "da2-ihd6lsinwbdb3e6c6ocfkab2nm",
        "Content-Type": "application/json",
      },
      body: '{"operationName":"getMetricsAll","variables":{"address":"global"},"query":"query getMetricsAll($address: String!) {\\n  getMetricsAll(address: $address) {\\n    items {\\n      type\\n      trade_volume_usd\\n      trade_volume_eth\\n      floor_price_usd\\n      floor_price_eth\\n      trade_count\\n      owner_count\\n      __typename\\n    }\\n    __typename\\n  }\\n  latestTrades(address: $address) {\\n    items {\\n      transfers {\\n        token {\\n          token_address\\n          quantity\\n          token_id\\n          type\\n          usd_rate\\n          __typename\\n        }\\n        __typename\\n      }\\n      txn_time\\n      txn_id\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}',
      method: "POST",
    }
  )
  var resIS = await reqIS.json()
  var daysIS = resIS.data.getMetricsAll.items

  var todayIS = daysIS.find((day) => day.type == globalTodayDate)
  var todayISSales = todayIS.trade_volume_usd
  var todayISTrades = todayIS.trade_count

  var ydayIS = daysIS.find((day) => day.type == globalYdayDate)
  var ydayISSales = ydayIS.trade_volume_usd

  var diffIS = todayISSales - ydayISSales
  var changeIS = (diffIS / ydayISSales) * 100
  var percentChangeIS = `${changeIS.toFixed(2)}%`

  // GET API Request for CryptoSlam (IMX)
  var reqCS = await fetch(
    "https://api2.cryptoslam.io/api/nft-indexes/Immutablex",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  )
  var resCS = await reqCS.json()
  var daysCS = resCS[globalTodayDate.slice(0, 7)].dailySummaries

  var todayCS = daysCS[globalTodayDate + "T00:00:00"]
  var todayCSSales = todayCS.totalPriceUSD
  var todayCSTXns = todayCS.totalTransactions
  var todayCSBuyers = todayCS.uniqueBuyers

  var ydayCS = daysCS[globalYdayDate + "T00:00:00"]
  var ydayCSSales = ydayCS.totalPriceUSD

  var diffCS = todayCSSales - ydayCSSales
  var changeCS = (diffCS / ydayCSSales) * 100
  var percentChangeCS = `${changeCS.toFixed(2)}%`

  // Append row to specific Sheet ID
  sheet.addRows(
    [
      {
        date: globalTodayDate,
        platform: "Immutascan",
        sales: todayISSales,
        percent_change: percentChangeIS,
        trades: todayISTrades,
        buyers: "",
      },
      {
        date: globalTodayDate,
        platform: "CryptoSlam",
        sales: todayCSSales,
        percent_change: percentChangeCS,
        trades: todayCSTXns,
        buyers: todayCSBuyers,
      },
    ],
    0
  )
})()
