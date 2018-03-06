var app = require('express')();
var http = require('http').createServer(app);
var socket = require('socket.io').listen(http);


app.get("/",function(req,res){
    res.send("Sono funzionante coglione")
})
// ========================== MODELS
var clients = new Array()
var rooms = new Array()
var indexFree = 0
const port = 9091


// ========================== SOCKETS
socket.on('connection',function(client, ack){
    console.log("A client is connected")
    clients.push(client)

    if(rooms.length > 0){
        ack("amoree")
    }
    else{
        ack("amoree")
    }

    /*FUNCTIONS*/
    client.on("disconnect",function(){
        let index = clients.indexOf(client)
        clients.pop(index)
    })

    client.on("create room",function(room){
        if(rooms.includes(room.name)) {
            ack("Not created")
        }
        else{
            let newRoom = room
            newRoom.channel = indexFree
            indexFree = indexFree + 1
            rooms.push(newRoom)
            client.room = newRoom.channel
            client.join()
            ack("Created")
        }
    });

    client.on('join', function(room) {
        console.log("A client joined on channel: " + room.channel)
        client.room = room.channel
        client.join()
        ack("Joined")
    });

    client.on("exit rooms", function() {
        client.leave()
        ack("Exit succesfully")
    });
})



//============================ LISTENERS
http.listen(port, function() {
    console.log("Server socket in listeing on port "+port)
});