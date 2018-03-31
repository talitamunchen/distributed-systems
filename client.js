var net = require('net');

var port = 8080;
var ip = '127.0.0.1';

var socket = net.Socket();

socket.on('data', function(data){      
    console.log('Server send: ' + data.toString());
});

var send = function(payload, timeout){
    setTimeout(function() {
        socket.write(payload);
    }, timeout);
}

console.log(`Connecting with server ${ip} on port ${port}`);  
socket.connect(port, ip);

var findQuery = {
    method: "get",
    data: {
        id: 1
    }
};

var insertQuery = {
    method: "post",
    data: {
        name: "Maria",
        age: "10"
    }
};

send(JSON.stringify(findQuery), 0);
send(JSON.stringify(insertQuery), 2500)
send(JSON.stringify(findQuery), 5000);