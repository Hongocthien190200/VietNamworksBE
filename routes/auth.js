const authController = require('../controllers/authController');
const midleware = require('../midleware/midleware');
const nodemailer = require('nodemailer');
function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * 10); // Only numbers
        key += randomIndex;
    }
    return key;
}

const router = require('express').Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", midleware.verifyToken, authController.logoutUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/create-mail", async (req, res) => {
    const {email} = req.body;
    const randomKey = generateRandomKey();
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "587",
        secure: false,
        auth: {
            user: process.env.Mail_USER,
            pass: process.env.PassMail
        }
    });
    const mailOptions = {
        from: 'vietnamlearning8@gmail.com',
        to: email,
        subject: 'ĐƠN HÀNG CỦA BẠN ĐÃ ĐƯỢC XÁC NHẬN',
        text: `Cảm ơn bạn đã mua hàng từ chúng tôi! Mã khóa học của bạn là: ${randomKey}`,
    }
    try {
        if(email){
            const respone = await transporter.sendMail(mailOptions);
            return res.json(respone);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
    
})
module.exports = router;