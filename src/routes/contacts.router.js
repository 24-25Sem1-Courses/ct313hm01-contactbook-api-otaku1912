const express = require('express');
const contactsController = require('../controllers/contacts.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');

const router = express.Router();
module.exports.setup = (app) => {
app.use('/api/v1/contacts', router);
router.get('/', contactsController.getContactsByFilter);
router.post('/', contactsController.createContact);
router.delete('/', contactsController.deleteAllContacts);
router.all('/', methodNotAllowed);

router.get('/:id', contactsController.getContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);
router.all('/:id', methodNotAllowed);
};