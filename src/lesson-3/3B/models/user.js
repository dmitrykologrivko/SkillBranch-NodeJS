import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    values: {
        money: {
            type: String,
            required: true
        },
        origin: {
            type: String,
            required: true
        }
    },
    pets: [{type: mongoose.Schema.ObjectId, ref: 'Pet'}]
});

userSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

export const User = mongoose.model('User', userSchema);