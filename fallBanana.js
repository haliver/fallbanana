enchant();

window.onload = function() {
	game = new Game(320, 320); 
	game.fps = 20;
	game.preload(['chara1.gif','icon0.gif','bg.png']);
	game.rootScene.backgroundColor = '#ffe0ff';
	var FRAME_COUNT = 15;
	var LIMIT_TIME = 40;
	var LIMIT_SCORE = 5;

	game.onload = function() {
		player = new Sprite(32, 32);
		player.x = 0;
		player.y = 240;
		player.width = 32;
		player.height = 32;

		player.image = game.assets['chara1.gif'];
		player.frame = 0;

		background = new Sprite(320, 320);
		background.x = background.y = 0;
		background.image = game.assets['bg.png'];

		scoreLabel = new Label("");
		scoreLabel.x = scoreLabel.y = 8;
		scoreLabel.addEventListener('enterframe', function(){
			var progress = parseInt(game.frame/game.fps);
			time = LIMIT_TIME - parseInt(game.frame/game.fps);
			this.text = "SCORE: " + game.score + " TIME: " + Math.floor(time);
		});
		game.score = 0;

		game.rootScene.addEventListener('enterframe',function(){
			if(game.frame % 6 == 0){
				addBanana();
			}
			if(game.frame % FRAME_COUNT == 0){
				addBomb();
			}
			if (game.frame/game.fps % 2 == 0 && FRAME_COUNT > 2) {
				FRAME_COUNT -= 1;
			}
			if (time <= 0 && LIMIT_SCORE <= game.score) {
				game.endScene.image = game.assets['clear.png'];
				player.frame = 8;
				game.end(game.score, "SCORE: " + game.score);
			}
			if (time <= 0 && LIMIT_SCORE > game.score) {
				player.frame = 3;
				game.end(game.score, "SCORE: " + game.score)
			}
		});

		var SPEED = 3;
		var MOVE_RANGE_X = game.width - player.width;
		var MOVE_RANGE_Y = game.height - player.height;

		var playerRightList = [0,1,2];
		var playerLeftList = [5,6,7];
		player.frameIndex = 0;

		game.rootScene.addEventListener('enterframe', function(e) {
			var input = game.input;
			if (input.left) {
				player.x -= SPEED;
				player.frameIndex += 1;
				player.frameIndex %= playerLeftList.length;
				player.frame = playerLeftList[player.frameIndex];
			}
			if (input.right) {
				player.x += SPEED;
				player.frameIndex += 1;
				player.frameIndex %= playerRightList.length;
				player.frame = playerRightList[player.frameIndex];
			}

			var left   = 0;
			var right  = MOVE_RANGE_X;

			if (player.x < left){
				player.x = left;
			}
			if (player.x > right){
				player.x = right;
			}
		});
		var pad = new Pad();
		pad.x = 0;
		pad.y = 270;

		scoreLabel.color = 'white';
		scoreLabel.font  = "20px cursive";

		game.rootScene.addChild(background);
		game.rootScene.addChild(pad);
		game.rootScene.addChild(player);
		game.rootScene.addChild(scoreLabel);

	}
	game.start();
}

function addBanana(pos){
	var banana = new Sprite(16, 16);
	banana.x = rand(320);
	banana.y = 0;
	banana.image = game.assets['icon0.gif'];
	banana.frame = 16;

	banana.addEventListener('enterframe', function(e) {
		if(this.intersect(player)){
			game.rootScene.removeChild(this);
			game.score ++;
		}else{
			this.y += 3;
		}
		if(this.y > 260 || this.x > 320 || this.x < -this.width || this.y < -this.height){
			this.remove();
		}
	});
	game.rootScene.addChild(banana);
}

function addBomb(pos){
	var bomb = new Sprite(16, 16);
	bomb.x = rand(320);
	bomb.y = 0;
	bomb.image = game.assets['icon0.gif'];
	bomb.frame = 24;

	var bombList = [24,25];
	bomb.frameIndex = 0;

	bomb.addEventListener('enterframe', function(e) {
		bomb.frameIndex += 1;
		bomb.frameIndex %= bombList.length;
		bomb.frame = bombList[bomb.frameIndex];
		if(this.within(player,10)){
			game.rootScene.removeChild(this);
				player.frame = 3;
			game.end(game.score, "SCORE: " + game.score)
		}else{
			this.y += 3;
		}
		if(this.y > 260 || this.x > 320 || this.x < -this.width || this.y < -this.height){
			this.remove();
		}
	});
	game.rootScene.addChild(bomb);
}

function rand(num){
	return Math.floor(Math.random() * num);
}
