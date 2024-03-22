// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.
buildLogin));

router.get("/update", utilities.handleErrors(accountController.buildAccountUpdate));

router.get("/registration", utilities.handleErrors(accountController.
buildRegistration));

router.get("/logout", utilities.handleErrors( (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}))

// Process the registration data
router.post(
    "/registration",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Default view for account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process the update data
router.post(
    "/update-account",
    regValidate.updateInformationRules(),
    regValidate.checkUpdData,
    utilities.handleErrors(accountController.updateAccountInformation)
)

router.post(
    "/update-password",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdPassData,
    utilities.handleErrors(accountController.updateAccountPassword)
)

module.exports = router;