const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require('jimp');
const {nanoid} = require("nanoid");

const { User } = require('../models/user');

const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');

const { SECRET_KEY, BASE_URL} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (user) {
      throw HttpError(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});
    
    const verifyEmail = {
      to: email,
      subject: 'Verify your email',
      html: `<a target='_blank' href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
    };
  
    await sendEmail(verifyEmail);

res.status(201).json({
  user:
    {email: newUser.email,
    subscription: newUser.subscription,}
})
}

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({
    message: 'Verification successful',
  });
};

const repeatEmailVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }
  const verifyEmail = {
    to: email,
    subject: 'Verify your email',
    html: `<a target='_blank' href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: 'Verification email sent',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
if (!user.verify) {
    throw HttpError(401, 'Email not verified');
} 
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  throw HttpError(401, 'Email or password is wrong');
}
const payload = { id: user._id };
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
await User.findByIdAndUpdate(user._id, { token });
res.status(200).json({
  token: token,
  user: {
    email: user.email,
    subscription: user.subscription,
  },
});
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json({});
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  if (!req.body) throw HttpError(400, "missing field subscription");

  const { email, subscription } = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!email || !subscription) throw HttpError(404, "Not found");

  res.status(201).json({ email, subscription });
};

const updateAvatar = async(req, res)=> {
  const {_id} = req.user;
  const {path: tmpUpload, originalname} = req.file;
  const img = await Jimp.read(tmpUpload);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tmpUpload);
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, {avatarURL});

  res.json({
      avatarURL,
  })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  repeatEmailVerify: ctrlWrapper(repeatEmailVerify),
}


