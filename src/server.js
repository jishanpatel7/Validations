
const connect = require('./configs/db');
const app = require("./index");


app.listen(3000, async () => {
    await connect();
    console.log('Server started on port 3000');
});