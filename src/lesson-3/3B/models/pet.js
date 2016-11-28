import mongoose from 'mongoose'
import {isString} from "util";

const petSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

petSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

export const Pet = mongoose.model('Pet', petSchema);