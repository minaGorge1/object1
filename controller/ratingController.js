
const ratingModel = require("../models/ratingModel.js");


const numStars = async (req, res, next) => {
    try {
        const { num, serviceId, userId } = req.params;
        const number = parseInt(num)
        const rate = await ratingModel.findOneAndUpdate({ userId: userId }, { serviceId: serviceId, noOfStars: number }, { new: true })

        if (!rate) {
            const newRate = await ratingModel.create({ userId: userId, serviceId: serviceId, noOfStars: number })
            return res.status(201).send({ message: "Done", newRate })
        }
        return res.status(201).send({ message: "Done", rate })
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}

const showRiting = async (req, res, next) => {
    try {
        const { num, serviceId } = req.params;
        const number = parseInt(num)
        const rate = await ratingModel.find({ serviceId: serviceId, noOfStars: number })
        const countRiting = rate.length
        if (!rate) {
            return res.status(201).send({ message: "empty" })
        }
        return res.status(201).send({ message: "Done", rate , cfountRiting })
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}
module.exports = {
    numStars,
    showRiting
}

