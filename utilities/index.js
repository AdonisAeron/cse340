const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="/' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryGrid = async function(data){
    let grid
    if(data.length > 0){
      let detail = data[0]
      grid = '<ul id="detail-display">'
      grid += '<li>'
      grid +=  '<img src="/' + detail.inv_image +'" alt="Image of '+ detail.inv_make + ' ' 
      + detail.inv_model 
      +' on CSE Motors">'
      grid += '<div class="namePrice">'
      grid += '<h2>$' + new Intl.NumberFormat('en-US').format(detail.inv_price) + '</h2>'
      grid += '<ul>'
      grid += '<li>Mileage: <p>' + detail.inv_miles + '</p></li>'
      grid += '<li>Color: <p>' + detail.inv_color + '</p></li>'
      grid += '<li>Year: <p>' + detail.inv_year + '</p></li>'
      grid += '<li>Description: <p>' + detail.inv_description + '</p></li>'
      grid += '</ul>'
      grid += '</div>'
      grid += '</li>'
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  return grid
}

/* ************************
 * Constructs the add-inventory select statement
 ************************** */
Util.getOptions = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = '<select id="classification_id" name="classification_id" required>'
  data.rows.forEach((row) => {
      list += '<option value="' + row.classification_id + '">' + row.classification_name + '</option>'
  })
  list += "</select><br>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors  
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util