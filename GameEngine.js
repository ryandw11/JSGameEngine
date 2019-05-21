/**
 * 
 * JavaScript GameEgine.
 * @author Ryandw11
 * @version 1.0
 * 
 */

var oldTime;

/**
 * The main class of the GameEngine
 */
class GameEngine {
    static canvas = document.getElementById("game").getContext("2d");
    static background;

    /**
     * Start the game
     * (Add the objects to the canvas **after** this method.)
     * @param {Number} time Time between frame draws, in milliseconds. (Default 20)
     */
    static initialize(time = 20, width = 1000, height = 500) {
        var canvas = document.getElementById("game");
        canvas.width = width;
        canvas.height = height;
        this.width = width;
        this.height = height;
        setInterval(function () {
            EventHandler.fireEvent(UpdateEvent, new UpdateEvent());
        }, time);
        EventHandler.registerHandler(UpdateEvent, onGUpdate);
        /*
            Handle the key events for the KeyHandler Class.
        */
        window.addEventListener("keydown", function (e) {
            if (!KeyHandler.keysDown.includes(e.key))
                KeyHandler.keysDown.push(e.key);
        });
        window.addEventListener("keyup", function (e) {
            KeyHandler.keysDown.splice(KeyHandler.keysDown.indexOf(e.key), 1);
        });

        var rect = new Rectangle();
        rect.setPosition(0, 0);
        rect.setColor("white");
        rect.setScale(this.width, this.height);
        GameEngine.background = rect;

        oldTime = Date.now();
    }

    /**
     * Set the background of the game.
     * @param back The Canvas Object for the background.
     */
    static setBackground(back) {
        GameEngine.background = back;
    }

    /**
     * Get the background of the game.
     * @returns The background as a Canvas Object
     */
    static getBackground() {
        return GameEngine.background;
    }

    /**
     * Get Delta Time.
     */
    static deltaTime = 0;

    /**
     * Enable a Game Engine addon. (Load it).  
     * Note: Loads after your script loads.
     * @param addon The addon you want to enable.
     * @param callback An optional callback function to be called when the script is loaded.
     */
    static enableAddon(addon, callback = null) {
        if (addon.includes(".js")) {
            var script = document.createElement("script");
            script.src = addon;
            document.body.appendChild(script);
            if (callback != null)
                script.addEventListener("load", callback);
        } else {
            var script = document.createElement("script");
            script.src = addon + ".js";
            document.body.appendChild(script);
            if (callback != null)
                script.addEventListener("load", callback);
        }
    }

    static disable(clearScreen = false) {
        if (clearScreen) {
            GameEngine.canvas.clearRect(0, 0, document.getElementById("game").width, document.getElementById("game").height);
        }

        EventHandler.handlers = [];
    }
}

/**
 * Handles the GameObjects
 */
class GameObjects {
    static gameObjectsList = [];
    /**
     * Add an object to the render list.
     * @param {*} obj The Canvas Object to add.
     * @deprecated Use #add() instead. Will be removed in future update.
     */
    static addGameObject(obj) {
        GameObjects.gameObjectsList.push(obj);
    }
    /**
     * Add an object ot the render list.
     * @param {*} obj The Canvas Object to add.
     */
    static add(obj) {
        GameObjects.gameObjectsList.push(obj);
    }

    /**
     * Remove an object from the render list.
     * @param {*} obj The object to remove.
     */
    static remove(obj) {
        GameObjects.gameObjectsList.splice(GameObjects.gameObjectsList.indexOf(obj), 1);
    }

    /**
     * Remove all of a type from the render list.  
     * Example: Remove all Rectangles.
     * @param {*} type The type (Ex: Rectangle)
     */
    static removeType(type) {
        for (var i = 0; i < GameObjects.gameObjectsList.length; i++) {
            if (GameObjects.gameObjectsList[i] instanceof type) {
                GameObjects.remove(GameObjects.gameObjectsList[i]);
            }
        }
    }

    /**
     * Get the list of game objects.
     */
    static getGameObjects() {
        return GameObjects.gameObjectsList;
    }
}

class Vector {
    constructor(x1, y1) {
        this.x = x1;
        this.y = y1;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
}

/**
 * Create a Rectangle Canvas Object.
 */
class Rectangle {
    setScale(sx, sy) {
        this.scaleX = sx;
        this.scaleY = sy;
    }

    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }

    setColor(c) {
        this.color = c;
    }

    getPosition() {
        return new Vector(this.posX, this.posY);
    }
    getScale() {
        return new Vector(this.scaleX, this.scaleY);
    }

    getColor() {
        return this.color;
    }

    translateBy(x, y) {
        this.posX += x;
        this.posY += y;
    }

    draw() {
        if (this.getScale().getX() === undefined || this.getScale().getY() === undefined) {
            throw "Rectange scale not defined.";
        }
        if (this.getPosition().getX() === undefined || this.getPosition().getY() === undefined) {
            throw "Rectange position not defined.";
        }
        GameEngine.canvas.fillStyle = this.getColor();
        GameEngine.canvas.fillRect(this.getPosition().getX(), this.getPosition().getY(), this.getScale().getX(), this.getScale().getY());
    }
}

class Ellipse {
    /**
     * Create an Ellipse!
     * @param {Number} x X Position
     * @param {Number} y Y Position
     * @param {Number} rX x Radius
     * @param {Number} rY y Radius
     * @param {String} c Color
     */
    constructor(x = 0, y = 0, rX = 5, rY = 5, c = "black") {
        this.posX = x;
        this.posY = y;
        this.radiusX = rX;
        this.radiusY = rY;
        this.color = c;
    }
    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }
    setRadius(x, y) {
        this.radiusX = x;
        this.radiusY = y;
    }
    setColor(c) {
        this.color = c;
    }
    getPosition() {
        return new Vector(this.posX, this.posY);
    }
    getRadius() {
        return new Vector(this.radiusX, this.radiusY);
    }
    getColor() {
        return this.color;
    }
    translateBy(x, y) {
        this.posX += x;
        this.posY += y;
    }
    /**
     * Internal use only!  
     * Use #getRadius() instead.
     */
    getScale() {
        return new Vector(this.radiusX, this.radiusY);
    }
    draw() {
        GameEngine.canvas.fillStyle = this.color;
        GameEngine.canvas.beginPath();
        GameEngine.canvas.ellipse(this.posX, this.posY, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        GameEngine.canvas.fill();
    }
}

/**
 * Game Text to be displayed on the canvas.
 */
class GText {
    /**
     * Create a text string! (Note: Text align must be set using the method.)
     * @param {String} txt The text.
     * @param {Number} x X Position
     * @param {Number} y Y Position
     * @param {String} color The color
     * @param {String} size The size
     * @param {String} font The font
     */
    constructor(txt = "default", x = 0, y = 0, color = "black", size = "40px", font = "serif") {
        this.text = txt;
        this.posX = x;
        this.posY = y;
        this.color = color;
        this.size = size;
        this.font = font;
        this.textAlign = "center";
    }
    setText(txt) {
        this.text = txt;
    }
    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }
    setColor(c) {
        this.color = c;
    }
    setSize(siz) {
        this.size = siz;
    }
    setFont(fnt) {
        this.font = fnt;
    }
    setTextAlign(ta) {
        this.textAlign = ta;
    }
    getText() {
        return this.text;
    }
    getPosition() {
        return new Vector(this.posX, this.posY);
    }
    getColor() {
        return this.color;
    }
    getSize() {
        return this.size;
    }
    getFont() {
        return this.font;
    }
    getTextAlign() {
        return this.textAlign;
    }
    translateBy(x, y) {
        this.posX += x;
        this.posY += y;
    }
    draw() {
        GameEngine.canvas.font = this.size + " " + this.font;
        GameEngine.canvas.fillStyle = this.color;
        GameEngine.canvas.textAlign = this.textAlign;
        GameEngine.canvas.fillText(this.text, this.posX, this.posY);
    }
}

class Sprite {
    /**
     * Load in a sprite
     * @param {String} src The image location
     * @param {boolean} defaultSize If it should automatically be set to the default size. (Could override init setSize() settings)
     * @param {Function} callback If you want to handle the size yourself. (Params in function: target, ref)
     */
    constructor(src, defaultSize = true, callback = null) {
        var ref = this;
        var img = new Image();
        img.src = src;
        this.image = img;
        this.posX = 0;
        this.posY = 0;
        this.sizeX = 200;
        this.sizeY = 200;

        if (defaultSize) {
            img.addEventListener("load", function (e) {
                if (callback != null) {
                    callback.call(ref, e.target);
                } else {
                    ref.sizeX = e.target.width;
                    ref.sizeY = e.target.height;
                }
            }, false);
        }
        // If it can not be loaded.
        img.onerror = function (e) {
            GameObjects.gameObjectsList.splice(GameObjects.gameObjectsList.indexOf(ref), 1);
            console.error("[GameEngine] Sprite image " + e.target.src + " is not found!");
        }
    }

    /**
     * Change the sprite image
     * @param {String} src  The image location
     * @param {boolean} defaultSize If it should automatically be set to the default size (Could override init setSize() settings)
     */
    setImage(src, defaultSize = false) {
        var ref = this;
        var img = new Image();
        img.src = src;
        this.image = img;
        if (defaultSize) {
            img.addEventListener("load", function (e) {
                ref.sizeX = e.target.width;
                ref.sizeY = e.target.height;
            }, false);
        }
    }

    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }
    setSize(x, y) {
        this.sizeX = x;
        this.sizeY = y;
    }
    getImage() {
        return this.image;
    }
    getPosition() {
        return new Vector(this.posX, this.posY);
    }
    getSize() {
        return new Vector(this.sizeX.this.sizeY);
    }
    translateBy(x, y) {
        this.posX += x;
        this.posY += y;
    }

    /**
     * __Internal use only!__  
     * Use #getSize() instead.
     */
    getScale() {
        return new Vector(this.sizeX, this.sizeY);
    }

    draw() {
        GameEngine.canvas.drawImage(this.image, this.posX, this.posY, this.sizeX, this.sizeY);
    }

}

class Line {
    constructor(vec1, vec2, c) {
        this.vector1 = vec1;
        this.vector2 = vec2;
        this.color = c;
    }

    setVector1(vec1) {
        this.vector1 = vec1;
    }

    setVector2(vec2) {
        this.vector2 = vec2;
    }

    getVector1() {
        return this.vector1;
    }

    getVector2() {
        return this.vector2;
    }

    setColor(c) {
        this.color = c;
    }

    getColor() {
        return this.color;
    }

    draw() {
        GameEngine.canvas.fillStyle = this.getColor();
        GameEngine.canvas.moveTo(this.getVector1().getX(), this.getVector1().getY());
        GameEngine.canvas.lineTo(this.getVector2().getX(), this.getVector2().getY());
        GameEngine.canvas.stroke();
    }
}

/*
    COLLISION CODE
*/

/**
 * Handles collision
 */
class Collider {
    /**
     * Detect if two objects are colliding with eachother.  
     * Valid types are: Rectangle, Circle, Sprite
     * @param {*} obj1 The first object.
     * @param {*} obj2 The second object.
     */
    static isColliding(obj1, obj2) {
        var obj1Left = obj1.getPosition().getX();
        var obj1Right = obj1.getPosition().getX() + obj1.getScale().getX();
        var obj1Top = obj1.getPosition().getY();
        var obj1Bottom = obj1.getPosition().getY() + obj1.getScale().getY();

        var obj2Left = obj2.getPosition().getX();
        var obj2Right = obj2.getPosition().getX() + obj2.getScale().getX();
        var obj2Top = obj2.getPosition().getY();
        var obj2Bottom = obj2.getPosition().getY() + obj2.getScale().getY();

        // If Colliding with top/bottom of the obj.
        if ((((obj1Top <= obj2Top && obj1Bottom >= obj2Top) && ((obj1Right >= obj2Left && obj1Left <= obj2Right) || (obj1Left >= obj2Left && obj1Right <= obj2Right))) || (obj1Top >= obj2Top && obj1Top <= obj2Bottom) && ((obj1Right >= obj2Left && obj1Left <= obj2Right) || (obj1Left >= obj2Left && obj1Right <= obj2Right)))) {
            return true;
        }
        return false;
    }

    /**
     * If two objects are collding with the __**first**__ one hitting the left side of the second one.  
     * __NOTICE: Use #isColliding with this to not get invalid collisions!__
     * @param {*} obj1 The first object.
     * @param {*} obj2 The second object.
     */
    static isCollidingOnLeft(obj1, obj2) {
        var obj1Left = obj1.getPosition().getX();
        var obj1Right = obj1.getPosition().getX() + obj1.getScale().getX();

        var obj2Left = obj2.getPosition().getX();
        var obj2Right = obj2.getPosition().getX() + obj2.getScale().getX();

        return (obj1Right > obj2Left && obj1Left < obj2Left);
    }

    /**
     * If two objects are collding with the __**first**__ one hitting the right side of the second one.  
     * __NOTICE: Use #isColliding with this to not get invalid collisions!__
     * @param {*} obj1 The first object.
     * @param {*} obj2 The second object.
     */
    static isCollidingOnRight(obj1, obj2) {
        var obj1Left = obj1.getPosition().getX();
        var obj1Right = obj1.getPosition().getX() + obj1.getScale().getX();

        var obj2Left = obj2.getPosition().getX();
        var obj2Right = obj2.getPosition().getX() + obj2.getScale().getX();

        return (obj1Left < obj2Right && obj1Right > obj2Right);
    }

    /**
     * If two objects are colliding with the **first** one hitting the top of the second one.  
     * __NOTICE: Use #isColliding with this to not get invalid collisions!__
     * @param {*} obj1 The first object.
     * @param {*} obj2 The second object.
     */
    static isCollidingOnTop(obj1, obj2) {
        var obj1Top = obj1.getPosition().getY();
        var obj1Bottom = obj1.getPosition().getY() + obj1.getScale().getY();
        var obj2Top = obj2.getPosition().getY();

        return (obj1Top < obj2Top && obj1Bottom > obj1Top);
    }

    /**
     * If two objects are colliding with the **first** one hitting the bottom of the second one.  
     * __NOTICE: Use #isColliding with this to not get invalid collisions!__
     * @param {*} obj1 The first object.
     * @param {*} obj2 The second object.
     */
    static isCollidingOnBottom(obj1, obj2) {
        var obj1Top = obj1.getPosition().getY();
        var obj1Bottom = obj1.getPosition().getY() + obj1.getScale().getY();
        var obj2Bottom = obj2.getPosition().getY() + obj2.getScale().getY();
        return (obj1Top < obj2Bottom && obj1Bottom > obj2Bottom);
    }
}

/*
    EVENTS CODE
*/

/**
 * The event that is called every frame the game updates.
 */
class UpdateEvent {
    getDeltaTime() {
        return GameEngine.deltaTime;
    }
}

class EventHandler {
    static handlers = [];
    static registerHandler(event, callback) {
        EventHandler.handlers.push([event, callback]);
    }
    /**
     * __LAPI ONLY__ Not For Use
     * @param {*} clazz  The class of the event.
     */
    static getAllHandlersFor(clazz) {
        var output = [];
        for (var i = 0; i < EventHandler.handlers.length; i++) {
            if (clazz === EventHandler.handlers[i][0]) {
                output.push(EventHandler.handlers[i]);
            }
        }
        return output;
    }

    /**
     * __LAPI ONLY__ Not For Use
     * @param {*} clazz The class of the event
     * @param {*} event The event
     */
    static fireEvent(clazz, event) {
        // console.log(event);
        var work = EventHandler.getAllHandlersFor(clazz);
        for (var i = 0; i < work.length; i++) {
            work[i][1].call(clazz, event);
        }
    }
}

/**
 * Handles the Keys.
 */
class KeyHandler {
    static keysDown = [];
    static isKeyDown(key) {
        return KeyHandler.keysDown.includes(key);
    }
}

/**
 * **LAPI DO NOT CALL**
 */
function onGUpdate(e) {
    GameEngine.canvas.clearRect(0, 0, document.getElementById("game").width, document.getElementById("game").height);
    GameEngine.background.draw();
    for (var i = 0; i < GameObjects.getGameObjects().length; i++) {
        // GameObjects.getGameObjects()[i].draw();
        try {
            GameObjects.getGameObjects()[i].draw();
        } catch {
            console.warn("[GameEngine] An error rendering a Canvas Object has occured. (Index: " + i + ")");
        }
    }

    var currentTime = Date.now();
    GameEngine.deltaTime = currentTime - oldTime;
    oldTime = currentTime;
}