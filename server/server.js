const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const firebase=require('firebase');
const fs=require('fs');
const datetime=require('node-datetime');

var config = {
    apiKey: "AIzaSyDo1Jz7FTyOxmkdw3B2IixfSNxQJiGpvnw",
    authDomain: "test-eefa2.firebaseapp.com",
    databaseURL: "https://test-eefa2.firebaseio.com",
    projectId: "test-eefa2",
    storageBucket: "",
    messagingSenderId: "334050492647"
};
var app1= firebase.initializeApp(config);
var reference = firebase.database().ref().child("object");
var strDate="2018-4-12 15:02:05";
    var datum = Date.parse(strDate);
    console.log(datum);
var data=require('./utils/data');
var pathToServe=path.join(__dirname,'../public');
var port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
var date=new Date();
var fileName=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+".json";

app.use(express.static(pathToServe));

io.on('connection',(socket)=>{
    console.log("new user connected");

    socket.on("insertData",(message)=>{
        console.log(message);
        data.addData(message,fileName);
    });

    socket.on("replay",(message,callback)=>{
        console.log(message);
        data.readData(message.start,message.stop,fileName).then((success)=>{
            callback(success);
        }).catch((err)=>{
            callback(err);
        });
    });

//     socket.on('createLocationMessage',(coords)=>{
//         io.emit('newLocationMessage',generateLocationMessage("Admin",coords));
//     })

//
 });

server.listen(port,()=>{
    console.log("App listening on port "+ port);
})

