import { Request, Response } from "express";
import ContactUs from "@/models/contactus.model";
import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Create a new contact message with AWS S3 integration
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { Name, Mobile, Message } = req.body;

    if (!Name) {
      return res.status(400).json({ error: "Name is a required field" });
    }

    if (!Mobile) {
      return res.status(400).json({ error: "Mobile is a required field" });
    }

    if (!Message) {
      return res.status(400).json({ error: "Message is a required field" });
    }

    const contactMessageDetails = await ContactUs.create({
      Name,
      Mobile,
      Message,
    });

    res.status(201).json(contactMessageDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the contact message" });
  }
};

// Get all contact messages
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const contactMessages = await ContactUs.find();
    res.status(200).json(contactMessages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving contact messages" });
  }
};

// Update a contact message by its ID
export const updateContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, Mobile, Message } = req.body;

    const contactMessage = await ContactUs.findByIdAndUpdate(
      { _id: id },
      { $set: { Name, Mobile, Message } },
      { new: true }
    );

    await contactMessage.save();

    res.status(200).json(contactMessage);
  } catch (error) {
    res.status(500).json({ error: "Error updating contact message" });
  }
};

 
export const deleteContactMessageById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const deletedContactMessage = await ContactUs.findById(id);

    if (!deletedContactMessage) {
      return res.status(404).json({ error: "Contact message not found" });
    }

    await ContactUs.deleteOne({ _id: id });

    res.status(200).json({
      success: `Contact message from ${deletedContactMessage.Name} deleted successfully`,
    });

     
    await deleteS3File(deletedContactMessage);
  } catch (error) {
    res.status(500).json({ error: "Error deleting contact message" });
  }
};

// Search for contact messages by name
export const getContactMessagesByName = async (
  req: Request,
  res: Response
) => {
  const { name } = req.params;
  const lowercaseName = name.toLowerCase();

  try {
    const contactMessages = await ContactUs.find({
      Name: { $regex: new RegExp(lowercaseName, "i") },
    });

    if (contactMessages.length === 0) {
      return res.status(404).json({ message: "No contact messages found" });
    }

    res.status(200).json(contactMessages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving contact messages" });
  }
};
