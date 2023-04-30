const jwt = require('jsonwebtoken');
const config = require("../config/config")

const createToken = async(id) =>{
    try {
        const token = jwt.sign({ _id:id }, config.JWT_SECRET,{expiresIn:"1h"}); 
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = createToken;