function doGet(e) {
  var tmp = HtmlService.createTemplateFromFile("index")
  tmp.dateToday = dateToday
  tmp.imx1a = displayS1A()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  tmp.imx1b = displayS1B()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  tmp.projects24hrs = displayS224hrs()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  tmp.projects7days = displayS27days()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  tmp.projects30days = displayS230days()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  tmp.projectsTotal = displayS2Total()
    .map((record) => `<tr>${record.map((r) => `<td>${r}</td>`).join("")}</tr>`)
    .join("")
  return tmp.evaluate()
}

function displayS224hrs() {
  var display = []
  var metricsSelected = dataS2.slice(-3)
  metricsSelected.forEach((record) => {
    var data = []
    data.push(record[1])
    data = data.concat(
      record.slice(2, 11).map((record) => formatNumber(record))
    )
    display.push(data)
  })
  return display
}

function displayS27days() {
  var display = []
  var metricsSelected = dataS2.slice(-3)
  metricsSelected.forEach((record) => {
    var data = []
    data.push(record[1])
    data = data.concat(
      record.slice(11, 19).map((record) => formatNumber(record))
    )
    display.push(data)
  })
  return display
}

function displayS230days() {
  var display = []
  var metricsSelected = dataS2.slice(-3)
  metricsSelected.forEach((record) => {
    var data = []
    data.push(record[1])
    data = data.concat(
      record.slice(19, 27).map((record) => formatNumber(record))
    )
    display.push(data)
  })
  return display
}

function displayS2Total() {
  var display = []
  var metricsSelected = dataS2.slice(-3)
  metricsSelected.forEach((record) => {
    var data = []
    data.push(record[1])
    data = data.concat(
      record.slice(27, 36).map((record) => formatNumber(record))
    )
    display.push(data)
  })
  return display
}

function displayS1A() {
  var display = []
  var metricsToday = dataS1A.slice(-2)
  var diffSales = Math.abs(metricsToday[0][2] - metricsToday[1][2]).toFixed(2)
  var diffTrades = Math.abs(metricsToday[0][4] - metricsToday[1][4]).toFixed(2)
  metricsToday.forEach((record) => {
    record.shift()
    record[1] = formatNumber(record[1])
    record[2] = formatPercent(record[2])
    record[3] = formatNumber(record[3])
    record[4] = formatNumber(record[4])
    display.push(record)
  })
  display.push(["Difference", diffSales, "", diffTrades, ""])

  return display
}

function displayS1B() {
  var display = []
  var metricsToday = dataS1B.slice(-10)
  metricsToday.forEach((record) => {
    record.shift()
    Logger.log(record)
    record[2] = formatNumber(record[2])
    record[3] = formatPercent(record[3])
    record[4] = formatNumber(record[4])
    record[5] = formatNumber(record[5])
    display.push(record)
  })

  return display
}

function formatPercent(per) {
  return `${(per * 100).toFixed(2)}%`
}

function formatNumber(num) {
  return num.toString().includes(".")
    ? num.toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
    : num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent()
}
