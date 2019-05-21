/**
 * An example game made using the GameEngine.
 * @author Ryandw11
 * @version 1.0
 */

// Initialize the gameengine with a tick speed of 0.005 miliseconds, 900 width, 500 height.
GameEngine.initialize(0.005, 900, 500);

/*
    Register event handlers.
*/
EventHandler.registerHandler(UpdateEvent, onUpdate);
EventHandler.registerHandler(UpdateEvent, spawnObjUpdate);
EventHandler.registerHandler(UpdateEvent, moveObject);
EventHandler.registerHandler(UpdateEvent, detectCollision);
EventHandler.registerHandler(UpdateEvent, handleText);

/*
    Create the ground object.
*/
var ground = new Rectangle();
ground.setPosition(0, 450);
ground.setScale(GameEngine.width, 20);
ground.setColor("green");
GameObjects.add(ground);

/*
    Create the player.
*/
var player = new Rectangle();
player.setPosition(GameEngine.width / 2, 0);
player.setScale(20, 20);
player.setColor("red");
GameObjects.add(player);

var isJump = false;
var currentPos;

/*
    Function to control jumping.
*/
function jump() {
    if (player.getPosition().getY() > currentPos - 100) {
        player.translateBy(0, -1);
    } else {
        isJump = false;
    }
}

/*
    Handles button presses.
*/
function onUpdate(e) {
    if (KeyHandler.isKeyDown("w") && !isJump && (Collider.isColliding(player, ground) && Collider.isCollidingOnTop(player, ground))) {
        if (Collider.isColliding(player, ground) && Collider.isCollidingOnBottom(player, ground)) return;
        // rect.translateBy(0, -5);
        currentPos = player.getPosition().getY();
        isJump = true;
    }
    if (isJump) {
        jump();
    } else if (!(Collider.isColliding(player, ground) && Collider.isCollidingOnTop(player, ground))) {
        player.translateBy(0, 1);
    }

    if (KeyHandler.isKeyDown("s")) {
        player.setPosition(GameEngine.width / 2, 430);
    }
}

var time = 2;
var countDown = 2 * 1000;

function spawnObjUpdate(e) {
    countDown -= e.getDeltaTime();
    if (countDown / 1000 < 0) {
        if (time > 0.5) {
            time -= Math.random() / 50;
        }
        countDown = time * 1000;
        makeObject();
    }
}

var activeObjs = [];

function makeObject() {
    var obj = new Rectangle();
    obj.setColor("blue");
    obj.setPosition(900, 420)
    obj.setScale(30, 30);
    GameObjects.add(obj);
    activeObjs.push(obj);
}

var speed = -1.5;
var gameOver = false;
var playerScore = 0;

function moveObject() {
    for (var i = 0; i < activeObjs.length; i++) {
        activeObjs[i].translateBy(-1.5, 0);
        if (activeObjs[i].getPosition().getX() < 0) {
            GameObjects.remove(activeObjs[i]);
            activeObjs.splice(activeObjs.indexOf(activeObjs[i]), 1);
            speed -= Math.random() / 100;
            playerScore += 1;
        }
    }
}

function detectCollision() {
    for (var i = 0; i < activeObjs.length; i++) {
        if (Collider.isColliding(player, activeObjs[i])) {
            gameOver = true;
        }
    }
}


/*
    Create the text objects.
*/
var score = new GText("Score: x", 800, 30, "black", "20px");
var dead = new GText("You died!", GameEngine.width / 2, GameEngine.height / 2, "red");

GameObjects.add(score);

var added = false;

function handleText() {
    score.setText("Score: " + playerScore);
    if (added) {
        GameEngine.disable();
    }
    if (gameOver && !added) {
        GameObjects.add(dead);
        added = true;
    }
}