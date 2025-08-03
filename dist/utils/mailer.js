"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, // Your Gmail address from .env
        pass: process.env.MAIL_PASS, // App password from .env
    },
});
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Task Manager 👨‍💻" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`📧 Email sent to ${to}`);
    }
    catch (err) {
        console.error(`❌ Failed to send email to ${to}`, err);
    }
};
exports.sendEmail = sendEmail;
