const jwt = require("jsonwebtoken");
const config = require("../config/config");


const verifyToken = async(req,res,next)=>{
    const token = req.body.token || req.query.token ||req.header('x-auth-token');
    if(!token){
        res.status(200).send({success:false,msg:"A token is required for authentication."});
    }
        try {
            const decoded = jwt.verify(token,config.JWT_SECRET);
                req.userId = decoded._id;
                console.log("Userid :",req.userId)
                next();
        } catch (error) {
            res.status(400).send("Invalid jwt Token");
        }
        //return next();
    
}

module.exports = verifyToken;