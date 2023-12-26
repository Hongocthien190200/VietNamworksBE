const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchTableData = require('../managerToken/managerToken');
const lark = require('@larksuiteoapi/node-sdk');
const client = new lark.Client({
    appId: 'app id',
    appSecret: 'app secret',
});


let refreshTokensArr = [];
const authController = {
    registerUser: async (req, res) => {
        const allUser = await fetchTableData.fetchTableData('tbljPeXR9ifIjce8');
        const isExistUser = allUser.data.items.some((item) => item.fields.userName.includes(req.body.userName));
        if (isExistUser) {
            return res.status(500).json("Tên tài khoản đã tồn tại");
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.passWord, salt);

            const userToken = fetchTableData.getUserAccessToken();

            client.bitable.appTableRecord.create({
                path: {
                    app_token: 'R8qjb9S2ualuZCs8E66l1JCUgYc',
                    table_id: 'tbljPeXR9ifIjce8',
                },
                data: {
                    "fields": {
                        "userName": req.body.userName,
                        "eMail": req.body.eMail,
                        "phoneNumber": req.body.phoneNumber,
                        "fullName": req.body.fullName,
                        "passWord": hashed
                    }
                },
            },
                lark.withUserAccessToken(userToken.token)
            ).then(response => {
                console.log(response);
                res.status(200).json("Đăng ký thành công");
            }).catch(error => {
                res.status(500).json("Tạo tài khoản không thành công" + error);
            });
        }


    },
    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
        }, process.env.JWT_ACCESS_KEY,
            { expiresIn: "2m" }
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
        }, process.env.JWT_REFRESHTOKEN_KEY,
            { expiresIn: "365d" }
        );
    },
    //Login
    loginUser: async (req, res) => {
        const allUser = await fetchTableData.fetchTableData('tbljPeXR9ifIjce8');
        const isExistUser = allUser.data.items.some((item) => item.fields.userName.includes(req.body.userName));
        const user = allUser.data.items.filter((item) => item.fields.userName.includes(req.body.userName));
        if (!isExistUser) {
            return res.status(404).json("wrong username!");
        }
        const validPassword = bcrypt.compare(
            req.body.passWord, user[0].fields.passWord
        );
        if (!validPassword) {
            return res.status(404).json("Wrong password!");
        }
        if (isExistUser && validPassword) {
            const accessToken = authController.generateAccessToken(user[0]);
            const refreshToken = authController.generateRefreshToken(user[0]);
            refreshTokensArr.push(refreshToken);
            const id = user[0].id;
            const { passWord,...others } = user[0].fields;
            res.status(200).json({ ...others,id, accessToken, refreshToken });
        }
        else{
            res.status(500).json("Login không thành công");
        }
    },
    logoutUser: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokensArr = refreshTokensArr.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out!!!");
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.body.token;
        if (!refreshToken) return res.status(401).json("you're not authenticated");
        if (!refreshToken.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokensArr = refreshTokensArr.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokensArr.push(newRefreshToken);
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        })
    }
}
module.exports = authController;
