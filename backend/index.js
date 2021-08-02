require('dotenv').config()

const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors')
const roomRoute = require('./routes/roomRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const serviceRoute = require('./routes/serviceRoute');
const transactionRoute = require('./routes/transactionRoute');
const port = 8080;
const ip = '127.0.0.1';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practice-room-rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to db')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
}));

app.use(session({
    secret: process.env.NODE_ENV !== 'production' ? 'sike thats a wrong number' : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/practice-room-rental',
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production' ? false : true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        expires: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use('/room', roomRoute);
app.use('/user', userRoute);
app.use('/service', serviceRoute);
app.use('/transaction', transactionRoute);
app.use('/room/:id/review', reviewRoute);
app.use('/room/:roomId/service/:serviceId/appointment', appointmentRoute);

app.get('/', (req, res) => {
    res.send('index')
})

app.all('*', (req, res, next) => {
    const error = new Error('404 Not Found')
    res.status(404)
    next(error)
})

app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = `出現未知的錯誤 :'(`
    }
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : null
    })
})

app.listen(port, ip, () => {
    console.log(`running at http://${ip}:${port}`);
})