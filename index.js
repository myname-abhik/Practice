const express =  require('express');
const mongoose = require('mongoose');
const app = express();
const users = require('./MOCK_DATA.json');
const fs = require('fs');
app.use(express.urlencoded({extended: false}));
mongoose.connect("mongodb+srv://abhik16chakrabortty:D0HsLzUvxx2GFcUu@cluster0.iuakazn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("connected to mongoDB")
})
.catch((err) => {
    console.log("error connecting",err);
})


const UserSchema = new mongoose.Schema({
    first_name :{
        type: String,
        required: true
    },
    last_name :{
        type: String
    },
    email :{
        type: String,
        required: true,
        unqiue: true,
    },
    gender:{
        type: String
    }
},{timestamps:true})
const User = mongoose.model('User',UserSchema);
// async function create()
// {
//     User.create({
//         first_name: 'Abhik',
//         last_name: 'Chakrabortty',
//         email: 'abhik@gmail.com',
//         gender: 'Male'
//     })
// }
// create();

app.use((req,res,next)=>{
   console.log("Hello world from middeleware 1")
   req.myUserName = 'Abhik.dev'
   next();
});
app.use((req,res,next)=>{
    console.log("Hello world from middeleware 2",req.myUserName)
    // return res.end("hey")
    next();
});

app.get('/api/users', async(req, res) => {
    
    res.setHeader('X-myname','Abhik');
    //always add X to custom headers
    // console.log(req.headers);
    const Alldbusers = await User.find({});
    
   
    res.json(Alldbusers);
});
app.get('/users', async(req, res) => {
    
    const Alldbusers = await User.find({});
    const html = `
    <ul>
    ${Alldbusers.map((user) =>`<li>${user.first_name}- email- ${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html);
});

// Middleware - create - assume as plugins

app
.route('/api/users/:id')
.get( async(req, res) => { 
    const user = await User.findById(req.params.id);
    
    if(!user)
    {
        return res.status(404).json({msg: 'User not found'});
        // use for not any user id in the response
    }
    return res.json(user);
   
}) 
.patch(async (req, res) => { 
    const user =await  User.findByIdAndUpdate(req.params.id,{last_name:"Abhik "})
   
    return res.json ({msg : "ok"});
  
})
.delete(async(req, res) => {
     await User.findByIdAndDelete(req.params.id);
    
    return res.json({status: "success"});
 
    
});
app.post('/api/users',async(req, res) => {
    const body = req.body;
    if(!body||!body.first_name||!body.last_name||!body.email||!body.gender)
    {
        return res.status(400).json({msg:"bad request All fields are required"});
    }
   
    const result =  await  User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender
    })
    console.log("result",result)
   return res.status(201).json({msg:'sucessful'});

 
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});