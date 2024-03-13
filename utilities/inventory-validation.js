const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add-Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkClassificationName(classification_name)
        if (classificationExists) {
            throw new Error("Clasification Exists. Please use existing classification or use a different name.")
        }
      }),
    ]
}

/* ******************************
 * Check data and return errors or continue to insert
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Classification Mangement",
        nav,
        classification_name
      })
      return
    }
    next()
}

/*  **********************************
 *  Add-Classification Data Validation Rules
 * ********************************* */
validate.addInvRules = () => {
    return [
      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle make."), // on error this message is sent.
  
      // inv_model is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide the vehicle model."), // on error this message is sent.
  
      // inv_year is required and must be number
      body("inv_year")
        .trim()
        .isNumeric()
        .isLength({ min: 4})
        .withMessage("Please provide a vehicle year that is valid."), // on error this message is sent.
  
      // inv_description is required and must be string
      body("inv_description")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide the vehicles description."), // on error this message is sent.
  
      // inv_price is required and must be number
      body("inv_price")
        .trim()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Please provide the vehicles price."), // on error this message is sent.
  
      // inv_color is required and must be number
      body("inv_miles")
        .trim()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Please provide the vehicles miles."), // on error this message is sent.
  
      // inv_color is required and must be string
      body("inv_color")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide the vehicles color."), // on error this message is sent.
  
      // classification is required and must exist
      body("classification_id")
        .trim()
        .custom(async (classification_id) => {
          const classExists = await invModel.checkExistingClass(classification_id)
          if (!classExists) {
              throw new Error("Class does Exists. Please use an existing class.")
          }
        })
        .withMessage("Please provide the vehicles color."),
    ]
}

/* ******************************
 * Check data and return errors or continue to insert
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
    const options = await utilities.getOptions()
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Inventory Mangement",
        nav,
        options,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
      })
      return
    }
    next()
}


module.exports = validate