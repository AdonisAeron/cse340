const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
        errors: null,
    })
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  account_type = res.locals.accountData.account_type
  additional = await utilities.getAdditional(account_type)
  res.render("account/management", {
    title: "Account Management",
    additional: additional,
    nav,
    errors: null
  })
}

async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav()
  accountData = res.locals.accountData
  res.render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
    account_email: accountData.account_email,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_id: accountData.account_id
  })
}

/* ****************************************
*  Process Registration 
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    }
  
    const regResult = await accountModel.accountRegister(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Account Update 
* *************************************** */
async function updateAccountInformation(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

    const updResult = await accountModel.accountUpdateInformation(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you\'ve updated your information.`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Password Update 
* *************************************** */
async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the update.')
  res.status(500).render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
  })
  }

  const updResult = await accountModel.accountUpdatePassword(
    hashedPassword,
    account_id
  )

  if (updResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your password.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement,
  buildAccountUpdate, updateAccountInformation, updateAccountPassword }