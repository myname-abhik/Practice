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
        unqiue: true
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
   //for going to the next function
//    return res.json({msg: 'Hello world from middeleware 1'})
// end function with res.json
// return res.end("hey")
});
app.use((req,res,next)=>{
    console.log("Hello world from middeleware 2",req.myUserName)
    // return res.end("hey")
    next();
});

app.get('/api/users', (req, res) => {
    res.setHeader('X-myname','Abhik');
    //always add X to custom headers
    // console.log(req.headers);
    console.log(req.headers)    
    // console.log("Iam in get  route",req.myUserName)
    return res.json(users);
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

// app.get('/api/users/:id',);
// app.post('/api/users', (req, res) => {
//     //add a new user to the database
//     return res.json({status:'pending '});
// });
// app.patch('/api/users/:id', (req, res) => {
//     //edit user with id

//     return res.json({status:'pending '});
// });
// app.delete('/api/users/:id', (req, res) => {
//     //delete the user from the database
    
//     return res.json({status:'pending '});
// });
// //using : it signifies the dynamic in the request
app
.route('/api/users/:id')
.get( (req, res) => { 
    
    const id = Number( req.params.id);
    const user = users.find((user) => user.id === id)
    if(!user)
    {
        return res.status(404).json({msg: 'User not found'});
        // use for not any user id in the response
    }
    return res.json(user);
   
}) 
.patch((req, res) => { 
    const id = Number( req.params.id);
    const user = users.find((user) => user.id === id)
    const body = req.body;
    users[id-1] = body
    users[id-1].id = id
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data) =>
    {
        return res.json({status: "Success", id: id});
    } );
    
    // return res.json({status: "pending"})
})
.delete((req, res) => {
     //delete user with id 
     const id = Number( req.params.id);
     const user = users.find((user) => user.id === id)
    //  const body = req.body;
    //  users.shift();
    const index = users.indexOf(id);
    // users.splice(index, 1);
    // users = users.filter((ele)=>ele.id!==id);
//    const  users1 = users.filter((user) => user.id!== id);
    //  users[id-1].id = id
     fs.writeFile("./MOCK_DATA.json",JSON.stringify(users.filter((user) => user.id!== id)),(err,data) =>
     {
         return res.json({status: "Success to delete", id: id});
     } );
});
app.post('/api/users',async(req, res) => {
    const body = req.body;
    if(!body||!body.first_name||!body.last_name||!body.email||!body.gender)
    {
        return res.status(400).json({msg:"bad request All fields are required"});
    }
    // status code for bad request
    const result =  await  User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender
    })
    console.log("result",result)
   return res.status(201).json({msg:'sucessful'});

    //create new user 
    // return res.json({status: "pending"})
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});