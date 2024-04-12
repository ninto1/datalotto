// app.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./api');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json())
// API routes
app.use('/', apiRoutes);
app.get('/submit',(req,res)=>{
    res.sendFile(path.join(__dirname+'/static/submit.html'));
})
app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname+'/static/admin.html'));
})
// Serve the React app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
