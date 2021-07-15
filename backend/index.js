require('dotenv').config()

const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cors = require('cors')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const verifyPassword = require('./utils/verifyPassword');
const roomRoute = require('./routes/roomRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const User = require('./model/User');
const port = 5000;
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

app.use(passport.initialize());
app.use(passport.session());

const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) return done(null, false, { message: '用戶不存在' })
        const isPasswordValid = await verifyPassword(password, user.hash)
        if (!isPasswordValid) return done(null, false, { message: '用戶名稱或密碼不正確' })
        return done(null, user);
    } catch (err) {
        done(err)
    }
}

passport.use(new LocalStrategy(verifyCallback))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use('/room', roomRoute);
app.use('/user', userRoute);
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