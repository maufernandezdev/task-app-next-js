import { dbConnect } from 'utils/mongoose';
import {isValidObjectId} from 'mongoose'
import Project from 'models/Project';

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
                if(validId)
                {
                    const project = await Project.findById(id);
                    if(!project) return res.status(404).json({msg:'Project not found'});
                    return res.status(200).json(project);
                }
            } catch (error) {
                return res.status(500).json({error:error.message});
            }
        case "PUT":
            try {
                const parseBody = JSON.parse(body);
                const doc = await Project.findById(id);
                if(parseBody === null) doc.tasks = []; // if body is null -> delete all tasks
                if(parseBody !== null && parseBody.index === -1) doc.tasks.unshift({title: parseBody.title, description: parseBody.description}); // if body has index with -1 value -> just push a new task
                if(parseBody !== null && parseBody.index !== -1) {
                    // edit or delete task 
                    const editedTask = {title:parseBody.title, description: parseBody.description}
                    // push edited task if props != ''
                    if(editedTask.title !== '' && editedTask.description !== '') {
                        doc.tasks.map((task, index) =>{
                            if(index === parseBody.index)
                            {
                                task.title = editedTask.title,
                                task.description = editedTask.description
                            }
                        })
                    } 
                    else{
                        // delete
                        const filterTasks = doc.tasks.filter((task, index) => index !== parseBody.index); 
                        doc.tasks = [];
                        doc.tasks.push(...filterTasks);
                    }
                }
                const project = await Project.findByIdAndUpdate(id, doc, {
                    new: true
                });

                if(!project) return res.status(404).json({msg:'Project not found'});
                return res.status(200).json(project);
            } catch (error) {
                return res.status(500).json({error:error.message});
            }
        case "PATCH":
        try {
            const parseBody = JSON.parse(body);
            const {id:_id, name} = parseBody;
            const doc = await Project.findById(_id);
            doc.name = name;
            const project = await Project.findByIdAndUpdate(_id, doc, {
                new: true
            });
            if(!project) return res.status(404).json({msg:'Project not found'});
            return res.status(200).json(project);  
        } catch (error) {
            if(error.code === 11000) return res.status(400).json({error: error.message, duplicate: error.keyValue.name});
            return res.status(500).json({error: error.message});
        }

        case "DELETE":
            try {
                const parseBody = JSON.parse(body);
                const {id:_id} = parseBody;
                const deletedProject = await Project.findByIdAndDelete(_id);
                if(!deletedProject) return res.status(404).json({msg:'Project not found'});
                return res.status(200).json({msg:'Project deleted'})   
            } catch (error) {
                return res.status(500).json({msg:error.message}) 
            }
    
        default:
            return res.status(400).json({msg:'This method is not supported'})
    }
}