import { Schema, model, models } from 'mongoose';

const taskSchema = new Schema({
    title:{
        type: String,
        required: [true,'Title is required'],
        trim: true,
        maxlength: [40, 'Title must be less than 40 characters']
    },
    description:{
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Title must be less than 200 characters']
    }
},{
    timestamps: true,
    versionKey: false
});

export default models.task || model('task', taskSchema);