const { faker } = require('@faker-js/faker');
//! Get the client
const mysql = require('mysql2');
const express = require("express");
const path = require("path");
const { error } = require('console');
const app = express();
const methodOverride = require("method-override");
const {v4:uuidv4} = require("uuid");

let port = 7862;

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

//? Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  //Your Database password
  password: 'Suraj@1234'
});
//*Show total Users in dB.
app.get("/", (req, res) => {
  let q = `select count(*) from user`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0]["count(*)"];//excatuly users are in db toatal is 205.
      // res.send(results);
      // console.log(results[0]["count(*)"]);
      console.log(user)
      res.render("home.ejs", { user });
    })
  } catch (error) {
    res.send("some error in db");
  }
}
)

//*Show all users in DB.
app.get("/user",(req,res)=>{
  // res.send("working");
  try {
    let q = `SELECT * FROM USER`
    connection.query(q,(err,results)=>{
      if (err) throw err;
      let user = results;
      res.render("showuser.ejs",{user});
    })
    
  } catch (error) {
    res.send("some error in db.")
  }
})

//?Edit Route
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q,(err,results)=>{
      if (err) throw err;
      let user = results[0];
      res.render("edit.ejs",{user});
    })
    
  } catch (error) {
    res.send("some error in db.")
  }
  
})
//UPDATE route
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {username:newUsername,password:formPassword} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q,(err,results)=>{
      if (err) throw err;
      let user = results[0];
      if(formPassword!=user.password){
        res.send("Wrong Password...")
      }
      else{
        let q2 = `UPDATE user SET username = '${newUsername}' Where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user")
        })
      }
      
    })
    
  } catch (error) {
    res.send("some error in db.")
  }
  

})

//delete route
app.get('/user/:id/delete',(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user where id='${id}'`
  try {
    connection.query(q,(err,results)=>{
      if (err) throw err;
      let user = results[0];
      res.render("delete.ejs",{user});
    })
  } catch (error) {
    res.send("some error in db.")
  }
})
app.delete("/user/:id/",(req,res)=>{
  let {id} = req.params;
  let {password:delPassword } =req.body;
  let q = `SELECT * FROM user where id='${id}'`
  try {
    connection.query(q,(err,results)=>{
      if (err) throw err;
      let user = results[0];
      if(delPassword!=user.password){
        res.send("WRONG Password")
      }else{
        let del = `DELETE FROM user WHERE id='${id}'`;
        connection.query(del,(err,results)=>{
          if (err) throw err;
          else{
            console.log(results);
            console.log("deleted");
            res.redirect('/user');
          }
        })
      }
    })
  } catch (error) {
    
  }
})

//Add new User
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
})
app.post("/user/new",(req,res)=>{
  let {email,username,password} = req.body;
  let id = uuidv4();
  let q = `Insert into user(id,username,email,password)values('${id}','${username}','${email}','${password}')`;

  try {
   connection.query(q,(err,results)=>{
    if (err) throw err;
   res.redirect("/user")
   })

  } catch (error) {
    res.send("some error in database!")
  }
})
app.listen(port, () => {
  console.log(`App is listening On port ${port}`);
})
// A simple SELECT query

// let q = "show tables";
// Using placeholders
// let q = "INSERT INTO user (id,username,email,password)VALUES ?";
// let user =[ ["124","124_Suraj","suraj@12344gmail.com","Suraj@12344"],["125","125_Suraj","suraj@12345gmail.com","Suraj@12345"],["126","126_Suraj","suraj@12346gmail.com","Suraj@12346"]]

// let getRandomUser = ()=> {
//     return [
//       faker.string.uuid(),
//       faker.internet.userName(),
//       faker.internet.email(),
//       faker.internet.password()
//     ];
//   }
// let data = [];

// for(let i=1;i<=100;i++){
// console.log(getRandomUser())
//     data.push(getRandomUser());
// }
// console.log(data);
// try {
//     connection.query(q,[data],
//  (err, results)=> {
//     if(err) throw err;
//     console.log(results); // results contains rows returned by server
// console.log(results.length);
// console.log(results[0]);
// console.log(results[1]);
// console.log(fields); // fields contains extra meta data about results, if available
//   }
// );
// } catch (error) {
//     console.log(error);
// }
// To close the connections
// connection.end();
//   let p1 = getRandomUser();
//   console.log(p1)


