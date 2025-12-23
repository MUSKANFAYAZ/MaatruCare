const mongoose = require("mongoose");

const HappyMomentsSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        datetime: {
            type: Date,
            required: true,
        }
    }
);

HappyMomentsSchema.index({userID: 1, datetime: 1}, {unique: true});
module.exports = mongoose.model("HappyMoment", HappyMomentsSchema);