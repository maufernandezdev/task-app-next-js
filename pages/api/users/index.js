import {dbConnect} from 'utils/mongoose'
import User from 'models/User';


export default async function handler(req, res) {
  
  await dbConnect();
  const { method, body } = req;
  switch(method)
  {
      case 'GET':

        // NOT IN USE
        try {
          const user = await User.find();
          return res.status(200).json(user);
        } catch(error) {
          return res.status(500).json({error: error.message});
        }
      
      case 'POST':
        
        try {
          const parseBody = JSON.parse(body);
          const user = await User.find({
            'email': parseBody.email
          });
          if(user.length > 0) return res.status(200).json({msg:'Already a user', user: user});
          const newUser = new User(parseBody);
          const savedUser = await newUser.save();
          return res.status(200).json({msg:'Creating a new User', user: savedUser});
        } catch(error) {
          if(error.code === 11000) return res.status(400).json({error: error.message, duplicate: error.keyValue.name});
          return res.status(500).json({error: error.message});
        }

      default:
        return res.status(400).json({msg:'This method is not supported'})
  }
}
  