const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', routes);

app.use(function(req, res, next) {
    res.status(404).json({
        statusCode: 404,
        message: "Not found",
        data: {}
    })
})

app.listen(4001, () => {
    console.log("Server is running @4001")
})