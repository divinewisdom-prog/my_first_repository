import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
    // Development fallback: Always log OTP
    console.log(`\n============================`);
    console.log(`🔐 OTP for ${email}: ${otp}`);
    console.log(`============================\n`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ No email credentials found in .env (EMAIL_USER, EMAIL_PASS). OTP verification will only work via console logs.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use host/port from env
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Well-Link Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Login Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Verification Required</h2>
                    <p>Please use the following One-Time Password (OTP) to complete your login:</p>
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">${otp}</span>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send OTP email:', error);
        // Don't throw - we still want to allow login if email fails in dev (via console log)
    }
};
