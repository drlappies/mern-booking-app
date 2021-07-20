const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practice-room-rental', {
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
const User = require('../model/User')
const Review = require('../model/Review');
const Service = require('../model/Service');
const Appointment = require('../model/Appointment');
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
    for (let i = 0; i < userHelper.length; i++) {
        const { hash, salt } = await hashingPassword(userHelper[i].password);
        const user = new User({
            ...userHelper[i],
            hash: hash,
        })
        await user.save();
    }

    const [roomOwner] = await User.find({ username: 'roomowner' });

    for (let i = 0; i < roomHelper.length; i++) {
        const seedRoom = new Room({
            ...roomHelper[i],
            owner: roomOwner
        })
        serviceHelper[i].forEach(async (service) => {
            const seedService = new Service({
                ...service
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