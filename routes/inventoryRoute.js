// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditByInventoryId));

router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteByInventoryId));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.post("/add-classification",
            invValidate.addClassificationRules(),
            invValidate.checkClassData,
            utilities.handleErrors(invController.addClassification)
             );

router.post("/add-inventory",
            invValidate.addInvRules(),
            invValidate.checkInvData,
            utilities.handleErrors(invController.addInventory)
             );

router.post("/update/",
            invValidate.addInvRules(), 
            invValidate.checkUpdateData,
            utilities.handleErrors(invController.updateInventory)
             );

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;