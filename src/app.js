const express = require('express'); 
const cors = require('cors');

const JSend = require('./jsend');
const contactsRouter = require('./routes/contacts.router');

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
return res.json(JSend.success());
});


contactsRouter.setup(app); 

module.exports = app;
