const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Photoground = require('../models/photoground');

mongoose.connect('mongodb://localhost:27017/photo-ground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Photoground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const photo = new Photoground({
            author: '61c97442951b73459e341072',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/aspcloud/image/upload/v1640926212/PhotoGround/ufzny5uuaehhcjf4nto0.jpg',
                    filename: 'PhotoGround/ufzny5uuaehhcjf4nto0',
                },
                {
                    url: 'https://res.cloudinary.com/aspcloud/image/upload/v1640926213/PhotoGround/ojwb3xdngjvaqv33zjuk.jpg',
                    filename: 'PhotoGround/ojwb3xdngjvaqv33zjuk',
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a leo quis orci accumsan viverra eu interdum mi. Sed sit amet erat fringilla, posuere lectus sed, sollicitudin leo. Morbi eget ornare tellus, vel pretium urna. Curabitur euismod ornare venenatis. Aenean ornare ut lorem sit amet maximus.',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ] 
            }
        })
        await photo.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});