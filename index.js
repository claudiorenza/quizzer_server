/* CONFIGURAZIONE SERVER */
const express = require('express')()
const http = require('http')
const server = http.Server(express)
const socket = require('socket.io').listen(server)

express.get("/",function(req,res){
    res.send("Funzionante")
})

/* VARIABILI E STRUTTURE */
var data
var port = 8080
var rooms = {
    name:String,
    admin:String,
    channel: Number,
    maxPlayer: Number
}
var listRooms = new Array(rooms)
var gamers = new Array()
var channel = 0

/* FUNZIONI */
socket.on('connection',function(client){
    console.log("A client is connected with id: "+client.id)
    gamers.push(client)
    console.log(gamers.length)

    client.on('disconnect',function(){
        console.log("A client is disconnect")
        let index = gamers.indexOf(client)
        if(client.disconnected){
            console.log("client disconneted")
            gamers.pop(index)
            listRooms.pop(index)
            client.emit('remove',index)
        }
        else if(client.id == listRooms[index].admin){
            gamers.pop(index)
            listRooms.pop(index)
            client.emit('remove',index)
            client.disconnect()
            console.log(gamers.length)  
            console.log("room name "+listRooms[index].name)
            console.log("room deleted")
        }
        console.log("number gamers "+gamers.length)  
        console.log("number rooms "+listRooms.length)
    })
    
    client.on('create',function(room){
        if (listRooms.map.name == room){
            console.log("the room name exist")
        }
        else{
            console.log("creating room\n")
            var index = gamers.indexOf(client)
            var newRoom = rooms
            newRoom.channel = channel
            newRoom.name = room
            newRoom.admin = client.id
            channel++
            listRooms.push(newRoom)
            client.join(channel)
            console.log(listRooms)
            console.log("room name: "+listRooms[index].name)
            console.log("channel: "+listRooms[index].channel)
            console.log("id admin: "+listRooms[index].admin)
            console.log("room lenght "+listRooms.length)
            console.log("Room created and joined\n")
            console.log("client channel "+client.room)
            
        }
    })
   
    client.emit('lists',listRooms)
   
    client.on('join room',function(room){
        console.log("entrato in join")
        console.log(listRooms)
         for(i=0;i<listRooms.length;i++){
            if(listRooms[i].name == room){
                client.room=listRooms[i].channel
            }
        }
        client.join(client.room)
        console.log("client joined at: "+client.room)
     })
})

/* LISTENER */
server.listen(port,function(){
    console.log("Server listen on port " + port)
})