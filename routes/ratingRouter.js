const router = require('express').Router();
const ratingController = require('../controller/ratingController.js');
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");


//stars 
router.patch("/user/:userId/service/:serviceId/numStars/:num",validation.validation(validators.numStars),
    /* auth, */
    ratingController.numStars)

module.exports = router;