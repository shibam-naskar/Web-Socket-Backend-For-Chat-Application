const express = require('express');
const http = require('http');
const { default: mongoose } = require('mongoose');
const WebSocket = require('ws');
const grpbaseUser = require('./schemas/grpbaseUser');
const pendingMessegeSchema = require('./schemas/pendingMessegeSchema');
const userSchema = require('./schemas/userSchema');

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;


const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

uniqueid = 651625615;

wss.on('connection', async function connection(ws, req) {
  var uid = req.url.toString().split('/?')[1];
  var name = req.url.toString().split('/?')[2];
  ws.id = uid;
  var clggrp = uid.split('@')[1];

  var user = await userSchema.find({ "Uid": uid });
  console.log(user)
  if (user.length == 0) {
    const user1 = await userSchema.create({ "Uid": uid, "name": name });
    user = [user1];
  }

  var grpdata = await grpbaseUser.find({ 'Uid': clggrp });
  if (grpdata.length == 0) {
    const grp = grpbaseUser.create({ "Uid": clggrp, "part": user })
    grpdata = grp;
  } else {
    var grp = await grpbaseUser.find({ "Uid": clggrp })
    if (!grp[0].part.filter(e => e.Uid === user[0].Uid).length > 0) {
      grp[0].part.push(user[0])
      console.log("updating")
      console.log(grp[0].part)
      const newgrp = await grpbaseUser.findByIdAndUpdate(grp[0]._id, grp[0]);
      console.log(newgrp)
    }
  }

  ws.send(JSON.stringify({
    type: "init",
    data: grpdata[0]
  }))

  var awaitsmsg = await pendingMessegeSchema.find({ "Uid": uid });
  awaitsmsg.forEach(async (msg) => {
    ws.send(JSON.stringify(msg.data))
    await pendingMessegeSchema.findByIdAndDelete(msg._id);
  })

  ws.on('message', async function incoming(data) {

    var msgdata = JSON.parse(data);
    console.log(msgdata)

    var grpid = clggrp;
    var messege = msgdata.msg;
    var from = {
      name: name,
      id: uid
    }

    var grpdata = await grpbaseUser.find({ 'Uid': grpid });
    var sends = grpdata[0].part;
    var pendings = [];




    if (msgdata.type === 'grp') {

      sends.forEach((e) => {
        pendings.push(e.Uid);
      })

      wss.clients.forEach(function each(client) {
        if (client !== ws && sends.filter(e => e.Uid === client.id).length > 0) {
          if (client.readyState === WebSocket.OPEN) {
            for (let i = 0; i < pendings.length; i++) {
              if (pendings[i] == client.id) {
                pendings.splice(i, 1);
                break;
              }
            }
            console.log("hii")
            client.send(JSON.stringify({
              type: "msg",
              data: {
                msgid: grpid,
                msg: messege,
                from: from
              }
            }));
          }
        }
      })

    } else {

      var touser = msgdata.to;

      pendings.push(touser);

      grpid = from.id;

      wss.clients.forEach(function each(client) {
        if (client !== ws && client.id === touser) {
          if (client.readyState === WebSocket.OPEN) {
            pendings.pop();
            console.log("personal")
            client.send(JSON.stringify({
              type: "msg",
              data: {
                msgid: from.id,
                msg: messege,
                from: from
              }
            }));
          }
        }
      })

    }

    pendings.forEach(async (user) => {
      var dd = await pendingMessegeSchema.create({
        Uid: user,
        data: {
          type: "msg",
          data: {
            msgid: grpid,
            msg: messege,
            from: from
          }
        }

      })
    })






  })
})



server.listen(port, function () {
  mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Mongo DB connected successfully!");
    }
  });
  console.log(`Listening at port ${port}`);
})

