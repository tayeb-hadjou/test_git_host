import Mobile from './Mobile.js';

const BALL_IMAGE_SRC = './images/paddle.png';
const SHIFT_X = 0;
const SHIFT_Y = 10;
const START_X = 15;
const START_Y = 50;
const  MoveState = { LEFT : 0, RIGHT : 1, NONE : 2,UP:3,DOWN:4};
export default class Paddle extends Mobile {

  /**  build a paddle
   * @param  {Game} theGame   the Game this ball belongs to
   */
  constructor(theGame,x) {
    super(x, (theGame.canvas.height/2)-START_Y, BALL_IMAGE_SRC , SHIFT_X, SHIFT_X);
    this.theGame = theGame;
    this.moving=MoveState.NONE;
  }
  get up(){
      return this.MoveState==MoveState.UP;
  }
  get down(){
      return this.MoveState==MoveState.DOWN;
  }
  moveUp(){
      this.shiftY = - SHIFT_Y ;
      this.moving=MoveState.UP;

      }
  moveDown(){
      this.shiftY = SHIFT_Y;
      this.moving=MoveState.DOWN;

  }
  move() {
    if(this.moving!=MoveState.NONE){
      if (this.y + SHIFT_Y> SHIFT_Y && this.moving === MoveState.UP)  {
        super.move();
    }
    else if(this.y<(this.theGame.canvas.height)-this.height && this.moving === MoveState.DOWN){
      super.move();
    }}
  }
}
