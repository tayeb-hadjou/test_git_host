import Ball from './Ball.js';
import Paddle from './Paddle.js';


const START_X_G = 15;
const BALL_WIDTH_HALF= 12;
const START_Y =50;
const WIDTH= 27
const scoreG_html =document.getElementById("scoreG");
const scoreD_html =document.getElementById("scoreD");
const playerStatus=document.getElementById("player");
/**
 * a Game animates a ball bouncing in a canvas
 */
export default class Game {
  #socket;
  #player1;
  #connect;
  /**
   * build a Gamex
   *
   * @param  {Canvas} canvas the canvas of the game
   */
  constructor(canvas) {
    this.raf = null;
    this.canvas = canvas;
    this.ball = new  Ball((this.canvas.width/2)-BALL_WIDTH_HALF, (this.canvas.height/2)-BALL_WIDTH_HALF, this);
    this.ball.stop=true;
    this.paddleG= new Paddle(this,START_X_G);
    this.paddleD= new Paddle(this,canvas.width-START_X_G-WIDTH);
  }

  /** start this game animation */
  connect() {
    this.#socket = io();
    this.#socket.on('connexion', message => this.connexion(message) );
    this.#socket.on('start',()=>  this.animate());
    this.#socket.on('startBallOpp',()=>this.startOpp());
    this.#socket.on('moveUp',()=>this.paddleD.moveUp());
    this.#socket.on('moveDown',()=>this.paddleD.moveDown());
    this.#socket.on('stopMoving',y=>{this.paddleD.stopMoving();this.paddleD.y=y});
    this.#socket.on('collision',(x,y,shiftX,shiftY)=>this.correctionBall(x,y,shiftX,shiftY));
    this.#socket.on('center',(x,y,shiftX,shiftY)=>this.correctionBall(x,y,shiftX,shiftY));
    this.#socket.on('faild',message=> this.socketFaild(message) );
    this.#socket.on('playerLeave',message=>this.socketPlayerLeave(message));
    this.#socket.on('sendChat',input=>this.rcvChat(input));
  }
  /** animate the game : move and draw */
  animate() {
    this.moveAndDraw();
    this.raf = window.requestAnimationFrame(this.animate.bind(this));
  }
  /** stop this game animation */
  start(){
    this.ball=new Ball((this.canvas.width/2)-12, (this.canvas.height/2)-12, this);
  }
  startOpp(){
    this.ball=new Ball((this.canvas.width/2)-12, (this.canvas.height/2)-12, this);
    this.ball.shiftX=-this.ball.shiftX;
    this.ball.shiftY=-this.ball.shiftY;
    console.log(this.paddleD.width);
  }
  stop() {
    this.ball.stop=true;
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.cancelAnimationFrame(this.raf);

  }
  deconnexion(){
    this.stop();
    this.#socket.disconnect(true);
    this.resetScore();
  }
  collision(x,y,shiftX,shiftY){
    this.#socket.emit('collisionB',x,y,shiftX,shiftY);
  }
  centerBall(){
    if(this.#player1){
      this.#socket.emit('centerB',this.ball.x,this.ball.y,this.ball.shiftX,this.ball.shiftY);
    }
  }
  correctionBall(x,y,shiftX,shiftY){
    this.ball.x=this.canvas.width-x-1;
    this.ball.y=y-1;
    this.ball.shiftX=-shiftX;
    this.ball.shiftY=shiftY;
  }
  /** move then draw the bouncing ball */
  moveAndDraw() {
    const ctxt = this.canvas.getContext("2d");
    ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw and move the ball
    this.paddleG.move();
    this.paddleG.draw(ctxt);
    this.paddleD.move();
    this.paddleD.draw(ctxt);
    this.ball.move();
    this.ball.draw(ctxt);
  }

  paddleGScore(){
    const scoreG=parseInt(scoreG_html.innerText);
    scoreG_html.innerHTML=parseInt(scoreG)+1;
    this.paddleD.y= (this.canvas.height/2)-START_Y;
    this.paddleG.y=(this.canvas.height/2)-START_Y;
  }
  paddleDScore(){
    const scoreD=parseInt(scoreD_html.innerText);
    scoreD_html.innerHTML=parseInt(scoreD)+1;
    this.paddleD.y= (this.canvas.height/2)-START_Y;
    this.paddleG.y=(this.canvas.height/2)-START_Y;
  }
  resetScore(){
    scoreG_html.innerHTML=parseInt(0);
    scoreD_html.innerHTML=parseInt(0);
  }
  keyDownActionHandler(event) {
    switch (event.key) {
        case "Enter":
        var input = document.getElementById("usermsg").value;
        this.sendChat(input);
        break;
        case "Spacebar":
        case " ":
        if(this.ball.stop && this.#player1){
        this.#socket.emit("startBallOpp");
        this.start();
        }
            break;
        case "ArrowUp":
        case "Up":
            this.#socket.emit('moveUp');
            this.paddleG.moveUp();
            break;
         case "ArrowDown":
         case "Down":
            this.#socket.emit('moveDown');
            this.paddleG.moveDown();
             break;
        default: return;
    }
    event.preventDefault();
 }
 keyUpActionHandler(event) {
    switch (event.key) {

        case "ArrowUp":
        case "Up":
        case "ArrowDown":
        case "Down":
            this.#socket.emit('stopMoving',this.paddleG.y);
            this.paddleG.stopMoving();

            break;
        default: return;
    }
    event.preventDefault();

}
connexion(message){
  console.log(`server : ${message}`);
  if(message=="player 1"){
    playerStatus.innerHTML="First";
    this.#player1=true;
  }
  else{
    playerStatus.innerHTML="Sconde";
    this.#player1=false;
  }
  this.#connect=true;
}
socketFaild(message){
  console.log(`server : ${message}`);
  this.#socket.disconnect(true);
  this.stop();
}
socketPlayerLeave(message){
  console.log(`server : ${message}`);
  document.getElementById('start').value = 'connexion';
  playerStatus.innerHTML=message;
  this.#socket.disconnect(true);
  this.#connect=false;
  this.stop();
}
sendChat(input){
  if(input!=''){

  if(this.#connect){
  this.#socket.emit('sendChat',input);
  const chatbox=document.getElementById("chatbox");
  var p=document.createElement('p');
  p.textContent='#you : '+input;
  chatbox.appendChild(p);
}
}

}
rcvChat(input){
   const chatbox=document.getElementById("chatbox");
   var p=document.createElement('p');
   p.textContent='#your adversaire : '+input;
   chatbox.appendChild(p);
}
}
