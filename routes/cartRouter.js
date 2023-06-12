const router = require('express').Router();
const cartController = require('../controller/cartController.js');
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");

router.post("/",validation.validation(validators.addToCart),
    cartController.addToCart)

router.patch("/clear",validation.validation(validators.clearCart),
    cartController.clearCart)

module.exports = router;