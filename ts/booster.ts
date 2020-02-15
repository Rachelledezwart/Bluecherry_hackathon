/// <reference path="gameItem.ts" />
class Booster extends GameItem{
    private _name: string; 

    /**
    * Function to create the booster
    * @param {string} - name
    * @param {number} - radius
    * @param {string} - colour
    * @param {number} - xPosition
    * @param {number} - yPosition
    */
    constructor(name: string, radius:number, colour: string, xPosition: number = 0, yPosition: number = 0) {
        super(radius, colour, xPosition, yPosition);
        this._name = name;
    }

    /**
    * Function to get the name of the booster
    */
    public get name(){
        return this._name;
    }

    public draw(): void {        
        // this.context.beginPath();
        // this.context.arc(this._xPos, this._yPos, this._radius, 0, Math.PI * 2, false);
        // this.context.strokeStyle = this._colour;
        // this.context.fillStyle = this._colour;
        // this.context.stroke(); 
        // this.context.fill();

        if(this._colour == '#3CB371') {
            const img = new Image();
            img.src = "./assets/img/cookie.png";
            
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        } else {
            const img = new Image();
            img.src = "./assets/img/potion.png";
            
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
    }
}