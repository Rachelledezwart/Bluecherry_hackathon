var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class GameItem {
    constructor(radius, colour = '#5E0028', xPosition = 0, yPosition = 0) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this._radius = radius;
        this._colour = colour;
        this._xPos = xPosition;
        this._yPos = yPosition;
    }
    get xPosition() {
        return this._xPos;
    }
    get yPosition() {
        return this._yPos;
    }
    get radius() {
        return this._radius;
    }
}
class Booster extends GameItem {
    constructor(name, radius, colour, xPosition = 0, yPosition = 0) {
        super(radius, colour, xPosition, yPosition);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    draw() {
        if (this._colour == '#3CB371') {
            const img = new Image();
            img.src = "./assets/img/cookie.png";
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
        else {
            const img = new Image();
            img.src = "./assets/img/potion.png";
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
    }
}
class Character extends GameItem {
    constructor(radius = 10, colour, xPosition = 0, yPosition = 0, position = 0) {
        super(radius, colour, xPosition, yPosition);
        this._health = 3;
        this.position = position;
        this.ability_1 = 0;
    }
    set SetPositionX(xPos) {
        this._xPos = xPos;
    }
    set SetPositionY(yPos) {
        this._yPos = yPos;
    }
    set SetHealth(health) {
        this._health = health;
    }
    set SetPosition(position) {
        this.position = position;
    }
    get health() {
        return this._health;
    }
    draw() {
        if (this.position == 0) {
            const img = new Image();
            img.src = "./assets/img/wizard.png";
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
        else if (this.position == 3) {
            const img = new Image();
            img.src = "./assets/img/wizard_3.png";
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
        else {
            const img = new Image();
            img.src = "./assets/img/wizard_2.png";
            this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
        }
    }
    drawHealth() {
        this.context.font = "30px 'Lato'";
        this.context.fillStyle = "#fff";
        this.context.fillText("Lives: " + this._health, 25, 50);
    }
}
class Game {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.keys = [];
        this.gameLoop = () => {
            requestAnimationFrame(this.gameLoop);
            let movementSpeed = 10;
            this.position_x = parseInt(this.position_x.toString());
            this.position_y = parseInt(this.position_y.toString());
            let x_speed = this.keys[68] ? movementSpeed : (this.keys[65] ? -movementSpeed : (Math.abs(this.position_x) > 10 ? -this.position_x / 7 : 0));
            let y_speed = this.keys[83] ? movementSpeed : (this.keys[87] ? -movementSpeed : (Math.abs(this.position_y) > 10 ? -this.position_y / 7 : 0));
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
                x_speed = -current_x;
            }
            if (current_y + y_speed < 0) {
                y_speed = -current_y;
            }
            let facing_directions = {
                'l': 0,
                'r': 1,
                'b': 2,
                'u': 3
            };
            let directions = {
                'l': -x_speed,
                'r': x_speed,
                'b': y_speed,
                'u': -y_speed
            };
            this._player.SetPosition = facing_directions[Object.keys(directions).reduce(function (a, b) { return directions[a] > directions[b] ? a : b; })];
            this._player.SetPositionX = current_x + x_speed;
            this._player.SetPositionY = current_y + y_speed;
            if (this.shooting === 1 || this.keys[32]) {
                const playerX = this._player._xPos;
                const playerY = this._player._yPos;
                let rotationX = 0;
                let rotationY = 0;
                if (this._player.position === 2) {
                    rotationY = 10;
                    rotationX = 0;
                }
                else if (this._player.position === 1) {
                    rotationY = 0;
                    rotationX = 10;
                }
                else if (this._player.position === 3) {
                    rotationY = -10;
                    rotationX = 0;
                }
                else {
                    rotationY = 0;
                    rotationX = -10;
                }
                if (this._player.ability_1 === 0) {
                    this._shooters.push(new Shooter(20, '#FFF', playerX, playerY, rotationX, rotationY));
                    this._player.ability_1 += 500;
                }
            }
            this.update();
        };
        let playerRadius = 20;
        this.position_x = 0;
        this.position_y = 0;
        this.shooting = 0;
        this._projectiles = new Array();
        this._boosters = new Array();
        this._shooters = new Array();
        this._player = new Character(playerRadius, "#912F40", window.innerWidth / 2 - playerRadius / 2, window.innerHeight / 2 - playerRadius / 2);
        this._score = new Scoreboard(0);
        window.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });
        this.setCanvasSize();
        this.draw();
        this.gameLoop();
    }
    setCanvasSize() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }
    draw() {
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
            }
            else {
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
    update() {
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
            });
            this.CheckCollisionProjectile();
            this.CheckCollisionBooster();
            this.CheckCollisionShooter();
            this._player.drawHealth();
            this._player.draw();
            this._score.draw();
            if (this._player.ability_1 > 0) {
                this._player.ability_1 = this._player.ability_1 - 10;
            }
        }
        else {
            let score = this._score.getScore;
            this.context.textBaseline = "middle";
            this.context.font = "30px ' 'Kaushan Script";
            const img = new Image();
            img.src = "./assets/img/skeleton.png";
            this.context.drawImage(img, innerWidth / 2 - 35, innerHeight / 2 - 125);
            this.context.fillText("Game Over!", innerWidth / 2 - 75, innerHeight / 2 - 25);
            this.context.fillText("score: " + score, innerWidth / 2 - 55, innerHeight / 2 + 25);
        }
    }
    CheckCollisionProjectile() {
        this._projectiles.map((projectile, index) => {
            let distance = this.Distance(projectile.xPosition, projectile.yPosition, this._player);
            if (distance < projectile.radius + this._player.radius) {
                console.log("Collision");
                this._projectiles.splice(index, 1);
                this._player.SetHealth = this._player.health - 1;
            }
        });
    }
    CheckCollisionShooter() {
        this._shooters.map((shooter, index) => {
            console.log(shooter);
            if (shooter._life === 0) {
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
    CheckCollisionBooster() {
        this._boosters.map((booster, index) => {
            let distance = this.Distance(booster.xPosition, booster.yPosition, this._player);
            if (distance < booster.radius + this._player.radius) {
                console.log("Collision Booster!");
                if (booster.name === "health") {
                    this._player.SetHealth = this._player.health + 1;
                    this._score.setScore = this._score.getScore + 5;
                }
                else if (booster.name === "bonus") {
                    this._score.setScore = this._score.getScore + 10;
                }
                this._boosters.splice(index, 1);
            }
        });
    }
    Distance(xPos, yPos, object) {
        let xDistance = xPos - object.xPosition;
        let yDistance = yPos - object.yPosition;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
    SetArdMove(xPos, yPos) {
        this.position_x = xPos;
        this.position_y = yPos;
    }
}
const app = {};
(() => __awaiter(this, void 0, void 0, function* () {
    let init = function () {
        app.game = new Game();
    };
    window.addEventListener('load', init);
    yield window.setupMqtt('ws://192.168.1.29:8000');
    yield window.subscribeMqtt('hz/bluecherry/backstory');
    yield window.subscribeMqtt('hz/bluecherry/backstory-rec');
    yield window.registerMessageListenerMqtt('hz/bluecherry/backstory', (msg) => {
        const msgArr = msg.split(',');
        app.game.position_y = msgArr[0];
        app.game.position_x = msgArr[1];
        app.game.shooting = msgArr[2];
    });
    setInterval(() => {
        const score = lpad(app.game._score._points, 4, '0');
        const health = lpad(app.game._player._health, 3, '0');
        const string = score + ',' + health;
        window.publishMqtt('hz/bluecherry/backstory-rec', string);
    }, 1000);
}))();
function lpad(s, width, char) {
    return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
}
class Projectile extends GameItem {
    constructor(radius = 10, colour, xPosition = 0, yPosition = 0, xVelocity, yVelocity) {
        super(radius, colour, xPosition, yPosition);
        this._xVel = xVelocity;
        this._yVel = yVelocity;
    }
    bounce() {
        this._xVel = -this._xVel;
        this._yVel = -this._yVel;
    }
    draw() {
        const img = new Image();
        img.src = "./assets/img/slime.png";
        this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
    }
    update() {
        if (this._xPos + this._radius > innerWidth || this._xPos - this._radius < 0) {
            this._xVel = -this._xVel;
        }
        if (this._yPos + this._radius > innerHeight || this._yPos - this._radius < 0) {
            this._yVel = -this._yVel;
        }
        this._xPos += this._xVel;
        this._yPos += this._yVel;
    }
}
class Scoreboard {
    constructor(points = 0) {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this._points = points;
    }
    set setScore(points) {
        this._points = points;
    }
    get getScore() {
        return this._points;
    }
    draw() {
        this.context.font = "30px 'Lato'";
        this.context.fillStyle = "#fff";
        this.context.fillText("Score: " + this._points, window.innerWidth - 175, 50);
    }
}
class Shooter extends GameItem {
    constructor(radius = 10, colour, xPosition = 0, yPosition = 0, xVelocity, yVelocity) {
        super(radius, colour, xPosition, yPosition);
        this._xVel = xVelocity;
        this._yVel = yVelocity;
        this._life = 1;
    }
    draw() {
        const img = new Image();
        img.src = "./assets/img/fireball.png";
        this.context.drawImage(img, this._xPos - 30, this._yPos - 30);
    }
    update() {
        if (this._xPos + this._radius > innerWidth || this._xPos - this._radius < 0) {
            this._life = 0;
        }
        if (this._yPos + this._radius > innerHeight || this._yPos - this._radius < 0) {
            this._life = 0;
        }
        this._xPos += this._xVel;
        this._yPos += this._yVel;
    }
}
//# sourceMappingURL=main.js.map