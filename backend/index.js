require('dotenv').config()

const express = require('express');
const app = express();
const cors = require('cors')
const roomRoute = require('./routes/roomRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const serviceRoute = require('./routes/serviceRoute');
const transactionRoute = require('./routes/transactionRoute');
const authRoute = require('./routes/authRoute');
const invoiceRoute = require('./routes/invoiceRoute')
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
app.use(cors({ credentials: true }));

app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);
app.use('/api/user', userRoute);
app.use('/api/service', serviceRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/room/:roomid/review', reviewRoute);
app.use('/api/appointment', appointmentRoute);

app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = `出現未知的錯誤 :'(`
    }
    return res.status(400).json({
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : null
    })
})

app.listen(port, ip, () => {
    console.log(`running at http://${ip}:${port}`);
})