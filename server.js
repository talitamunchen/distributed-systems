var net = require('net');

var nextId = 1;
var database = {

}

var server = net.createServer(function(clientSocket){
    console.log('Client connected');

    clientSocket.on('data', function(data){

        var lenght = Buffer.byteLength(data, 'utf8');
        console.log(`New request of ${lenght} bytes: ${data}`);//lenght bytes

        var query = JSON.parse(data);
        if(query.method){
            if(query.method == 'get'){
                findAndSend(query.data, clientSocket);
            }else if (query.method == "post"){
                insertAndReturnId(query.data, clientSocket);
            }else{
                sendUndefinedMethod(query.method, clientSocket);
            }
        }else{
            sendUndefinedMethod(query.method, clientSocket);
        }
    });

    clientSocket.on('error', function(exception) {
        console.log('Client disconected');
        clientSocket.destroy();
    });
});

var sendUndefinedMethod = function(method, clientSocket){
    send(400, `Invalid method: ${method}`, clientSocket);
}

var findAndSend = function(data, clientSocket){
    if (data && data.id){
        var obj = database[data.id];
        if(obj){
            send(200, obj, clientSocket);
        }else{
            send(404, `Object not found with id ${data.id}`, clientSocket);
        }
    }else{
        send(400, `Invalid query: ${data}`, clientSocket);
    }
}

var send = function(status, payload, clientSocket){
    clientSocket.write(JSON.stringify({
        status: status,
        payload: payload
    }));
}

var insertAndReturnId = function(data, clientSocket){
    var id = nextId++;
    database[id] = data;
    send(200, {id:id, msg: `Inserted`}, clientSocket);
}

server.listen(8080, '127.0.0.1');
console.log('server on');