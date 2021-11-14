const mongoose = require('mongoose');
const express = require('express')
const ejs = require('ejs')
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override')
const fs = require('fs');
const Photo = require('./models/Photo')
const path = require("path");

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
app.use(fileUpload());
app.use(methodOverride('_method'))

//template engine
app.set('view engine', 'ejs');

//routes
app.get('/', async (request, response) => {
    const photos = await Photo.find({}).sort('-createdAt')
    response.render('index', {photos})
})

app.get('/about', (request, response) => {
    response.render('about')
})

app.get('/add', (request, response) => {
    response.render('add')
})

app.get('/edit/:id', async (request, response) => {
    const photo = await Photo.findById(request.params.id);
    response.render('edit', {photo})
})

app.put('/edit/post/:id', async (request, response) => {
    const id = request.params.id;
    const photo = await Photo.findById(id);
    const image = request.files.image;

    let imageName;
    if (image){
        imageName = image.name;
        const deletePath = __dirname + '/public/uploads/' + photo.image;
        const path = __dirname + '/public/uploads/' + imageName;
        if (fs.existsSync(deletePath)) {
            fs.unlinkSync(deletePath)
        }
        image.mv(path)
    }else{
        imageName = photo.image;
    }

    photo.title = request.body.title;
    photo.description = request.body.description;
    photo.image = imageName;
    photo.save();
    response.redirect(`/photo/detail/` + id)
})

app.get('/photo/detail/:id', async (request, response) => {
    const photo = await Photo.findById(request.params.id);
    response.render('detail', {photo})
})

app.post('/photos', (request, response) => {
    const image = request.files.image;
    const imageName = image.name;
    const path = __dirname + '/public/uploads/' + imageName;

    image.mv(path, async () => {
        await Photo.create({
            ...request.body,
            image: imageName,
        });
        response.redirect('/')
    })
})