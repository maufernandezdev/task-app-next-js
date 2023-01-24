import { mongoose } from 'mongoose';
// mongoose.set('strictQuery', true);

const conn = {
    isConnected:false
}

export async function dbConnect(){
    
    if(conn.isConnected) return;
    try{
        const db = await mongoose.connect(process.env.MONGODB_URL_ATLAS);
        conn.isConnected = db.connections[0].readyState;
        console.log(`Conectado a: ${db.connection.db.databaseName}`);
    }
    catch (error) {
        console.log(`error: ${error}`);
      }
}

mongoose.connection.on("connected", ()=>{
    console.log("Mongodb is connected");
})

mongoose.connection.on("error", (error)=>{
    console.log(error);
})