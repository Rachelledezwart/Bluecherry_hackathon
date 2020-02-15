class GameItem {
    protected canvas = <HTMLCanvasElement> document.querySelector('canvas');
    protected context: CanvasRenderingContext2D = this.canvas.getContext('2d');

    //attr
    protected _radius: number;
    protected _colour: string;
    protected _xPos: number;
    protected _yPos: number;
    
    /**
    * Function to create the GameItem
    * @param {string} - name
    * @param {number} - xPosition
    * @param {number} - yPosition
    */
    constructor(radius: number, colour: string = '#5E0028', xPosition: number = 0, yPosition: number = 0) {
        this._radius = radius;
        this._colour = colour;
        this._xPos = xPosition;
        this._yPos = yPosition;
    }

    /**
    * Function to get x position of the game item
    */
    public get xPosition(){
        return this._xPos;
    }

    /**
    * Function to get y position of the gameItem
    */
    public get yPosition(){
        return this._yPos;
    }

    /**
    * Function to get radius of the gameItem
    */
    public get radius(){
        return this._radius;
    }
}