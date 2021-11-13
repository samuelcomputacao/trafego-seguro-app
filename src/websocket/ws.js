require('dotenv/config');

const WebSocket = require('ws');
const ws = new WebSocket("ws://localhost:3000",{headers:{key:process.env.KEY_WS}});
 

ws.on('open', () => {

});

ws.onmessage = (event) => {
   const {numero} = JSON.parse(event.data);
   console.log(numero);
}

setTimeout(()=>{
    ws.send(process.env.KEY_MESSAGE);
}, 3000);

setTimeout(()=>{
    ws.send('okayy');
}, 10000);

module.exports = ws;