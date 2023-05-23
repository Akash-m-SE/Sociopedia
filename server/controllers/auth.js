import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import UserOtpVerification from '../models/UserOtpVerification.js';
import nodemailer from 'nodemailer';

// REGISTER USER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
    });

    newUser
      .save()
      .then((result) => {
        sendVerificationEmail(result, res);
      })
      .catch((err) =>
        res.json({
          status: 'Failed',
          message: err.message,
        })
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: 'User does not exists' });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendVerificationEmail = async (
  { _id, email, firstName, lastName },
  res
) => {
  let transporter = nodemailer.createTransport({
    service: 'hotmail',
    port: 465,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Welcome to Sociopedia',
      html: `<p> Hi ${firstName} ${lastName}, .</p> <p>We hope you have a great time here connecting with new people.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({
      status: 'SENT',
      message: 'Email Sent',
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: 'Failed',
      message: error.message,
    });
  }
};

// export const verifyOtp = async (req, res) => {
//   try {
//     let { userId, otp } = req.body;
//     if (!userId || !otp) {
//       throw new Error('Opt cannot be empty');
//     } else {
//       const UserOtpVerificationRecord = await UserOtpVerification.find({
//         userId,
//       });
//       if (UserOtpVerificationRecord.length <= 0) {
//         throw new Error('Account does not exist or is already verified');
//       } else {
//         const { expiresAt } = UserOtpVerificationRecord[0];
//         const hashedOtp = UserOtpVerificationRecord[0].otp;

//         if (expiresAt < Date.now()) {
//           await UserOtpVerification.deleteMany({ userId });
//           throw new Error('Otp expired. Try again');
//         } else {
//           const validOtp = await bcrypt.compare(otp, hashedOtp);

//           if (!validOtp) {
//             throw new Error('Invalid Otp');
//           } else {
//             await User.updateOne({ _id: userId }, { verified: true });
//             await UserOtpVerification.deleteMany({ userId });
//             res.json({
//               status: 'Verified',
//               message: 'Email verified',
//             });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     res.json({
//       status: 'Failed',
//       message: error.message,
//     });
//   }
// };
