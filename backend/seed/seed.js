require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to db');
});

const Room = require('../model/Room');
const Owner = require('../model/Owner');
const Finder = require('../model/Finder');
const User = require('../model/User')
const Review = require('../model/Review');
const Service = require('../model/Service');
const Appointment = require('../model/Appointment');
const Invoice = require('../model/Invoice');
const roomHelper = require('../seed/seedRoomHelper');
const userHelper = require('../seed/seedUserHelper');
const serviceHelper = require('../seed/seedServiceHelper');
const hashingPassword = require('../utils/hashingPassword');

async function Seeding() {
    await User.deleteMany();
    await Room.deleteMany();
    await Review.deleteMany();
    await Service.deleteMany();
    await Appointment.deleteMany();
    await Invoice.deleteMany();
    for (let i = 0; i < userHelper.length; i++) {
        const hash = await hashingPassword(userHelper[i].password);
        switch (userHelper[i].permission) {
            case 'owner':
                const owner = new Owner({
                    username: userHelper[i].username,
                    title: userHelper[i].title,
                    number: userHelper[i].number,
                    stripe_id: userHelper[i].stripe_id,
                    hash: hash
                })
                await owner.save();
                break;

            case 'finder':
                const finder = new Finder({
                    username: userHelper[i].username,
                    password: userHelper[i].password,
                    name: userHelper[i].name,
                    hash: hash,
                })
                await finder.save()
                break;
        }
    }

    const [roomOwner] = await User.find({ username: 'roomowner' });
    for (let i = 0; i < roomHelper.length; i++) {
        const seedRoom = new Room({
            ...roomHelper[i],
            owner: roomOwner
        })
        roomOwner.room.push(seedRoom._id);
        serviceHelper[i].forEach(async (service) => {
            const seedService = new Service({
                ...service,
                owner: roomOwner,
                room: seedRoom._id
            })
            seedRoom.services.push(seedService);
            await seedService.save();
        })
        await seedRoom.save();
        await roomOwner.save();
        console.log(`${i + 1} room saved`);
    }
}

Seeding();