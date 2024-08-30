require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const randomize = require('randomatic');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://jonnnny80:JustMon1ka@mfa-mern.cg5ks.mongodb.net/?retryWrites=true&w=majority&appName=mfa-mern', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = mongoose.model('User', {
    email: String,
    password: String,
    otp: String
});

async function sendOtpEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',      // Zoho SMTP server
            port: 465,                   // Secure SMTP port
            secure: true,                // Use SSL
            auth: {
                user: 'autosender23@zohomail.com', // Your Zoho email
                pass: 'Hxz2v4A7qF#BaJs'           // Your Zoho password or App Password
            },
            tls: {
                // Optional: Specify minimum TLS version if needed
                minVersion: 'TLSv1.2'
            }
        });

        const mailOptions = {
            from: 'autosender23@zohomail.com',
            to: email,
            subject: 'OTP verification',
            text: `Your OTP is ${otp}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        console.log(error);
    }
}

app.post('/auth/register', async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists'
            });
        }

        const newUser = new User({email, password});
        await newUser.save();

        return res.json({success: true, message: "New user created"});
    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.status(500).json({success: false, message: 'An error occurred during registration'});
    }
});

app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({email, password});
        console.log(user);
        if (!user) {
            return res.json(
                {
                    success: false,
                    message: 'Invalid Credentials'
                }
            );
        }

        const generatedOtp = randomize('0', 6);
        user.otp = generatedOtp;
        await user.save();

        sendOtpEmail(email, generatedOtp);

        return res.json({ success: true});
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'An error occurred during login.'
            }
        );
    }
});

app.post('/auth/verify-otp', async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({otp});

        if (!user) {
            return res.json(
                {
                    success: false, 
                    message:'Invalid OTP'
                }
            );
        }

        user.otp = '';
        await user.save();

        return res.json({success: true});
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        return res.status(500).json(
            {
                success: false,
                message: 'An error occurred during OTP verification'
            }
        );
    }
});

app.listen(3001, () => {
    console.log('Server is running!');
});
