const monggoose = require('mongoose');

module.exports = () => {
    return monggoose.connect('mongodb+srv://<username>:<password>@cluster0.gdzko.mongodb.net/Validator_Assignment?retryWrites=true&w=majority');
}