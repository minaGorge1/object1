const router = require('express').Router();
const orderController = require('../controller/orderController.js');
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");

router.post("/",validation.validation(validators.createOrder),
    orderController.createOrder)

    router.delete("/:orderId/user/:userId",validation.validation(validators.cancelOrder),
    orderController.cancelOrder)

module.exports = router;