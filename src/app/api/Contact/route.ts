import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const {name, email, message} = await req.json();
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `Brady's Bytes Contact Form from ${name}`,
        text: `A message has been received from ${name} (${email}):\n\n${message}`,
    }

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({success:true});
    } catch (error) {
        if (error instanceof Error)
            return NextResponse.json({success:false, error:error.message});
        else 
            return NextResponse.json({success:false});
    }
}