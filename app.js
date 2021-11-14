import mongoose from "mongoose";
import express from 'express';
import ejs from 'ejs';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';

//Controllers
import {addPhoto, editPhoto, getAllPhotos, getPhoto, updatePhoto} from "./controllers/photoController.js";

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
app.get('/', getAllPhotos);
app.get('/photo/detail/:id', getPhoto)
app.get('/edit/:id', editPhoto);
app.put('/edit/post/:id', updatePhoto)
app.post('/photos', addPhoto);

app.get('/about', (request, response) => {
    response.render('about')
})

app.get('/add', (request, response) => {
    response.render('add')
})

