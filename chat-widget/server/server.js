const express = require('express');
const app = express();
// const cors = require('cors');
// const routes = require('./routes/routes.js');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const path = require('path');
// const con = require('./db/connection');
//use middleware
// const corsOption = {origin: ['http://localhost:4000'], }
// app.use(cors(corsOption));
// app.use(cors({origin : "http://localhost:4000/"}));

// var whitelist = ['http://localhost:5000/','http://localhost:3000/']

// var corsOptions = {

//   origin: function (origin, callback) {
//     console.log(origin)
//     console.log(whitelist.indexOf(origin) !== -1)
//     if (whitelist.indexOf(origin) !== -1) {

//       callback(null, true)

//     } else {

//       callback(new Error('Not allowed by CORS'))

//     }

//   }

// }

// app.use(cors(corsOptions));

app.use(express.json());

// use routes
// app.use(routes);

// con.then(()=>{
    // if(!db) return process.exit(1);

    // If in production, then use static frontend build files.
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        // console.log(req.rawHeaders[1])
        // console.log(req)
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
    // app.get("/check", function(req , res){
    //     app.use(express.static(path.join(__dirname, '../build')));
    //     console.log(req)
    // })
    app.listen(port,()=>{
        console.log(`Server is running on port : http://localhost:${port}`);
    })
    app.on('error',err => console.log('Failed to Connect Server : '+err))
// }).catch(err =>{
//     console.log('DB ERROR : '+err);
// })