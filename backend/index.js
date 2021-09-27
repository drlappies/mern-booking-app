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
const ip = '0.0.0.0';

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
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
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);
app.use('/api/user', userRoute);
app.use('/api/service', serviceRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/room/:roomid/review', reviewRoute);
app.use('/api/appointment', appointmentRoute);

app.listen(port, ip, () => {
    console.log(`running at http://${ip}:${port}`);
})