# Web-Socket-Backend-For-Chat-Application
It sends Helps Sending Realtime Messeges .
it Also Has storing property. when a user is off line and not connected to the socket it stores all messeges and deliveres to them when they are back online again.

On websocket Connection Init Data
```
{
  "type": "init",
  "data": {
    "_id": "634b15738fd7ef02200fc359",
    "Uid": "gmail.com",
    "part": [
      {
        "Uid": "sn@gmail.com",
        "name": "Shibam_Naskar",
        "_id": "634b15738fd7ef02200fc356",
        "__v": 0
      },
      {
        "Uid": "sns@gmail.com",
        "name": "Shibam_Naskar",
        "_id": "634b163f2e7c39938be1c5bd",
        "__v": 0
      }
    ],
    "__v": 0
  }
}
```
it creates group based on email ids ... It will create a group for every college based on their email ids


if there is any messege 
```
{
  "type": "msg",
  "data": {
    "msgid": "sn@gmail.com",
    "msg": "hii",
    "from": {
      "name": "Shibam_Naskar",
      "id": "sn@gmail.com"
    }
  }
}
```

and to Send messege you have to pass

if personal msg 
```
ws.send(JSON.stringify({
  type:"prs",
  to:"sns@gmail.com",
  msg:messageBox.value,
}));
```

if group msg
```
ws.send(JSON.stringify({
  type:"grp",
  to:"",
  msg:messageBox.value,
}));
```
