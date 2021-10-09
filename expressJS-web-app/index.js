// npm install body-parser --save

var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', function (req, res) {
//     res.send('<html><body><h1>Namaste Duniya!</h1></body></html>');
// });

// app.post('/submit-data', function (req, res) {
//     res.send('POST request.');
// });

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    res.send(name + ' has submitted successfully!');
});

app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});

var server = app.listen(8080, function () {
    console.log('Node server is running..');
});

// Running : http://localhost:8080/
// We get ....
// Two inputs and one submit options ....
// After entering (say 'Jay' and 'Gohil') ....
// We recieve a simple HTML page that says ....
// Jay Gohil has submitted successfully!
