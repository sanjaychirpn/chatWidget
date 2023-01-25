const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
app.listen(port,()=>{
    console.log(`Server is running on port : http://localhost:${port}`);
})
app.on('error',err => console.log('Failed to Connect Server : '+err))