/*

var x = event.offsetX == undefined ? event.layerX : event.offsetX;
var y = event.offsetY == undefined ? event.layerY : event.offsetY; 
*/

var a1 = document.getElementById('p1');
var a2 = document.getElementById('p2');
var a3 = document.getElementById('p3');
var a4 = document.getElementById('p4');
var temperatureRef = firebase.database().ref().child('temperature');
var pressureRef = firebase.database().ref().child('pressure');
var ang,flag=0;


var ref = firebase.database().ref().child('object');

ref.on('value', snap => {
    var temperature,pressure;
    angle1=snap.val().angle1;
    angle2=snap.val().angle2;
    angle3=snap.val().angle3;
    temperatureRef.on('value',(snapshot)=>{
        temperature=snapshot.val();
    pressureRef.on('value',(snapshot1)=>{
        pressure=snapshot1.val();
    timestamp=Date.now();
    socket.emit('insertData',{
        angle1,
        angle2,
        angle3,
        temperature,
        pressure,
        timestamp
    });
});
    });
});

var ref1 = firebase.database().ref("angle");
var count=0;
ref1.on('value',function(snapshot){
   
    count++;
    ang=snapshot.val();

    console.log(count);
    if(count>0 && flag==0){
    
        if(ang == -2){
        count=0;
        setTimeout(moveJoint1a, 100);
        }

        if(ang == -3){
        count=0;
        setTimeout(moveJoint1b, 100);
        }

        if(ang == -5 || ang == -6 ){
            count=0;
            setTimeout(moveJoint1c, 100);
            }

        if(ang == -7 ){
                count=0;
                setTimeout(moveJoint1d, 200);
        }
        
        if(ang == -8){
            count=0;
            setTimeout(moveJoint2, 100);
        }

        
        if(ang <= -9){
            count=0;
            setTimeout(moveJoint4, 100);
            flag=1;
        }
    }

        if(count>0 && flag==1){
    
            if(ang == -2)
            {
                flag=0;
            }
           
    
            if(ang == -3){
            count=0;
            setTimeout(moveJoint2back, 100);
            setTimeout(moveJoint4back, 150);
            }
    
            if(ang == -5 ){
                count=0;
                setTimeout(moveJoint1aback, 100);
                }
    
            if(ang == -7 ){
                    count=0;
                    setTimeout(moveJoint1bback, 200);
            }
            
            if(ang == -8){
                count=0;
                setTimeout(moveJoint1cback, 100);
            }
    
            
            if(ang == -9){
                count=0;
                setTimeout(moveJoint1dback, 100);
            }
    
            
    
    
           
    
        // R-3 B-5 G-6 Y-2
     
        }
})


ref.on("value", function(snapshot) {
    a1.value = snapshot.val().angle1;
    a2.value = snapshot.val().angle2;
    a3.value = snapshot.val().angle3;
    a4.value = snapshot.val().angle4;
  
    
}, function(error) {
    console.log("Error: " + error.code);
});



const dataref = firebase.database().ref().child('object');
//var dataref1 = firebase.database().ref().child('angle');

function timeout(range, time, callback) {
    var i = range[0];
    callback(i);
    Loop();

    function Loop() {
        setTimeout(function() {
            i += 0.1;
            if (i < range[1]) {
                callback(i);
                Loop();
            }
        }, time * 500)
    }
}

function timeout2(range, time, callback) {
    var i = range[0];
    callback(i);
    Loop();

    function Loop() {
        setTimeout(function() {
            i -= 0.1;
            if (i > range[1]) {
                callback(i);
                Loop();
            }
        }, time * 500)
    }
}



function updateAngle1(i) {
    dataref.update({ "angle1": parseFloat(i) });
}


function updateAngle2(i) {
    dataref.update({ "angle2": parseFloat(-i) });
}

function updateAngle3(i) {
    dataref.update({ "angle3": parseFloat(i) });
}

function updateAngle4(i) {
    dataref.update({ "angle4": parseFloat(i) });
}



function moveJoint1() {
    timeout([0.88, 1.59], 0.1, updateAngle1);
}



function moveJoint1a() {
    timeout([0.88, 1.06], 0.1, updateAngle1);
}

function moveJoint1b() {
    timeout([1.06, 1.24], 0.1, updateAngle1);
}
function moveJoint1c() {
    timeout([1.24, 1.42], 0.1, updateAngle1);
}
function moveJoint1d() {
    timeout([1.42, 1.59], 0.1, updateAngle1);
}



function moveJoint1back() {
    timeout2([1.59,0.88], 0.1, updateAngle1);
}



function moveJoint1aback() {
    timeout2([1.06,0.88], 0.1, updateAngle1);
}
function moveJoint1bback() {
    timeout2([1.24, 1.06], 0.1, updateAngle1);
}
function moveJoint1cback() {
    timeout2([1.42, 1.24], 0.1, updateAngle1);
}
function moveJoint1dback() {
    timeout2([1.59, 1.42], 0.1, updateAngle1);
}

function moveJoint2() {
    timeout([1.24, 1.98], 0.1, updateAngle2);
}


function moveJoint2back() {
    timeout2([1.98, 1.24], 0.1, updateAngle2);
}


function moveJoint4() {
    timeout([0.91, 1.80], 0.1, updateAngle3);
}


function moveJoint4back() {
    timeout2([1.80,0.91], 0.1, updateAngle3);
}

function moveTop() {
    timeout([0, 6.4], 0.1, updateAngle4);
}

function reset() {
    dataref.update({ "angle1": parseFloat(0.88) });
    dataref.update({ "angle2": parseFloat(-1.24) });
    dataref.update({ "angle3": parseFloat(0.88) });
    dataref.update({ "angle4": parseFloat(0) });
}