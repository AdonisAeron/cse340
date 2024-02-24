const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (!data || data.length === 0) {
    const err = new Error('An internal server error has occured!')
    err.status = 404;
    err.message = "The category you are trying to view does not exist!"
    return next(err)
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build pages by Inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inv_id)
  if (!data || data.length === 0) {
    const err = new Error('An internal server error has occured!')
    err.status = 404;
    err.message = "The item you are trying to view does not exist!"
    return next(err)
  }
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  if (data[0].classification_name == 1) {
    invName = data[0].inv_model + ' ' + data[0].inv_make
  } else {
    invName = data[0].inv_make + ' ' + data[0].inv_model
  }
  res.render("./inventory/item", {
    title: invName,
    nav,
    grid,
  })
}

module.exports = invCont