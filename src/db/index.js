require('dotenv').config()
const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect fail!');
    }
}

module.exports = { connect }