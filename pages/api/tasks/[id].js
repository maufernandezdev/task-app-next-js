import { dbConnect } from 'utils/mongoose';
import {isValidObjectId} from 'mongoose'
import Task from 'models/Task'

export default async (req, res) => {
    
    await dbConnect();
    const {
        method,
        body,
        query:{id}
    } = req;

    switch (method) 
    {
        case "GET":
            try {
                const validId = isValidObjectId(id);
                console.log(`is valid object id: ${validId}`);
                if(validId)
                {
                    const task = await Task.findById(id);
                    if(!task) return res.status(404).json({msg:'Task not found'});
                    return res.status(200).json(task);
                }
            } catch (error) {
                return res.status(500).json({error:error.message});
            }
        case "PUT":
            try {
                const parseBody = JSON.parse(body);
                const task = await Task.findByIdAndUpdate(id, parseBody, {
                    new: true
                });
                if(!task) return res.status(404).json({msg:'Task not found'});
                return res.status(200).json(task);
            } catch (error) {
                return res.status(500).json({error:error.message});
            }
        case "DELETE":
            try {
                const deletedTask = await Task.findByIdAndDelete(id);
                if(!deletedTask) return res.status(404).json({msg:'Task not found'});
                return res.status(200).json({msg:'Task deleted'})   
            } catch (error) {
                return res.status(500).json({msg:error.message}) 
            }
    
        default:
            return res.status(400).json({msg:'This method is not supported'})
    }
}