const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const { cloudinary } = require("../cloudinary");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/register", async(req, res) => {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(password, salt);
      req.body.password = hashedPassword;
      const user = new User(req.body);
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(200)
          .send({ message: "User already exists", success: false });
      } else {
        await user.save();
        return res
          .status(200)
          .send({ message: "User registered successfully", success: true });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      }
      const passwordsMatched = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordsMatched) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        return res.status(200).send({
          message: "User logged in successfully",
          success: true,
          data: token,
        });
      } else {
        return res
          .status(200)
          .send({ message: "Password is incorrect", success: false });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  });

  router.post("/get-user-data", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);
      user.password = undefined;
      return res.status(200).send({
        message: "User data fetched successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  });

  router.post("/update-profile-image", authMiddleware, upload.single("profileImage"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded.", success: false });
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "melobeat-profile-images", // You can change the folder name
        use_filename: true,
      });

      const user = await User.findByIdAndUpdate(req.body.userId, 
        { profileImage: result.url },
        { new: true } // Return the updated user document
      );

      user.password = undefined; // Remove password from the response

      res.status(200).send({
        message: "Profile image updated successfully",
        success: true,
        data: user,
      });

    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).send({
        message: "Something went wrong while updating profile image",
        success: false,
        data: error.message,
      });
    }
  });

  module.exports = router;