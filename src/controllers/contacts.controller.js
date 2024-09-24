const contactsService = require('../services/contacts.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
function createContact(req, res) {
    return res.status(201).json(JSend.success({ contact: {} }));
    async function createContact(req, res, next) {
        if (!req.body?.name || typeof req.body.name !== 'string'){
            return next(new ApiError(400, 'Name should be a non-empty string'));
        }
        try {
            const contact = await contactsService.createContact({
                ...req.body,
                avatar: req.file ? `/public/uploads/${req.file.filename}` : null,
            });
            return res
                .status(201)
                .set({
                    Location: `${req.baseUrl}/${contact.id}`,
                })
                .json(
                    JSend.success({
                        contact,
                    })
                );
        } catch (error) {
            console.log(error);
            return next(
                new ApiError(500, 'An error occured while creating the contact')
            );
        }
    }
}
function getContactsByFilter(req, res) {
    const filters = [];
    const { favorite, name } = req.query;

    if (favorite !== undefined) {
        filters.push(`favorite=${favorite}`);
    }
    if (name) {
        filters.push(`name=${name}`);
    }
    
    console.log(filters.join('&'));
    
    return res.json(
        JSend.success({
            contacts: [],
        })
    );
    async function getContactsByFilter(req, res, next) {
        let contacts = [];
        let result = {
            contacts: [],
            metadata: {
                totalRecords: 0,
                firstPage: 1,
                lastPage: 1,
                page: 1,
                limit: 5,
            },
        };

        try {
            contacts = await contactsService.getManyContacts(req.query);
            result = await contactsService.getManyContacts(req.query);
        } catch (error) {
            console.log(error);
            return next(
                new ApiError(500, 'An error occured while retrieving contacts')
            );
        }

        return res.json(JSend.success({ contacts }));
        return res.json(
            JSend.success({
                contacts: result.contacts,
                metadata: result.metadata,
            })
        );
    }
}

function getContact(req, res) {
return res.json(JSend.success({ contact: {} }));
    async function getContact(req, res, next) {
        const { id } = req.params;

        try {
            const contact = await contactsService.getContactById(id);
            if (!contact) {
                return next(new ApiError(404, 'Contact not found'));
            }
            return res.json(JSend.success({ contact }));
        } catch (error) {
            console.log(error);
            return next(new ApiError(500, 'Error retrieving contact with id=${id}$'));
        }
    }
}

function updateContact(req, res) {
return res.json(JSend.success({ contact: {} }));
    async function updateContact(req, res, next) {
        if (Object.keys(req.body).length == 0 && !req.file) {
            return next(new ApiError(400, 'Data to update can not be empty'));
        }

        const { id } = req.params;

        try {
            const updated = await contactsService.updateContact(id, {
                ...req.body,
                avatar: req.file ? `/public/uploads/${req.file.filename}` : null,
            });
            if (!updated) {
                return next(new ApiError(404, 'Contact not found'));
            }
            return res.json(
                JSend.success({
                    contact: updated,
                })
            );
        } catch (error) {
            console.log(error);
            return next(new ApiError(500, `Error updating contact with id=${id}`));
        }
    }
}
function deleteContact(req, res) {
    async function deleteContact(req, res, next) {
        const { id } = req.params;

        try {
            const deleted = await contactsService.deleteContact(id);
            if (!deleted) {
                return next(new ApiError(404, 'Contact not found'));
            }
            return res.json(JSend.success());
        } catch (error) {
            console.log(error);
            return next(new ApiError(50, `Could not delete contact with id=${id}`));
        }
    }
}
function deleteAllContacts(req, res) {
    async function deleteAllContacts(req, res, next) {
        try {
            await contactsService.deleteAllContacts();

            return res.json(JSend.success());
        } catch (error) {
            console.log(error);
            return next(
                new ApiError(500, 'An error occurred while removing all contacts')
            );
        }
    }
}
module.exports = {
getContactsByFilter,
deleteAllContacts,
getContact,
createContact,
updateContact,
deleteContact,
};