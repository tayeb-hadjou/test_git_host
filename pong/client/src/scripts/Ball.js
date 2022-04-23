import Mobile from './Mobile.js';


// default values for a Ball : image and shifts
const BALL_IMAGE_SRC = './images/balle24.png';
const SHIFT_X = 7;
const SHIFT_Y = 0;
/**
 * a Ball is a mobile with a ball as image and that bounces in a Game (inside the game's canvas)
 */
export default class Ball extends Mobile {

  /**  build a ball
   *
   * @param  {number} x       the x coordinate
   * @param  {number} y       the y coordinate
   * @param  {Game} theGame   the Game this ball belongs to
   */
  constructor(x, y, theGame) {
    super(x, y, BALL_IMAGE_SRC , SHIFT_X, SHIFT_Y);
    this.theGame = theGame;
    this.stop=false;
  }
  /**
   * when moving a ball bounces inside the limit of its game's canvas
   */
  move() {
    if(!this.stop){
      if(this.x<=(this.theGame.canvas.width/2)+5&&this.x>=(this.theGame.canvas.width/2)-5){
        this.theGame.centerBall();
      }
    if (this.x <= 0  ){
      this.stopMoving();
      this.stop=true;
      this.theGame.stop();
      this.theGame.paddleDScore();
    }
    else if (this.x + this.width >= this.theGame.canvas.width ){
      this.stopMoving();
      this.stop=true;
      this.theGame.stop();
      this.theGame.paddleGScore();
    }
    else if(
    this.x  <=this.theGame.paddleG.width+this.theGame.paddleG.x //x
    && this.y+this.width/2 <= this.theGame.paddleG.height+ this.theGame.paddleG.y
    && this.y+this.width/2 >=this.theGame.paddleG.y   ){
      this.collisionPaddle(1,this.theGame.paddleG.y);
    }
    else if (this.y <= 0 || (this.y+this.height >= this.theGame.canvas.height)) {
      this.shiftY = - this.shiftY;    // rebond en haut ou en bas
    }
    else if (
    this.x+this.height >= this.theGame.paddleD.x //x
    && this.y+this.width/2 >=this.theGame.paddleD.y
    && this.y+this.width/2 <= this.theGame.paddleD.y+this.theGame.paddleD.height) {
      this.collisionPaddle(-1,this.theGame.paddleD.y);
    }
    super.move();
  }

  }
  collisionPaddle(i,y){
    let pointImp = ((this.y+this.width)-y) ;
    let part = Math.floor((pointImp*4)/this.theGame.paddleG.height);
    console.log(part);
    if(part==0){
      this.shiftY=-4;
      this.shiftX = i*9 ;
    }
    if(part==1){
      this.shiftY=-3;
      this.shiftX=i*10;
    }
    if(part==2){
      this.shiftY=0;
      this.shiftX=i*10;
    }
    if(part==3){
      this.shiftY = 3;
      this.shiftX = i*10;
    }
    if(part==4){
      this.shiftY = 4;
      this.shiftX= i*9;
    }
      this.theGame.collision(this.x,this.y,this.shiftX,this.shiftY);
  }

}
