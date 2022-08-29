var ss = SpreadsheetApp.getActiveSpreadsheet()

var sheetS1A = ss.getSheetByName("section1A")
var sheetS1B = ss.getSheetByName("section1B")
var sheetS2 = ss.getSheetByName("section2")

var dataS1A = sheetS1A.getDataRange().getValues().slice(1)
var dataS1B = sheetS1B.getDataRange().getValues().slice(1)
var dataS2 = sheetS2.getDataRange().getValues().slice(1)

// var dateToday = new Date().toISOString().slice(0, 10)
var dateToday = "2022-08-25"
