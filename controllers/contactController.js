const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { constants } = require("../constants");

// desc Get all contacts
// route GET/api/contacts
// access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ userId: req.user.id });
    res.status(constants.SUCCESSFUL_REQUEST).json(contacts);
});

// desc Create New contact
// route POST/api/contacts
// access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        userId: req.user.id,
    });
    res.status(201).json(contact);
});

// desc Get contact
// route GET/api/contacts/:id
// access private
// eslint-disable-next-line consistent-return
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        throw new Error(constants.NOT_FOUND);
    }
    res.status(constants.SUCCESSFUL_REQUEST).json(contact);
});

// desc update contact
// route PUT/api/contacts/:id
// access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        // res.status(404);
        throw new Error(constants.NOT_FOUND);
    }

    if (contact.userId.toString() !== req.user.id) {
        throw new Error(constants.FORBIDDEN);
    }

    const updatedContact = await Contact.findByIdAnd(
        req.params.id,
        req.body,
        { new: true },
    );

    res.status(constants.SUCCESSFUL_REQUEST).json(updatedContact);
});

// desc delete contact
// route DELETE/api/contacts/:id
// access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        throw new Error(constants.NOT_FOUND);
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(constants.SUCCESSFUL_REQUEST).json(contact);
});
module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
