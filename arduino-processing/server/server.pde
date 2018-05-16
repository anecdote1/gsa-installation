import websockets.*;

WebsocketServer ws;
int now;
float x, y;

void setup() {
  size(400, 200);
  ws = new WebsocketServer(this, 8025, "/");
}

void draw() {
}


void mouseMoved() {
  int mapped = round(map(mouseX, 0, width, -5, 5));
  ws.sendMessage(mapped+"");
}
void webSocketServerEvent(String msg) {
  println(msg);
}