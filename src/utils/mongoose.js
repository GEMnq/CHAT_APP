module.exports = {
    MgMultiToObject: function (mongooses) {
        return mongooses.map(mongoose => mongoose.toObject())
    },
    MgToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
}