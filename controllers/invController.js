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
    errors: null,
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
    errors: null,
  })
}

/* ***************************
 *  Build pages Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const options = await utilities.getOptions()
  res.render("./inventory/management", {
      title: "Management",
      nav,
      options,
      errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
      title: "Classification Mangement",
      nav,
      errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const options = await utilities.getOptions()
  res.render("./inventory/add-inventory", {
      title: "Inventory Management",
      nav,
      options,
      errors: null,
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addClassResult = await invModel.addClassification(classification_name)

  if (addClassResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${classification_name} to the database!`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Classification Mangement",
      nav,
      errors: null,
    })
  }
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const options = await utilities.getOptions(classification_id)

  const addClassResult = await invModel.addItem( inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id )

  if (addClassResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${inv_make + ' ' + inv_model} to the database!`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Inventory Mangement",
      nav,
      options,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont