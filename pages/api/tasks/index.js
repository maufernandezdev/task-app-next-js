import {dbConnect} from 'utils/mongoose'
import Task from 'models/Task'


export default async function handler(req, res) {
  
  await dbConnect();
  const { method, body } = req;
  switch(method)
  {
      case 'GET':

        try {
          const tasks = await Task.find();
          return res.status(200).json(tasks);
        } catch(error) {
          return res.status(500).json({error: error.message});
        }
      
      case 'POST':
        
        try {
          const parseBody = JSON.parse(body);
          const newTask = new Task(parseBody);
          const savedTask = await newTask.save();
          return res.status(200).json({msg:'Creating a new task', task: savedTask});
        } catch(error) {
          return res.status(500).json({error: error.message});
        }

      default:
        return res.status(400).json({msg:'This method is not supported'})
  }
}
  