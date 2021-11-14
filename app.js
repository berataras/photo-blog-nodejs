const mongoose = require('mongoose');
const express = require('express')
const ejs = require('ejs')
const Photo = require('./models/Photo')

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`server started at ${port} port`);
})

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//template engine
app.set('view engine', 'ejs');

//routes
app.get('/', async (request, response) => {
    const photos = await Photo.find({})
    response.render('index', {photos})
})

app.get('/about', (request, response) => {
    response.render('about')
})

app.get('/add', (request, response) => {
    response.render('add')
})

app.get('/detail', (request, response) => {
    response.render('detail')
})

app.post('/photos', async (request, response) => {
    await Photo.create(request.body);
    response.redirect('add')
})