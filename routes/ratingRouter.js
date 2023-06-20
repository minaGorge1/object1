const router = require('express').Router();
const ratingController = require('../controller/ratingController.js');
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation.js");
const validators = require("../utils/validators/Validatiors.js");


//stars 
router.patch("/user/:userId/service/:serviceId/numStars/:num",validation.validation(validators.numStars),
    /* auth, */
    ratingController.numStars)

    //showRiting
    router.get("/service/:serviceId",validation.validation(validators.showRiting),
    /* auth, */
    ratingController.showRiting)

    //showRitingByNum
    router.get("/service/:serviceId/numStars/:num",validation.validation(validators.showRitingByNum),
    /* auth, */
    ratingController.showRitingByNum)

module.exports = router;