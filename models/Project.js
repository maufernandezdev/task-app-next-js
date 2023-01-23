import { Schema, model, models } from 'mongoose';
import Task from 'models/Task'

const projectSchema = new Schema({
    name:{
        type: String,
        required: [true,'Name is required'],
        unique: true,
        trim: true,
        maxlength: [40, 'Name must be less than 40 characters']
    },
    tasks:[Task.schema],
},{
    timestamps: true,
    versionKey: false
});

export default models.project || model('project', projectSchema);