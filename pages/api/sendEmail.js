import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://qualipact.com/"); // **Development me localhost use karein**
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method === "POST") {
    const { name, mobile, email, services, message } = req.body;

    // Make sure required fields are present
    if (!name || !mobile || !email || !services || !message) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    let company = req.body.company && req.body.company.length > 0 ? req.body.company : '';

    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL, 
      subject: `Business Enquiry from ${name}`,
      text: `
        Name: ${name}\n
        Email: ${email}\n
        Mobile: ${mobile}\n
        Services: ${services}\n
        ${company.length > 0 ? `Company: ${company}\n` : ''}
        Message: ${message}
      `,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Your message sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error Occurred - Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Error: Method Not Allowed" });
  }
}
