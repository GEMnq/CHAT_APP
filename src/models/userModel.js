const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    image: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    is_online:{
        type: String,
        default: '0',
    }
},  {timestamp:true},
);

/**
 * pre: Used to hash the password before saving database
 * comparePassword: to compare password entered and password in database
 */

userSchema.pre('save', async function(next) {
    try {
        var user = this;
        if (!user.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.comparePassword = async function(enteredPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        return isMatch;
    } catch (error) {
        next(error)
    }
};

module.exports = mongoose.model('User', userSchema);