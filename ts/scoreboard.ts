class Scoreboard {   
    //attr
    protected canvas = <HTMLCanvasElement> document.querySelector('canvas');
    protected context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    private _points: number;

    /**
    * Function to create the Character
    * @param {number} - points
    */
    constructor(points: number = 0) {
        this._points = points;
    }
    
    /**
    * Function to set the score
    * @param {number} - yPosition
    */
    public set setScore(points: number) {
        this._points = points;
        window.publishStats();
    }

    
    /**
    * Function to get the score
    */
    public get getScore(){
        return this._points;
    }
    
    /**
    * Function to draw the score
    */
    public draw(): void{
        this.context.font = "30px 'Lato'";
        this.context.fillStyle = "#fff";
        this.context.fillText("Score: " + this._points, window.innerWidth - 175 , 50);
    }
}
