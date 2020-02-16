/// <reference path="gameItem.ts" />

class Character extends GameItem {
    //attr
    private _health: number;
    public position: number; 
    public ability_1: number;
    
    /**
    * Function to create the Character
    * @param {string} - name
    * @param {number} - colour
    * @param {number} - xPosition
    * @param {number} - yPosition
    */
    constructor(radius:number = 10, colour: string, xPosition: number = 0, yPosition: number = 0, position: number = 0) {
        super(radius, colour, xPosition, yPosition);
        this._health = 3;
        this.position = position;
        this.ability_1 = 0;
    }

    /**
    * Function to set the x position
    * @param {number} - xPos
    */
    public set SetPositionX(xPos: number) {
        this._xPos = xPos;
    }

    /**
    * Function to set the y position
    * @param {number} - yPos
    */
    public set SetPositionY(yPos: number) {
        this._yPos = yPos;
    }

    /**
    * Function to set the health
    * @param {number} - health
    */
    public set SetHealth(health: number) {
        this._health = health;
    }

    /**
    * Function to set the position
    * @param {number} - position
    */
    public set SetPosition(position: number) {
        this.position = position;
    }

    /**
    * Function to get the health
    */
    public get health() {
        return this._health;
    }
        
    /**
    * Function to draw the state of the Character in the DOM
    */    
    public draw(): void {
        // this.context.beginPath();
        // this.context.arc(this._xPos, this._yPos, this._radius, 0, Math.PI * 2, false);
        // this.context.strokeStyle = this._colour;
        // this.context.fillStyle = this._colour;
        // this.context.stroke(); 
        // this.context.fill();

        if (this.position == 0) { 
            const img = new Image();
            img.src = "./assets/img/wizard.png";
            
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        } else if (this.position == 3) {
            const img = new Image();
            img.src = "./assets/img/wizard_3.png";
            
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        } else {
            const img = new Image();
            img.src = "./assets/img/wizard_2.png";
            
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }

    }

    /**
    * Function to draw the state of the health in the DOM
    */   
    public drawHealth(): void {
        this.context.font = "30px 'Lato'";
        this.context.fillStyle = "#fff";
        this.context.fillText("Lives: " + this._health, 25, 50);
    }
}  