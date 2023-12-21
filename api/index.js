const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User')
const Message = require('./models/Message')
const Group = require('./models/Group')
const ws = require('ws');
const { MongoServerError } = require('mongodb');
const fs = require('fs');


dotenv.config();
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

  const jwtSecret = process.env.JWT_SECRET;
  const bcryptSalt = bcrypt.genSaltSync(10);


const app= express();
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
}));

function getUserDataFromRequest(req){
  
}

app.get('/test',(req,res) => {
    res.json('test ok')
});

async function getUserDataFromRequest(req){
  return new Promise((resolve,reject) => {
    const token = req.cookies?.token ;

    if (token){ 
      jwt.verify(token,jwtSecret,{} ,(err , userData)=>{
        if (err) throw err;
        resolve(userData);
      });
    }
    else {
      reject('no token');
    }
  });
}  

app.get('/messages/:userId', async (req,res) => {
  const {userId} = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender:{$in:[userId, ourUserId]},
    recipient:{$in:[userId, ourUserId]},
  }).sort({createdAt:1});
  res.json(messages)
})

app.get('/people',async (req,res) => {
  const users = await User.find({},{'_id':1,username:1}) ;
  res.json(users);
});

app.get('/groups', async (req, res) => {
  try {
    // Fetch all users who have the groups field populated
    const usersWithGroups = await UserModel.find({ groups: { $exists: true, $not: { $size: 0 } } });
    
    // Extract all unique groups from these users
    const groups = usersWithGroups.reduce((allGroups, user) => {
      allGroups.push(...user.groups);
      return allGroups;
    }, []);
    
    // Get unique groups (remove duplicates)
    const uniqueGroups = [...new Set(groups)];
    
    res.json({ groups: uniqueGroups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user profile data from the server  
app.get('/users_unac', async (req, res) => {
  try {
    const unac_students = await User.find({hasJoinedGroup : false, userType : "Student"});
    const unac_mentors = await User.find({userType : "Guide"});

    res.json([...unac_students, ...unac_mentors]);
  } catch (error) {
    // Handle any errors here
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile',(req,res) => {
  const token = req.cookies?.token ;

  if (token){ 
    jwt.verify(token,jwtSecret,{} ,(err , userData)=>{
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/updateStudentsGroupStatus', async (req, res) => {
  const { studentIds, mentorIds, groupName } = req.body;

  try {
    // Update students' hasJoinedGroup field
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { groups: groupName }, $set: { hasJoinedGroup: true } }
    );

    // Update mentors' groups field to include groupName
    await User.updateMany(
      { _id: { $in: mentorIds } },
      { $addToSet: { groups: groupName } }
    );

    // Create or update the Group model
    const group = await Group.findOne({ name: groupName });

    if (group) {
      // If the group exists, add users to the existing group
      await Group.updateOne(
        { name: groupName },
        { $addToSet: { users: [...studentIds, ...mentorIds] } }
      );
    } else {
      // If the group doesn't exist, create a new group and add users
      await Group.create({
        name: groupName,
        users: [...studentIds, ...mentorIds],
        status: 'grouped',
      });
    }

    console.log(`Updated groups and created/updated GroupModel with groupName: ${groupName}`);

    res.status(200).json({ message: 'Students and mentors updated successfully.' });
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const foundUser = await User.findOne({username});
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({userId:foundUser._id, username, isAdmin: foundUser.isAdmin}, jwtSecret, {} ,(err, token)=>{
        res.cookie('token',token, {sameSite:'none',secure:true}).json({
          id: foundUser._id,
        });
      });
    }
  }
});




app.post('/logout',(req,res) => {
  res.cookie('token','',{sameSite:'none',secure:true}).json('ok');
});

// app.post('/register',async (req,res) => {
//     const {username,password} = req.body;

//     try{
//       const createdUser = await User.create({
//         username:username,
//         password:bcrypt.hashSync(password,bcryptSalt)
//       });
//       jwt.sign({userId:createdUser._id,username},jwtSecret, {} ,(err, token)=>{
//         if (err) throw err;
//         res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
//           id : createdUser._id ,
//         });
//     });
//     } catch (err) {
//       if (err) throw err;  
//       res.status(500).json('error');
//     }
    
    
// });

app.post('/register', async (req, res) => {
  const { username, password, fullName, userType, score, favSubject, collegeGPA, expertise } = req.body;

  try {
      let newUser = {
          username: username,
          password: bcrypt.hashSync(password, bcryptSalt),
          fullName: fullName,
          userType: userType
      };

      // Add fields based on user type
      if (userType === 'Student') {
          newUser.score = score;
          newUser.favSubject = favSubject;
      } else if (userType === 'Guide') {
          newUser.collegeGPA = collegeGPA;
          newUser.expertise = expertise;
      }

      const createdUser = await User.create(newUser);

      jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
              id: createdUser._id,
          });
      });
  } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
          res.status(400).json({ message: 'Username already exists. Please log in instead.' });
      } else {
          res.status(500).json('error');
      }
  }
});

const server = app.listen(4040);


const wss = new ws.WebSocketServer({server});
wss.on('connection',(connection,req) => {

  function notifyAboutOnlinePeople(){
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }
      ));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    },1000);
  },3000);

  connection.on('pong',() => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id from the cookie for this connection 
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token){
        jwt.verify(token,jwtSecret,{},(err,userData) => {
          if (err) throw err;
          const{userId,username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient , text, file} = messageData;
    let filename = null;
    if(file){
      const part = file.name.split('.');
      const ext = part[part.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, ()=>{
        console.log('file saved to ' + path)
      });
    }
    if (recipient && (text || file) ){
        const messageDoc = await Message.create({
          sender:connection.userId,
          recipient,
          text,
          file:file ? filename : null,
        });

      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient,
          file:file ? filename : null,
          _id:messageDoc._id,
        })));

      }


    });
  
  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
}); 