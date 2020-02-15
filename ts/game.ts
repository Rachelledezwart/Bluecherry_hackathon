class Game {
    private canvas = <HTMLCanvasElement> document.querySelector('canvas');
    private context: CanvasRenderingContext2D = this.canvas.getContext('2d');
    
    //attr
    private _projectiles: Array<Projectile>;
    private _boosters: Array<Booster>;
    private _player: Character; 
    private _score: Scoreboard; 

    private keys: Array<boolean> = [];

    /**
    * Function to create the Game
    */
    constructor(){
        let playerRadius: number = 20;

        //create some gameItems
        this._projectiles = new Array(); 
        this._boosters = new Array(); 
        this._player = new Character(playerRadius, "#912F40", window.innerWidth / 2 - playerRadius / 2, window.innerHeight / 2 - playerRadius / 2);
        this._score = new Scoreboard(0);

        //add keydown handler to the window object
        window.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });        

        //draw is initial state
        this.setCanvasSize();

        //summon more circles the long the game goes ons
        this.draw();

        //start the game
        this.gameLoop();
    }


    /**
    * Function that loops continuously to update the canvas and checks the key input
    */
    public gameLoop = (): void => {
        requestAnimationFrame(this.gameLoop);

        let movementSpeed = 10;

        if (this.keys[65] && this._player.xPosition - this._player.radius > 0) {
            this._player.SetPositionX = this._player.xPosition - movementSpeed;
            this._player.SetPosition = 0;
        }

        if (this.keys[68] && this._player.xPosition + this._player.radius < innerWidth) {
            this._player.SetPositionX = this._player.xPosition + movementSpeed;
            this._player.SetPosition = 1;
        }

        if (this.keys[83] && this._player.yPosition + this._player.radius < innerHeight) {
            this._player.SetPositionY = this._player.yPosition + movementSpeed;
            this._player.SetPosition = 1;
        }

        if (this.keys[87] && this._player.yPosition - this._player.radius > 0) {
            this._player.SetPositionY = this._player.yPosition - movementSpeed;
            this._player.SetPosition = 3;
        }
        
        this.update();
        
    }

    /**
    * Function changes the size of the canvas to the size of the browser
    */
    public setCanvasSize(): void{
        this.canvas.width = document.body.clientWidth; //document.width is obsolete
        this.canvas.height = document.body.clientHeight; //document.height is obsolete
    }
    
    /**
    * Function to draw the initial state of al living objects
    */
    public draw(): void {
        let radius = 25; 

        let xPos = Math.random() * (innerWidth - radius * 2) + radius;
        let yPos = Math.random() * (innerHeight - radius * 2) + radius;

        let xVel = (Math.random() - 0.5) * 10;
        let yVel = (Math.random() - 0.5) * 10;

        let currentScore = this._score.getScore;

        if(this.Distance(xPos, yPos, this._player) < radius + this._player.radius + 30){
            xPos = Math.random() * (innerWidth - radius * 2) + radius;
            yPos = Math.random() * (innerHeight - radius * 2) + radius;
        }

        this._projectiles.push(new Projectile(radius, '#FFF', xPos, yPos, xVel, yVel));

        let spawnNumber = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        let spawnKind = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        let spawnTime = Math.floor(Math.random() * (20 - 3 + 1)) + 3;

        console.log(this._player.position);

        if(spawnNumber > 2){
           if(spawnKind == 1){
                this._boosters.push(new Booster("health", 10, "#3CB371", xPos, yPos));
                console.log("spawned");
            } else {
                this._boosters.push(new Booster("bonus", 10, "#20B2AA", xPos, yPos));
                console.log("spawned 2");
            }
        }
        
        if(this._player.health > 0){
            this._score.setScore = currentScore += 1;
            setTimeout(() => {
                this.draw();
            }, 5000); 
        }
    }
    
    /**
    * Function to update the state of all living objects
    */
    public update(): void {
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        if(this._player.health > 0){
            this._projectiles.map((projectile) => {
                projectile.draw();  
                projectile.update();
            });

            this._boosters.map((booster) => {
                booster.draw();
            })
            
            this.CheckCollisionProjectile();
            this.CheckCollisionBooster();
            this._player.drawHealth();
            this._player.draw();
            this._score.draw();

        } else {
            let score = this._score.getScore; 

            this.context.textBaseline = "middle"; 
            this.context.font = "30px ' 'Kaushan Script";

            const img = new Image()
            img.src = "./assets/img/skeleton.png"
            
            this.context.drawImage(img, innerWidth / 2 - 35, innerHeight / 2 - 125);

            this.context.fillText("Game Over!", innerWidth / 2 - 75, innerHeight / 2 - 25); 
            this.context.fillText("score: " + score, innerWidth / 2 - 55, innerHeight / 2 + 25); 
        }
    }
    
    /**
    * Function to check if the projectile collides with the player
    */
    public CheckCollisionProjectile(){
        this._projectiles.map((projectile, index) => {
            let distance = this.Distance(projectile.xPosition, projectile.yPosition, this._player);

            if(distance < projectile.radius + this._player.radius){
                console.log("Collision");
                this._projectiles.splice(index, 1);
                this._player.SetHealth = this._player.health - 1; 
            }

        });
    }

    /**
    * Function to check if the booster collides with the player
    */
    public CheckCollisionBooster(){
        this._boosters.map((booster, index) => {
            let distance = this.Distance(booster.xPosition, booster.yPosition, this._player);

            if(distance < booster.radius + this._player.radius){
                console.log("Collision Booster!");
                if(booster.name === "health"){
                    this._player.SetHealth = this._player.health + 1; 
                    this._score.setScore = this._score.getScore + 5; 
                } else if(booster.name === "bonus"){
                    this._score.setScore = this._score.getScore + 10; 
                }
                this._boosters.splice(index, 1);
            }
        });
    }

    /**
    * Function to check the distance of the given object to the distance of the player 
    * @param {number} - xPos
    * @param {number} - yPos
    * @param {GameItem} - object
    */
    public Distance(xPos: number, yPos: number, object: GameItem){
        let xDistance = xPos - object.xPosition;
        let yDistance = yPos - object.yPosition;

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

}
