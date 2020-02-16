/// <reference path="gameItem.ts" />

class Shooter extends GameItem {
    //attr
    private _xVel: number;
    private _yVel: number;

    public _life: number;

    /**
    * Function to create the Character
    * @param {string} - name
    * @param {number} - xPosition
    * @param {number} - yPosition
    */
    // constructor(radius:number = 10, colour: string, xPosition: number = 0, yPosition: number = 0, xVelocity: number, yVelocity: number) {
    constructor(radius:number = 10, colour: string, xPosition: number = 0, yPosition: number = 0, xVelocity: number, yVelocity: number) {
        super(radius, colour, xPosition, yPosition);
        this._xVel = xVelocity; 
        this._yVel = yVelocity;

        this._life = 1; 
    }
    
    /**
    * Function to draw the initial state of the shooter
    * @param {HTMLElement} - container
    */
    public draw(): void {
        // this.context.beginPath();
        // this.context.arc(this._xPos, this._yPos, this._radius, 0, Math.PI * 2, false);
        // this.context.strokeStyle = this._colour;
        // this.context.stroke();
        
        const img = new Image()
        img.src = "./assets/img/fireball.png"
        
        this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
    }

    public setDirection(): void {
        
    }

    /**
    * Function to update the state of the shooter in the DOM
    */    
    public update(): void {
        if(this._xPos + this._radius > innerWidth || this._xPos - this._radius < 0){
            this._life = 0; 
        }

        if(this._yPos + this._radius > innerHeight || this._yPos - this._radius < 0){
            this._life = 0; 
        }

        this._xPos += this._xVel;
        this._yPos += this._yVel;
        
    }
}  