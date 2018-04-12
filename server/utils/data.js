const fs=require('fs');
const firebase=require('firebase');

var config = {
    apiKey: "AIzaSyDo1Jz7FTyOxmkdw3B2IixfSNxQJiGpvnw",
    authDomain: "test-eefa2.firebaseapp.com",
    databaseURL: "https://test-eefa2.firebaseio.com",
    projectId: "test-eefa2",
    storageBucket: "",
    messagingSenderId: "334050492647"
};
var app1= firebase.initializeApp(config,'other');

var replay = app1.database().ref().child('Replay');

var fetchData=(fileName)=>{
    try{
      
        var dataString=fs.readFileSync(fileName);
        return JSON.parse(dataString);
        }
    catch(e){
        return [];
    }
}

var saveData=(data,fileName)=>{
    fs.writeFileSync(fileName,JSON.stringify(data),(err)=>console.log(err));
}

var addData=(obj,fileName)=>{
    var data=[];
    data=fetchData(fileName);
    data.push(obj);
    saveData(data,fileName);
}


var getAll=(fileName)=>{
    return fetchData(fileName);
}

var readData=(start,stop,fileName)=>{
    var notes=fetchData(fileName);
   // console.log(notes);
    var filteredNotes=notes.filter((data)=>(data.timestamp>=start && data.timestamp<=stop));
    if(filteredNotes.length==0)
    return Promise.reject("empty");
    else{
        filteredNotes.forEach((note)=>{
        	setTimeout(()=>{replay.set({
            angle1: note.angle1,
            angle2:note.angle2,
            angle3:note.angle3
          });
        },1000) });
        return Promise.resolve("Ok");
    }    

}


module.exports={
    addData,
    getAll,
    readData,
}