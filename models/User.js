import { Schema, model, models } from 'mongoose';
import Project from 'models/Project';

const userSchema = new Schema({
    email:{
        type: String,
        required: [true,'Email is required'],
        unique: true,
        trim: true,
    },
    name:{
        type: String,
        required: [true,'Name is required'],
        unique: false,
        trim: true,
    },
},{
    timestamps: true,
    versionKey: false
});

export default models.user || model('user', userSchema);