const PRIVATE_ROOM = 'private';

export default class IOController {
  #io;
  #nbrC;
  constructor(io) {
    this.#io = io;
    this.#nbrC=0;
  }
  registerSocket(socket) {
    socket.on('moveUp',()=>socket.broadcast.emit('moveUp'));
    socket.on('moveDown',()=>socket.broadcast.emit('moveDown'));
    socket.on('stopMoving',(y)=>socket.broadcast.emit('stopMoving',y));
    socket.on('startBallOpp',()=>socket.broadcast.emit('startBallOpp'));
    socket.on('collisionB',(x,y,shiftX,shiftY)=>socket.broadcast.emit('collision',x,y,shiftX,shiftY));
    socket.on('centerB',(x,y,shiftX,shiftY)=>socket.broadcast.emit('center',x,y,shiftX,shiftY));
    socket.on('sendChat',(input)=>socket.broadcast.emit('sendChat',input));
    if(this.#nbrC==0){
      this.#nbrC=1;
      this.setupListeners1(socket);
    }
    else if (this.#nbrC==1) {
      this.#nbrC=2;
      this.setupListeners2(socket);
    }
    else{
      socket.emit('faild','plus de place');
    }
  }
  setupListeners1(socket) {
    socket.emit('connexion','player 1');
    console.log("player 1 is ready");
    socket.on('disconnect',()=>this.leave(socket,1));
  }
  setupListeners2(socket) {
    socket.emit('connexion','player 2');
    console.log("player 2 is ready");
    this.#io.emit('start');
    socket.on('disconnect',()=>this.leave(socket,2));
  }

 leave(socket,i){
   console.log(`player ${i} : ${socket.id} leave`);
   socket.broadcast.emit('playerLeave',`player ${i} has quit the game is stopped`);
   socket.disconnect(true);
   this.#nbrC-=1;
 }
}
