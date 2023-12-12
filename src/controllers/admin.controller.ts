import Admin from "@/models/admin.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import secrets from "@/config/secrets";
import User from "@/models/user.model";

 // Extract email and password from the request body
 export const Adminlogin = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if there are any existing admin credentials
    const existingAdmin = await Admin.findOne();

    if (!existingAdmin) {
      // No existing admin, allow signup
      const newAdmin = new Admin({
        email,
        password, // You should hash the password here in a production environment
      });

      // Save the new admin to the database
      await newAdmin.save();

      // Respond with a success message
      return res.status(201).json({ message: "Signup successful" });
    } else {
      // Admin credentials exist, check login
      if (email === existingAdmin.email && password === existingAdmin.password) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        // Check if both email and password are incorrect
        return res.status(401).json({ message: "Incorrect email or password" });
      }
    }
  } catch (error) {
    // Handle errors during login/signup
    console.error("Error occurred during login/signup:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};


// Controller function for Admin logout
export const AdminlogOut = async (req, res) => {
  // Clear the cookie and respond with a success message
  res.cookie(secrets.token, null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Admin Successfully",
  });
};


export const updateAdminCredentials = async (req, res) => {
  try {
    // Extract updated email and password from the request body
    const { _id, newEmail, newPassword } = req.body;

    // Find the existing admin by ObjectId
    const existingAdmin = await Admin.findById(_id);

    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the existing admin's credentials
    const updatedAdmin = await Admin.findByIdAndUpdate(
      _id,
      { email: newEmail, password: newPassword },
      { new: true }
    );

    if (updatedAdmin) {
      return res.status(200).json({ message: "Admin credentials updated successfully" });
    } else {
      return res.status(500).json({ message: "Failed to update admin credentials" });
    }
  } catch (error) {
    // Handle errors during admin credentials update
    console.error("Error occurred during admin credentials update:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
};


export const getAdminById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find an admin by ID
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Do not include sensitive information like the password in the response
    const { email } = admin.toObject();

    res.status(200).json({
      id,
      email,
    });
  } catch (error) {
    // Handle any errors that occurred during the retrieval process
    console.error(error);
    res.status(500).json({ error: "Error retrieving admin details" });
  }
};