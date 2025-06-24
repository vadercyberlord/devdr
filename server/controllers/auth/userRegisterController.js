// imports
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import transporter from "../../config/nodemailer.js";

const registerController = async (req, res) => {
  // get the user info from req.body
  // check if all the fields are complete filled
  // check if user already exists?
  // hash the password
  // register the new user in the db
  // generate a token
  // save the token in cooke

  try {

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    if (!process.env.JWT_SECRET || !process.env.SENDERS_EMAIL) {
      throw new Error(
        "Missing environment variables: JWT_SECRET or SENDERS_EMAIL"
      );
    }

    // get the user info from req.body
    const {name, email, password } = req.body;

    // check if all the fields are complete filled
    if (!email || !password  || !name) {
      return res.status(400).json({
        success: false,
        message:
          "user credentials are required to complete registration",
        receivedData: { email, password,name },
      });
    }

    // check if user already exists?
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with following credentials already Exists",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // register the new user in the db
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "error occured while registering new user to db after hashing",
      });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days in milisec
    });


    //sending welcome mail
    const mailOptions = {
      from: process.env.SENDERS_EMAIL,
      to: email,
      subject: "Welcome here",
      html: `<h3>Welcome to our platform,</h3><p>Thanks for signing up with ${email}. We're glad to have you!</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
      token,
    });
  } catch (error) {
    // console.error("\n Error occured while registering the user : ", error);

    res.status(500).json({
      success: false,
      message: "internal server error occured while registering user",
      data: error.message,
    });
  }
};

export default registerController;
