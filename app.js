const express = require('express')
const path = require("path");

const app = express();

app.use(express.static('public'));
const port = 3000;
app.listen(port, () => {
    console.log(`server started at ${port} port`);
})

//template engine
app.set('view engine', 'ejs');

//routes
app.get('/', (request, response) => {
    response.render('index')
})

app.get('/about', (request, response) => {
    response.render('about')
})

app.get('/add', (request, response) => {
    response.render('add')
})