const { GoogleSpreadsheet } = require("google-spreadsheet")

module.exports = class Sheet {
  constructor(args) {
    this.doc = new GoogleSpreadsheet(args)
  }

  async load() {
    await this.doc.useServiceAccountAuth(
      require("./credentials/credentials.json")
    )
    await this.doc.loadInfo()
  }
  async addRows(rows, sheetID) {
    const sheet = this.doc.sheetsById[sheetID] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    await sheet.addRows(rows)
    // rows is an array of objs [{col_name:'value_of_col_name', col_name2:'value_of_col_name2'}]
  }
  async getRows() {
    const sheet = this.doc.sheetsByIndex[0]
    return await sheet.getRows()
  }
}
