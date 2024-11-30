import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const applicationEmail = (receiver, applicationId) => ({
  from: "aeiluminate@gmail.com",
  to: receiver,
  subject: "Application Successful: aeIluminate Alumni Account",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">Application Successful!</h2>
        <p>Dear applicant,</p>
        <p>We are pleased to inform you that your application for an <b>aeIluminate Alumni Account</b> has been received successfully.</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p>Please wait for further notifications regarding your account application. The verification process typically takes up to <strong>3 working days</strong>.</p>
        <p>If you have any questions, feel free to contact us at <a href="mailto:aeiluminate100@gmail.com">aeiluminate100@gmail.com</a>.</p>
        <br/>
        <p>Best regards,</p>
        <p>The aeIluminate Team</p>
      </div>
    `,
});

export const applicationAcceptedEmail = (receiver, applicationId) => ({
  from: "aeiluminate100@gmail.com",
  to: receiver,
  subject: "Congratulations! Your Application Has Been Accepted",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">Welcome to aeIluminate Alumni</h2>
        <p>Dear user,</p>
        <p>We are pleased to inform you that your application for the aeIluminate Alumni Account has been <strong>accepted</strong>!</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p>You can now access your alumni account and explore the various features we offer to keep you connected with our vibrant community.</p>
        <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:aeiluminate100@gmail.com">aeiluminate100@gmail.com</a>.</p>
        <p>We look forward to seeing you contribute and thrive as part of our alumni family!</p>
        <br/>
        <p>Best regards,</p>
        <p>The aeIluminate Team</p>
      </div>
    `,
});

export const forgotPasswordEmail = (receiver, otp) => ({
  from: "aeiluminate@gmail.com",
  to: receiver,
  subject: "Password Reset Request: Your OTP Code",
  html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">Reset Your Password</h2>
        <p>Dear user,</p>
        <p>You have requested to reset your password. Please use the OTP (One-Time Password) below to complete the process:</p>
        <h3 style="color: #0056b3; text-align: center;">${otp}</h3>
        <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
        <p>If you have any concerns, feel free to contact us at <a href="mailto:aeiluminate100@gmail.com">aeiluminate100@gmail.com</a>.</p>
        <br/>
        <p>Best regards,</p>
        <p>The aeIluminate Team</p>
      </div>
    `,
});