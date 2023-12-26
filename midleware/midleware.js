const managerToken = require ("../managerToken/managerToken");
const jwt = require("jsonwebtoken");

const midlewareAuth = {
    verifyTokenLarkSuite: async (req,res,next) => {
        let now =  Date.now();
        let dataLarkSuite =  managerToken.getUserAccessToken();
        let timeOut = (now - dataLarkSuite.timeGetToken) / 1000;
        if (timeOut >= 6900) {
            await managerToken.handleGetNewAccessToken()
            .then(() => {
                next();
            })
            .catch(error => {
                console.error('Không thể lấy mới AccessToken:', error);
                res.status(500).json({ error: 'Internal server error' });
            });
        }
        else {
            next();
        }
    },
    verifyToken: (req, res,next) => {
        const token = req.headers.token;
        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            })
        }
        else{
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndUserAuth:(req, res, next) => {
        midlewareController.verifyToken(req,res,()=>{
            if(req.user.id == req.params.id){
                next();
            }
            else{
                return res.status(403).json("You're not allowed");
            }
        });
    }
}
module.exports = midlewareAuth