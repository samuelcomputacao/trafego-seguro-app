import config from "../../config/config.json";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const openConnectionWS = (callback) => {
  let ws;
  if (!global.ws) {
    ws = new W3CWebSocket(config.websocketAPI);

    ws.onopen = () => {
      console.log("WebSocket Client Connected");
      const msg = { type: "AUTHORIZATION", value: config.websocket.key };
      ws.send(JSON.stringify(msg));
      global.ok = true;
    };
  }else{
    ws = global.ws;
  }

  ws.onclose = () => {
    global.ws = undefined;
    global.ok = undefined;
    console.log("WebSocket Client Closed!");
  };

  ws.onmessage = ({data}) => {
    if (data) {
      const msg = JSON.parse(data);
      console.log(msg);
    }
  };

  if(global.timer){
    clearInterval(global.timer);
  }

  global.timer = setInterval(async () => {
    if (global.ok) {
      const msg = await callback();
      ws.send(JSON.stringify(msg));
    }
  }, 1000);

  global.ws = ws;
};

const closeConnectionWS = () => {
  if (global.ws) {
    const msg = { type: "CLOSE", value: config.websocket.key };
    global.ws.send(JSON.stringify(msg));
    global.ws.close();
    global.ws = undefined;
    global.ok = undefined;
  }
};

module.exports = { openConnectionWS, closeConnectionWS };
