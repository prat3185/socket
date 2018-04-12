var socket= io();
socket.on('connect',()=>{
    console.log("connected to server");
})

socket.on("newMessage",(message)=>{
    console.log("newMessage",message);
    var li=$("<li></li>");
    li.text(`${message.from}:${message.text}`);
    $("#messages").append(li);
})

socket.on('newLocationMessage',function(message){
    var li=$("<li></li>");
    var a=$("<a target='_blank'>My current Location</a>");
    li.text(`${message.from}:`);
    li.append(a);
    a.attr('href',message.url);
    $("#messages").append(li);
});

$("#message-form").on("submit",function(e){
    e.preventDefault();
    var messageTextBox=$("[name=message]");
    socket.emit("createMessage",{
        from:"User",
        text:messageTextBox.val()
    },function(){
        messageTextBox.val(" ");
    });
});

var locationButton=$("#send-location").on('click',function(){
    if(!navigator.geolocation){
        return alert("Your browser does not support geolocation");
    }
    locationButton.attr('disabled','disabled').text("Sending Location...")
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        var latitude=position.coords.latitude;
        var longitude=position.coords.longitude;
        socket.emit('createLocationMessage',{
            longitude:longitude,
            latitude:latitude
        });
    },function(){
        locationButton.removeAttr('disabled').text('Send Location');
        return alert("Unable to fetch loction");
    })
});