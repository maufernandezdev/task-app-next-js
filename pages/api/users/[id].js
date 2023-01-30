import {dbConnect} from 'utils/mongoose'
import Project from 'models/Project';
import User from 'models/User';


export default async function handler(req, res) {
  
  await dbConnect();
  const { method, body , query:{id}} = req;
  switch(method)
  {
      case 'GET':
        try {
            const user = await User.findById(id);
            return res.status(200).json(user);
            
        } catch(error) {
          return res.status(500).json({error: error.message});
        }
      
      case 'PUT':
        
        try {
          const parseBody = JSON.parse(body);
          const doc = await User.findById(id);
          if(parseBody.id)
          {
            const filterProjects = doc.projects.filter(project => project._id.toString() !== parseBody.id)
            doc.projects = [];
            doc.projects.push(...filterProjects)
            const user = await User.findByIdAndUpdate(id, doc, {
              new: true
            });
            return res.status(200).json({msg:'Project deleted successfully', user: user});
          }
          const newProject = new Project(parseBody);
          doc.projects.push(newProject)
          const user = await User.findByIdAndUpdate(id, doc, {
            new: true
          });
          return res.status(200).json({msg:'Creating a new project', user: user});
          
        } catch(error) {
          return res.status(500).json({error: error.message});
        }

      case "PATCH":
      try {
          const parseBody = JSON.parse(body);
          const {userId:_id, projectId, name} = parseBody;
          const doc = await User.findById(_id);
          doc.projects.map(project => project._id.toString() === projectId ? project.name = name : project.name = project.name );
          const user = await User.findByIdAndUpdate(_id, doc, {
              new: true
          });
          if(!user) return res.status(404).json({msg:'User not found'});
          return res.status(200).json({msg:'Project updated successfully', user: user});  
      } catch (error) {
          if(error.code === 11000) return res.status(400).json({error: error.message, duplicate: error.keyValue.name});
          return res.status(500).json({error: error.message});
      }

      default:
        return res.status(400).json({msg:'This method is not supported'})
  }
}
  