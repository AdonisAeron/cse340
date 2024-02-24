const utilities = require("../utilities/")
const errorController = {}

errorController.triggerError = async function(req, res, next){
    const err = new Error('An internal server error has occured!')
    err.status = 500;
    next(err)
}

module.exports = errorController