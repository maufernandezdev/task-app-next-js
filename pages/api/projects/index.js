import {dbConnect} from 'utils/mongoose'
import Project from 'models/Project';


export default async function handler(req, res) {
  
  await dbConnect();
  const { method, body } = req;
  switch(method)
  {
      case 'GET':

        try {
          const project = await Project.find();
          return res.status(200).json(project);
        } catch(error) {
          return res.status(500).json({error: error.message});
        }
      
      case 'POST':
        
        try {
          const parseBody = JSON.parse(body);
          const newProject = new Project(parseBody);
          const savedProject = await newProject.save();
          return res.status(200).json({msg:'Creating a new project', project: savedProject});
        } catch(error) {
          if(error.code === 11000) return res.status(400).json({error: error.message, duplicate: error.keyValue.name});
          return res.status(500).json({error: error.message});
        }

      default:
        return res.status(400).json({msg:'This method is not supported'})
  }
}
  