/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

var Canvas = {
	canvas: undefined,
	ctx: undefined,
};

Canvas.initialize = function () {
	Canvas.canvas = document.querySelector('#game-canvas');
	Canvas.ctx = Canvas.canvas.getContext('2d');
};

Canvas.clear = function () {
	Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
};
//Set the property for the text game the game
Canvas.drawText = function (text, position, color = '#fff', size = 20, align = 'center', stroke = false) {
	Canvas.ctx.fillStyle = color;
	Canvas.ctx.font = `${size}px monospace`;
	Canvas.ctx.textAlign = align;
	if (stroke) {
		Canvas.ctx.strokeText(text, position.x, position.y);
	} else {
		Canvas.ctx.fillText(text, position.x, position.y);
	}
};

Canvas.drawLine = function (x1, y1, x2, y2, color = '#ffffff', width = 1) {
	Canvas.ctx.beginPath();
	Canvas.ctx.strokeStyle = color;
	Canvas.ctx.strokeWidth = width;
	Canvas.ctx.moveTo(x1, y1);
	Canvas.ctx.lineTo(x2, y2);
	Canvas.ctx.stroke();
};
// draw the images in the game
Canvas.drawImage = function (image, position, offset = { x: 0, y: 0 }, size) {
	if ('undefined' == typeof size) {
		size = {
			w: image.width,
			h: image.height,
		};
	} else {
		if ('undefined' == typeof size.w) {
			size.w = image.width;
		}
		if ('undefined' == typeof size.h) {
			size.h = image.height;
		}
	}
	Canvas.ctx.drawImage(image, offset.x, offset.y, size.w, size.h, position.x, position.y, size.w, size.h);
};

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ALL THE FLOOR SCRIPTS ARE HANDLED FROM HERE
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
const TILES = [
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'L', 'X', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O'],
	['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'B', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'L', 'O', 'O', 'O', 'O'],
	['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
];

const floorImage = new Image();
const ladderImage = new Image();
floorImage.src = './images/floor.png';
ladderImage.src = './images/ladder.png';

var Floor = {
	floorWidth: 504,
	tileSize: {
		w: 18,
		h: 18,
	},
	tile_x_count: 28,
	tile_y_count: 28,
	floorSpace: 0,
};

Floor.init = function () { };

Floor.draw = function () {
	TILES.forEach((floor, row) => {
		floor.forEach((tile, column) => {
			//console.log('x: ' + column * this.tileWidth, 'y: ' + row * this.tileHeight);
			if (tile == 'F') {
				Canvas.drawImage(floorImage, { x: column * Floor.tileSize.w, y: row * Floor.tileSize.h }, { x: 0, y: 0 });
			} else if (tile == 'L' || tile == 'B') {
				Canvas.drawImage(ladderImage, { x: column * Floor.tileSize.w, y: row * Floor.tileSize.h }, { x: 0, y: 0 });
			}
		});
	});
};

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ALL OTHER GME CHARACTERS ARE DEFINED FROM HERE.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const drum = new Image();
drum.src = './images/drum.png';
const fire = new Image();
fire.src = './images/fire.png';
const barrel = new Image();
barrel.src = './images/barrel.png';
const pauline = new Image();
pauline.src = './images/pauline.png';
const donkey = new Image();
donkey.src = './images/donkey.png';

/**
 * Define properties required by characters.
 */

var Characters = {
	fireIntensity: 0, // used to check which fire frame is to be drawn next.
	fireOffset: 0, // store the current offset left image frame of the fire.
	paulineIntensity: 0, // used to check which frame of pauline should be drawn.
	paulineOffset: 0, // store the current offset left of pauline.
	paulineFloor: 2, // which floor is pauline standing on, used to check if mario reached here.
	paulineLeft: Floor.tileSize.w * 11, // the left pixels of Pauline also used to check if Mario reached pauline.
	donkeyThrowing: true, // if the donkey is throwing a barrel or not.
	donkeyIntensity: 0, // used to check which donkey frame is to be drawn.
	donkeyOffset: 60, // the current left offset of the donkey frame.
	donkeyLastThrow: 0, // the last time the donkey threw a barrel. if this is 0, throw another barrel.
};
/**
 * Update each characters draw to the canvas.
 */
Characters.update = function () {
	this.fireIntensity += 1;
	this.paulineIntensity += 0.4;
	this.donkeyIntensity += 0.5;
	this.donkeyLastThrow -= 2;
	if (this.fireIntensity > 10) {
		this.fireOffset = 20;
	} else {
		this.fireOffset = 0;
	}

	/**
	 * Update pauline movement/reaction from here.
	 */
	if (this.paulineIntensity < 10) {
		this.paulineOffset = 0;
	} else if (this.paulineIntensity < 20) {
		this.paulineOffset = 25;
	} else if (this.paulineIntensity < 30) {
		this.paulineOffset = 50;
	} else {
		this.paulineOffset = 75;
	}

	/**
	 * Update Monkey movement/reaction from here.
	 * This conditions is just to animate the frames of the donkey
	 */
	if (this.donkeyThrowing) {
		if (this.donkeyIntensity < 10) {
			this.donkeyOffset = 0;
		} else if (this.donkeyIntensity < 20) {
			this.donkeyOffset = 60;
		} else if (this.donkeyIntensity < 30) {
			this.donkeyOffset = 130;
		} else {
			this.donkeyOffset = 190;
		}
		if (this.donkeyIntensity > 40) {
			Game.barrels.push(new Barrel(60));
			this.donkeyThrowing = false;
			this.donkeyIntensity = 0;
			this.donkeyLastThrow = 400;
			this.donkeyOffset = 60;
		}
	} else {
		if (this.donkeyLastThrow < 0) {
			this.donkeyThrowing = true;
			this.donkeyIntensity = 0;
		}
	}

	if (this.fireIntensity > 20) this.fireIntensity = 0;
	if (this.paulineIntensity > 40) this.paulineIntensity = 0;
};

/**
 * Draw each character to the canvas.
 */
Characters.draw = function () {
	Canvas.drawImage(fire, { x: 0, y: Floor.tileSize.h * 25 }, { x: this.fireOffset, y: 0 }, { w: 20 });
	Canvas.drawImage(drum, { x: 0, y: Floor.tileSize.h * 26 }, { x: 0, y: 0 });
	Canvas.drawImage(barrel, { x: 0, y: Floor.tileSize.h * 3 });
	Canvas.drawImage(pauline, { x: this.paulineLeft, y: Floor.tileSize.h * this.paulineFloor - 5 }, { x: this.paulineOffset, y: 0 }, { w: 20 });
	Canvas.drawImage(donkey, { x: Floor.tileSize.w * 2, y: Floor.tileSize.h * 4 }, { x: this.donkeyOffset, y: 0 }, { w: 60 });
};

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ALL MARIO SCRIPTS ARE DEFINED FROM HERE.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const mario = new Image(); // 34x16
mario.src = './images/mario.png';
const marioLeft = new Image();
marioLeft.src = './images/mario_left.png';
const marioRight = new Image();
marioRight.src = './images/mario_right.png';

var Mario = {
	dead: false,
	falling: false,
	climbing: false, //
	walking: false,
	beating: false,
	hasHammer: false,
	climbHeight: 0,
	jumpHeight: 0,
	fallingHeight: 0,
	jumpDirection: 1, // 1: up, -1: down;
	direction: 1, // 1: right, -1: left
	walkingState: 0,
	left: 50,
	tile: 26,
	offset: 0,
	image: mario,
};

Mario.draw = function () {
	Canvas.drawImage(Mario.image, { x: Mario.left, y: Mario.tile * Floor.tileSize.h - (Mario.jumpHeight || Mario.climbHeight) }, { x: Mario.offset, y: 0 }, { w: 17 });
};

Mario.reset = function () {
	this.dead = false;
	this.falling = false;
	this.climbing = false;
	this.walking = false;
	this.beating = false;
	this.climbHeight = 0;
	this.jumpHeight = 0;
	this.fallingHeight = 0;
	this.jumpDirection = 1;
	this.direction = 1;
	this.walkingState = 0;
	this.left = 50;
	this.tile = 26;
	this.offset = 0;
};

Mario.update = function () {
	if (this.falling) {
		console.log('this is falling');
	} else if (this.climbing) {
		this.climbHeight += 1.3;
		if (this.climbHeight > Floor.tileSize.h * 4) {

			this.climbing = false;
			this.tile -= 4;
			this.climbHeight = 0;
		}
	} else if (this.beating) {
		// we will do something with the beating here.
	} else if (this.jumpHeight > 0) {
		if (this.jumpDirection > 0) {
			// Mario is jumping up
			this.jumpHeight += 1;
			if (this.jumpHeight > 36) {
				this.jumpDirection = -1;
			}
		} else {
			// Mario is falling with gravity
			this.jumpHeight -= 1;
			if (this.jumpHeight <= 0) {
				this.jumpHeight = 0;
				this.jumpDirection = 1;
			}
		}
	} else {
		if (this.direction > 0) {
			this.image = mario;
			this.offset = 17;
			if (this.walking) {
				this.walkingState += 1.2;
				this.image = marioRight;
				this.left += 2;
				if (this.walkingState >= 8) {
					this.offset = 17;
				} else {
					this.offset = 0;
				}
				if (this.walkingState >= 17) this.walkingState = 0;
				// we will check if mario fall to the right.
				if (this.left / Floor.tileSize.w > 13) {
					// we will check which tile mario is currently on. then we will return.
				}
				if (this.left / Floor.tileSize.w > Floor.tile_x_count) {
					// Mario is falling out of the Floor.
					this.falling = true;
					Game.state = 'failed';
				}
			}
		} else {
			this.image = mario;
			this.offset = 0;
			if (this.walking) {
				this.walkingState += 1;
				this.image = marioLeft;
				this.left -= 2;
				if (this.walkingState >= 8) {
					this.offset = 17;
				} else {
					this.offset = 0;
				}
				if (this.walkingState >= 17) this.walkingState = 0;
				// we will check if mario fall to the left. or collided with something.
			}
		}
	}
};

Mario.moveLeft = function () {
	if (!this.canMoveLeft()) {
		this.walking = false;
		return;
	}
	if (!this.dead && !this.falling && !this.climbing && this.jumpHeight == 0) {
		// this is waling toward the left.
		this.direction = -1;
		this.walking = true;
	}
};

Mario.moveRight = function () {
	if (!this.canMoveRight()) {
		this.walking = false;
		return;
	}
	if (!this.dead && !this.falling && !this.climbing && this.jumpHeight == 0) {
		// Mario is walking towards the right.
		this.direction = 1;
		this.walking = true;
	}
};

Mario.jump = function () {
	if (!Mario.dead && !Mario.falling && !Mario.climbing) {
		Mario.jumpHeight = 1;
	}
};

Mario.climbLadder = function () {
	if (!this.dead && !this.falling && this.jumpHeight == 0) {
		let tile = TILES[this.tile][Math.floor((this.left + 10) / Floor.tileSize.w)];
		if (tile == 'L') {
			// Mario is standing on a ladder
			this.climbing = true;
		}
	}
};

Mario.goDownLadder = function () {
	if (!this.dead && !this.falling && this.jumpHeight == 0 && this.tile < 25) {
		let tile = TILES[this.tile + 2][Math.floor((this.left + 10) / Floor.tileSize.w)];
		if (tile == 'L') {
			// There is a ladder bellow the floor. Mario can go down.
			this.jumpHeight = Floor.tileSize.h * 4;
			this.jumpDirection = -1;
			this.tile += 4;
		}
	}
};

Mario.canMoveLeft = function () {
	if (!this.dead && !this.falling && !this.climbing && this.jumpHeight == 0) {
		let prevTile = TILES[this.tile][Math.floor((this.left + Floor.tileSize.w) / Floor.tileSize.w) - 1];
		if (prevTile == 'X') return false;
	}
	return true;
};

Mario.canMoveRight = function () {
	if (!this.dead && !this.falling && !this.climbing && this.jumpHeight == 0) {
		let nextTile = TILES[this.tile][Math.floor((this.left + Floor.tileSize.w) / Floor.tileSize.w) + 1];
		if (nextTile == 'X') return false;
	}
	return true;
};

Mario.foundPauline = function () {
	// let pauline be a;
	let a = {
		x: Characters.paulineLeft,
		y: Characters.paulineFloor * Floor.tileSize.h,
		w: 25,
		h: 25,
	};

	// let mario be b;
	let b = {
		x: this.left,
		y: this.tile * Floor.tileSize.h,
		w: 17,
		h: 17,
	};

	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
};

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ALL BARREL SCRIPTS ARE DEFINED FROM HERE
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const rollingBarrel = new Image();
rollingBarrel.src = './images/barrel_roll.png';

function Barrel(left) {
	this.x = 0;
	this.y = 0;
	this.direction = 1;
	this.falling = false;
	this.fallIntensity = 0;
	this.rollIntensity = 0;
	this.offset = 0;
	this.tile = 6;
	this.left = left;
	this.passedLadder = false;
}

Barrel.prototype.update = function () {
	this.rollIntensity += 1;
	if (this.rollIntensity < 10) {
		this.offset = 0;
	} else if (this.rollIntensity < 20) {
		this.offset = 18;
	} else if (this.rollIntensity < 30) {
		this.offset = 36;
	} else {
		this.offset = 54;
	}
	if (this.rollIntensity > 40) this.rollIntensity = 0;

	// check the position of the barrel;
	if (this.falling) {
		this.fallIntensity += 1.2;
		if (this.fallIntensity > Floor.tileSize.h * 4) {
			// we will first check if the tile was the last one down.
			this.direction = this.direction * -1;
			this.tile += 4;
			this.fallIntensity = 0;
			this.falling = false;
		}
	} else {
		if (this.direction > 0) {
			this.left += 1.2;
		} else {
			this.left -= 1.2;
		}
	}
	// the barrel is on the last floor down.
	if (this.tile + 2 > 27) {
		return;
	}

	// we want to check if the barrel is currently standing on a ladder.
	let tile = TILES[this.tile + 2][Math.floor((this.left + Floor.tileSize.w) / Floor.tileSize.w) - 1];
	if (this.direction > 0) {
		// barrel is moving to the right.
		if (tile == 'L') {
			// There is a ladder bellow the barrel. We can choose to go down or proceed with moving.
			if (!this.passedLadder) {
				if (Math.random() * 500 > 250) {
					this.falling = true;
				} else {
					this.passedLadder = true;
				}
			}
		} else {
			this.passedLadder = false;
		}
		if (!this.falling) {
			// we check if it reached the end of the tile.
			let floorTile = TILES[this.tile + 1][Math.floor((this.left + Floor.tileSize.w) / Floor.tileSize.w) - 1];
			if (floorTile == 'O') {
				this.falling = true;
				console.log('Falling');
			}
		}
	} else {
		// barrel is moving to the left.
		if (tile == 'L') {
			// There is a ladder bellow the barrel. We can choose to go down or proceed with moving.
			if (!this.passedLadder) {
				if (Math.random() * 500 > 250) {
					this.falling = true;
				} else {
					this.passedLadder = true;
				}
			}
		} else {
			this.passedLadder = false;
		}
		if (!this.falling) {
			let floorTile = TILES[this.tile + 1][Math.floor((this.left + Floor.tileSize.w) / Floor.tileSize.w)];
			if (floorTile == 'O') {
				this.falling = true;
				console.log('Falling');
			}
		}
	}
};

// Draw the barrel to the canvas.
Barrel.prototype.draw = function () {
	Canvas.drawImage(rollingBarrel, { x: this.left, y: Floor.tileSize.h * this.tile + this.fallIntensity }, { x: this.offset, y: 0 }, { w: 18 });
};

// Check if the barrel has a collision with Mario.
Barrel.prototype.hasCollision = function () {
	let marioTop = Mario.tile * Floor.tileSize.h;
	let marioLeft = Mario.left;

	let barrelTop = this.tile * Floor.tileSize.h;
	let barrelLeft = this.left;
	if (Mario.climbing) {
		marioTop -= Mario.climbHeight;
	} else if (Mario.jumpHeight > 0) {
		marioTop -= Mario.jumpHeight;
	}
	if (this.falling) {
		barrelTop += this.fallIntensity;
	}

	// we have the current Mario left and top, same with the barrel.

	// let mario be a;
	let a = {
		x: marioLeft,
		y: marioTop,
		w: 18,
		h: 18,
	};

	// let barrel be b;
	let b = {
		x: barrelLeft,
		y: barrelTop,
		w: 18,
		h: 18,
	};

	// this condition check the left and top of each element. Same with bottom and right.
	// returns true if all the conditions are meet meaning there was  a collision.
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
};

// Check if the barrel completed up to the bottom tile without hitting mario.
Barrel.prototype.isFinished = function () {
	return !this.falling && this.tile + 2 > 27 && this.left < 10;
};

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

var donkeyGrin = new Image();
donkeyGrin.src = './images/grin.png';

var Game = {
	score: 0, // recording the game score.
	barrels: [], // for storing all the barrels present in the game.
	state: 'play', // keep track of the game state.
};

/**
 * This method is used to handle all the key pressed in the game.
 * We will switch between the keys we need to check if they were pressed.
 * @param {*} e keydown event.
 */
Game.handleKeyDown = function (e) {
	switch (e.keyCode) {
		case 32: // space bar // use to jump Mario;
			if (Game.state == 'failed' || Game.state == 'completed' || Game.state == 'play') {
				Game.state = 'playing';
				Game.score = 0;
				Mario.reset();
				Game.init();
			} else {
				Mario.jump();
			}
			break;
		case 37: // left arrow key // move Mario left
			Mario.moveLeft();
			break;
		case 38: // up arrow key // Mario climb ladder
			Mario.climbLadder();
			break;
		case 39: // right arrow key // move Mario right
			Mario.moveRight();
			break;
		case 40:
			Mario.goDownLadder();
			break;
	}
};

/**
 * This method is used to handle all the keyup event in the game.
 * We will switch between the keys we need to check if they were released.
 * @param {*} e keyup event.
 */
Game.handleKeyUp = function (e) {
	switch (e.keyCode) {
		case 37:
		case 39:
			Mario.walking = false;
			break;
	}
};

/**
 * This method is called to initialize game components that require initialization.
 * We also use it to clear the barrels array from the game.
 */
Game.init = function () {
	Canvas.initialize();
	Game.barrels = [];
};

/**
 * This is the first method that is called when the game is loaded.
 * It is responsible for assigning the keydown and keyup event to the DOM.
 * This method is also responsible for calling the gameLoop method .
 */
Game.start = function () {
	Game.init();
	document.onkeydown = Game.handleKeyDown;
	document.onkeyup = Game.handleKeyUp;
	console.log('Game started');
	requestAnimationFrame(Game.mainLoop);
};

/**
 * This is the heart of the game.
 * It is called sequentially to update all the game components.
 *
 */
Game.mainLoop = function () {
	Canvas.clear();

	// this three states means the game should not be playing.
	if (Game.state == 'failed' || Game.state == 'completed' || Game.state == 'play') {
		if (Game.state == 'failed' || Game.state == 'completed') {
			Canvas.drawText(Game.state.toUpperCase(), { x: 250, y: 200 }, Game.state == 'completed' ? '#00ff00' : '#FF0000');
			Canvas.drawText('Score: ' + Game.score, { x: 250, y: 250 }, '#00ff00');
			Canvas.drawText('Press Spacebar to Start Game', { x: 250, y: 300 });
		} else {
			Canvas.drawText('DONKEY KONG', { x: 250, y: 100 }, '#FFFFFF', 35);
			Canvas.drawImage(donkeyGrin, { x: 200, y: 150 });
			Canvas.drawText('PRESS SPACEBAR TO START GAME', { x: 250, y: 300 }, '#FFFFFF', 25);
			Canvas.drawLine(100, 330, 400, 330);
			Canvas.drawText('Controls', { x: 250, y: 350 }, '#00ff00', 20);
			Canvas.drawLine(100, 360, 400, 360);
			Canvas.drawText('Spacebar - Jump Mario', { x: 250, y: 380 }, '#0600FF', 16);
			Canvas.drawText('Left Key - Move Mario Left', { x: 250, y: 410 }, '#0600FF', 16);
			Canvas.drawText('Right Key- Move Mario Right', { x: 250, y: 440 }, '#0600FF', 16);
			Canvas.drawText('Up Key - Mario Climb ladder', { x: 250, y: 470 }, '#0600FF', 16);
			Canvas.drawText('Down Key - Go down the ladder', { x: 250, y: 500 }, '#0600FF', 16);
			Canvas.drawText('Created By: Ronisha Isham', { x: 250, y: 130 }, '#EDD400', 16);
		}
	} else {
		// the game is in playing state. Update and draw.
		Game.update();
		Game.draw();
	}
	setTimeout(Game.mainLoop, 1000 / 70);
};

/**
 * This method is responsible for updating all the game objects.
 * It is called sequentially by the mainLoop method.
 * It is used to call the update method of other game objects
 */
Game.update = function () {
	Mario.update();
	Characters.update();
	Game.barrels.forEach((barrel, pos) => {
		barrel.update();
		if (barrel.isFinished()) {
			Game.score += 10;
			Game.barrels.splice(pos, 1);
		} else if (barrel.hasCollision()) {
			Game.state = 'failed';
		}
	});
	if (Mario.foundPauline()) {
		this.state = 'completed';
	}
};

/**
 * This method is responsible for drawing all the game objects to the canvas.
 * It is used to call the draw methods of other game objects.
 */
Game.draw = function () {
	Floor.draw();
	Mario.draw();
	Characters.draw();
	Game.barrels.forEach((barrel, pos) => {
		barrel.draw();
	});
	Canvas.drawText('Score: ' + this.score, { x: 400, y: 20 }, '#00ff00', 20, 'start');
};

// we call the start method when the script is loaded.
Game.start();
