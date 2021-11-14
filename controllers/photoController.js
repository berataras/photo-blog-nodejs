import Photo from "../models/Photo.js";
import fs from "fs";
import {__dirname} from '../helpers/dirname.js'


export const getAllPhotos = async (request, response) => {

    const page = request.query.page || 1;
    const photosPerPage = 2;
    const totalPhotos = await Photo.find({}).countDocuments();

    const photos = await Photo.find({}).sort('-createdAt')
        .skip((page-1) * photosPerPage)
        .limit(photosPerPage)
    response.render('index', {
        photos,
        current: page,
        pages: Math.ceil(totalPhotos / photosPerPage)
    })
}

export const getPhoto = async (request, response) => {
    const photo = await Photo.findById(request.params.id);
    response.render('detail', {photo})
}

export const editPhoto = async (request, response) => {
    const photo = await Photo.findById(request.params.id);
    response.render('edit', {photo})
}

export const addPhoto = async (request, response) => {
    const image = request.files.image;
    const imageName = image.name;
    const path =  __dirname + '/../public/uploads/' + imageName;

    image.mv(path, async () => {
        await Photo.create({
            ...request.body,
            image: imageName,
        });
        response.redirect('/')
    })
}

export const updatePhoto = async (request, response) => {
    const id = request.params.id;
    const photo = await Photo.findById(id);
    const image = request.files.image;

    let imageName;
    if (image){
        imageName = image.name;
        const deletePath =  __dirname + '/../public/uploads/' + photo.image;
        const path = __dirname + '/../public/uploads/' + imageName;
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
}