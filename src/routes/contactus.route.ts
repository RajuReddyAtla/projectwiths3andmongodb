import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  updateContactMessage,
  deleteContactMessageById,
  getContactMessagesByName,
} from '@/controllers/contactus.controller';

const router = express.Router();

// Create a new contact message
router.post('/createmessage', createContactMessage);

// Get all contact messages
router.get('/getall', getAllContactMessages);

// Update a contact message by ID
router.put('/:id', updateContactMessage);

// Delete a contact message by ID
router.delete('/:id', deleteContactMessageById);

// Search for contact messages by name
router.get('/search/:name', getContactMessagesByName);

export default router;
