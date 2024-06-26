const express =  require('express');
const app = express();
const users = require('./MOCK_DATA.json');
const fs = require('fs');
app.use(express.urlencoded({extended: false}));
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
    console.log("Iam in get  route",req.myUserName)
    return res.json(users);
});
app.get('/user', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) =>`<li>${user.first_name}</li>`).join("")}
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
.get( (req, res) => { const id = Number( req.params.id);
    const user = users.find((user) => user.id === id)
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
app.post('/api/users',(req, res) => {
    const body = req.body;
    users.push({...body,id: users.length +1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data) =>
    {
        return res.json({status: "Success", id: users.length});
    } );
    //create new user 
    // return res.json({status: "pending"})
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});