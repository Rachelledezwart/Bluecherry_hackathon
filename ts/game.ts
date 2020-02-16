class Game {
    private canvas = <HTMLCanvasElement>document.querySelector('canvas');
    private context: CanvasRenderingContext2D = this.canvas.getContext('2d');

    //attr
    private _projectiles: Array<Projectile>;
    private _boosters: Array<Booster>;
    private _shooters: Array<Shooter>
    private _player: Character;
    private _score: Scoreboard;

    private keys: Array<boolean> = [];

    public position_x: number;
    public position_y: number;
    public shooting: number;

    /**
    * Function to create the Game
    */
    constructor() {
        let playerRadius: number = 20;

        this.position_x = 0;
        this.position_y = 0;
        this.shooting = 0;

        //create some gameItems
        this._projectiles = new Array();
        this._boosters = new Array();
        this._shooters = new Array(); 
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

        // Arduino makes strings?!
        this.position_x = parseInt(this.position_x.toString());
        this.position_y = parseInt(this.position_y.toString());
        
        // Check for inputs
        let x_speed = this.keys[68] ? movementSpeed : (this.keys[65] ? -movementSpeed : (Math.abs(this.position_x) > 10 ? -this.position_x/7 : 0));
        let y_speed = this.keys[83] ? movementSpeed : (this.keys[87] ? -movementSpeed : (Math.abs(this.position_y) > 10 ? -this.position_y/7 : 0));

        let current_x = this._player.xPosition;
        let current_y = this._player.yPosition;

        let boundary_x = this.canvas.width;
        let boundary_y = this.canvas.height;

        if (current_x + x_speed > boundary_x) {
            x_speed = boundary_x - current_x;
        }
        if (current_y + y_speed > boundary_y) {
            y_speed = boundary_y - current_y;
        }
        if (current_x + x_speed < 0) {
            x_speed = - current_x;
        }
        if (current_y + y_speed < 0) {
            y_speed = - current_y;
        }

        // lrbu
        let facing_directions: ArbitraryStringKeysWithNumbers = {
            'l': 0, 
            'r': 1, 
            'b': 2, 
            'u': 3
        };
        let directions: ArbitraryStringKeysWithNumbers = {
            'r': x_speed + 1,
            'l': -x_speed,
            'b': y_speed,
            'u': -y_speed
        }
        this._player.SetPosition = facing_directions[Object.keys(directions).reduce(function(a: string, b: string){ return directions[a] > directions[b] ? a : b })];


        this._player.SetPositionX = current_x + x_speed;
        this._player.SetPositionY = current_y + y_speed;


        if (this.shooting > 0 || this.keys[32]) {

            const playerX = this._player._xPos;
            const playerY = this._player._yPos;

            let rotationX = 0;
            let rotationY = 0; 
            let imageRotation = './assets/img/fireball_left.png'; 

            if (this._player.position === 2) {
                rotationY = 10;
                rotationX = 0;
                imageRotation = './assets/img/fireball_bottom.png';
            } else if (this._player.position === 1 ) {
                rotationY = 0; 
                rotationX = 10
                imageRotation = './assets/img/fireball_right.png'; 
            } else if (this._player.position === 3) {
                rotationY = -10;
                rotationX = 0; 
                imageRotation = './assets/img/fireball_top.png'; 
            } else {
                rotationY = 0; 
                rotationX = -10;
                imageRotation = './assets/img/fireball_left.png'; 
            }

            if (this._player.ability_1 === 0) {
                this._shooters.push(new Shooter(20, '#FFF', playerX, playerY, rotationX , rotationY, imageRotation));
                this._player.ability_1 += 500;
            }
            
        }

        this.update();

    }

    /**
    * Function changes the size of the canvas to the size of the browser
    */
    public setCanvasSize(): void {
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

        if (this.Distance(xPos, yPos, this._player) < radius + this._player.radius + 30) {
            xPos = Math.random() * (innerWidth - radius * 2) + radius;
            yPos = Math.random() * (innerHeight - radius * 2) + radius;
        }

        this._projectiles.push(new Projectile(radius, '#FFF', xPos, yPos, xVel, yVel));

        let spawnNumber = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        let spawnKind = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        let spawnTime = Math.floor(Math.random() * (20 - 3 + 1)) + 3;

        if (spawnNumber > 2) {
            if (spawnKind == 1) {
                this._boosters.push(new Booster("health", 10, "#3CB371", xPos, yPos));
                console.log("spawned");
            } else {
                this._boosters.push(new Booster("bonus", 10, "#20B2AA", xPos, yPos));
                console.log("spawned 2");
            }
        }

        if (this._player.health > 0) {
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

        if (this._player.health > 0) {
            this._projectiles.map((projectile) => {
                projectile.draw();
                projectile.update();
            });

            
            this._shooters.map((shooters) => {
                shooters.draw();
                shooters.update();
            });

            this._boosters.map((booster) => {
                booster.draw();
            })

            this.CheckCollisionProjectile();
            this.CheckCollisionBooster();
            this.CheckCollisionShooter();
            this._player.drawHealth();
            this._player.draw();
            this._score.draw();

            if (this._player.ability_1 > 0) {
                this._player.ability_1 = this._player.ability_1 - 10; 
            }
            

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
    public CheckCollisionProjectile() {
        this._projectiles.map((projectile, index) => {
            let distance = this.Distance(projectile.xPosition, projectile.yPosition, this._player);

            if (distance < projectile.radius + this._player.radius) {
                console.log("Collision");
                this._projectiles.splice(index, 1);
                this._player.SetHealth = this._player.health - 1;
            }

        });
    }

    public CheckCollisionShooter() {
        this._shooters.map((shooter, index) => {
            console.log(shooter);

            if (shooter._life === 0){
                this._shooters.splice(index, 1);
            }

            for (let ind = 0; ind < this._projectiles.length; ind++) {
                const projectile = this._projectiles[ind];

                
                let distance = this.Distance(shooter.xPosition, shooter.yPosition, projectile);
                
                if (distance < projectile.radius + projectile.radius) {
                    console.log("Collision");
                    this._shooters.splice(index, 1);
                    this._projectiles.splice(ind, 1);
                }
            }

        });
    }

    /**
    * Function to check if the booster collides with the player
    */
    public CheckCollisionBooster() {
        this._boosters.map((booster, index) => {
            let distance = this.Distance(booster.xPosition, booster.yPosition, this._player);

            if (distance < booster.radius + this._player.radius) {
                console.log("Collision Booster!");
                if (booster.name === "health") {
                    this._player.SetHealth = this._player.health + 1;
                    this._score.setScore = this._score.getScore + 5;
                } else if (booster.name === "bonus") {
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
    public Distance(xPos: number, yPos: number, object: GameItem) {
        let xDistance = xPos - object.xPosition;
        let yDistance = yPos - object.yPosition;

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    public SetArdMove(xPos: number, yPos: number) {
        this.position_x = xPos;
        this.position_y = yPos;
    }
}

interface ArbitraryStringKeysWithNumbers {
    [key: string]: number
}