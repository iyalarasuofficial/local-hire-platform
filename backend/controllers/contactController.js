import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { fullName, phone, email, message } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    const newContact = new Contact({ fullName, phone, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Thank you! We’ll get back to you soon.",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
