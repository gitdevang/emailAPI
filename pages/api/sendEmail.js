// pages/api/submit-form.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, mobile, email, services, message } = req.body;
    let company;
    if (req.body.company) {
      company = req.body.company;
    }

    // Nodemailer setup (yahan tum apne email configuration daaloge)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options (who will receive the email)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL, // Email where you want to receive the form data
      subject: `Business Enquiry from ${name}`,
      text: `
            Name: ${name}\n
            Email: ${email}\n
            Mobile: ${mobile}\n
            Services: ${services}\n
            ${company ? `Company : ${company}\n` : null}
            Message: ${message}
          `,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Your message sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error Occured - Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Error: Method Not Allowed" });
  }
}
