var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {

    //set up background and ground layer
    this.game.world.setBounds(0, 0, 3500, this.game.height);
    // this.grass = this.add.tileSprite(0,this.game.height-100,this.game.world.width,70,'grass');
    // this.cart = this.add.tileSprite(0,this.game.height-100,this.game.world.width,70,'cart');
    // adjust the position of the sprite

    // game height is 420. game width is 746.
    this.cherry = this.game.add.sprite(this.game.width - 10, this.game.height - 330, 'cherry');
    this.strawberry = this.game.add.sprite(this.game.width + 1000, this.game.height - 230, 'strawberry');
    this.pear = this.game.add.sprite(this.game.width + 500, this.game.height - 270, 'pear');
    this.ground = this.add.tileSprite(0,this.game.height-70,this.game.world.width,70,'ground');
    
    // scale the sprites down to a much better size
    this.cherry.scale.setTo(0.1, 0.1);
    this.strawberry.scale.setTo(0.1, 0.1);
    this.pear.scale.setTo(0.08, 0.08);

    
    //create player and walk animation
    this.player = this.game.add.sprite(this.game.width/4, this.game.height-90, 'cart');
    this.player.scale.setTo(.20,.20)
    
    //put everything in the correct order (the grass will be camoflauge),
    //but the toy mounds have to be above that to be seen, but behind the
    //ground so they barely stick up
    // this.game.world.bringToTop(this.grass);
    // this.game.world.bringToTop(this.cart);
    this.game.world.bringToTop(this.ground);

    //enable physics on the player and ground
    this.game.physics.arcade.enable(this.cherry);
    this.game.physics.arcade.enable(this.strawberry);
    this.game.physics.arcade.enable(this.pear);
    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.ground);

    //player gravity
    this.player.body.gravity.y = 1000;
    
    //so player can walk on ground
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    
    //play the walking animation
    this.player.animations.play('walk', 3, true);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    //...or by swiping
    this.swipe = this.game.input.activePointer;

    //set some variables we need throughout the game
    this.wraps = 0;
    this.points = 0;
    this.wrapping = true;
    this.stopped = false;

    // add spacebar as valid key
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //stats
    // var style1 = { font: "20px Arial", fill: "#ff0"};
    // var t2 = this.game.add.text(this.game.width-300, 20, "Remaining Flea Scratches:", style1);
    // t1.fixedToCamera = true;
    // t2.fixedToCamera = true;
    var style1 = { font: "26px Arial", fill: "#00ff00"};
    var t1 = this.game.add.text(this.game.width - 125, this.game.height - 400, "Points:", style1);
    t1.fixedToCamera = true;
    this.pointsText = this.game.add.text(this.game.width - 40, this.game.height - 400, '', style1);
    this.pointsText.fixedToCamera = true;
    this.refreshStats();
  },
  
  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.ground, () => {}, null, this);
    this.game.physics.arcade.collide(this.player, this.cherry, () => this.playerHit(this.cherry), null, this);
    this.game.physics.arcade.collide(this.player, this.strawberry, () => this.playerHit(this.strawberry), null, this);
    this.game.physics.arcade.collide(this.player, this.pear, () => this.playerHit(this.pear), null, this);

    
    //only respond to keys and keep the speed if the player is alive
    //we also don't want to do anything if the player is stopped for scratching or digging
    if(this.player.alive && !this.stopped) {
      
      this.player.body.velocity.x = 300;

      //We do a little math to determine whether the game world has wrapped around.
      //If so, we want to destroy everything and regenerate, so the game will remain random
      if(!this.wrapping && this.player.x < this.game.width) {
        //Not used yet, but may be useful to know how many times we've wrapped
        this.wraps++;
        
        //We only want to destroy and regenerate once per wrap, so we test with wrapping var
        this.wrapping = true;
        
        //put everything back in the proper order
        this.game.world.bringToTop(this.ground);
      }
      else if(this.player.x >= this.game.width) {
        this.wrapping = false;
      }

      //take the appropriate action for swiping up or pressing up arrow on keyboard
      //we don't wait until the swipe is finished (this.swipe.isUp),
      //  because of latency problems (it takes too long to jump before hitting a flea)

      if(this.player.body.velocity.y === 0){
        this.player.angle = 0;
      }

      if (this.spaceBar.isDown) {
        this.playerJump()
      }

      //The game world is infinite in the x-direction, so we wrap around.
      //We subtract padding so the player will remain in the middle of the screen when
        //wrapping, rather than going to the end of the screen first.
      this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
    }

  },
  //show updated stats values
  refreshStats: function() {
    this.pointsText.text = this.points;
  },
  playerHit: function(objectHit) {
    // TODO: show animation on screen

    // add points
    this.points += 10;
    this.refreshStats();
    // destroy the sprite
    objectHit.destroy();
    // if(this.player.body.touching.right) {
      //can add other functionality here for extra obstacles later
    // }
  },

  gameOver: function() {
    this.game.state.start('Game');
  },

  playerJump: function() {
     //rotate sprite when in the air
     this.player.angle = -25;
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if(this.player.body.touching.down) {
      this.player.body.velocity.y -= 700;
    }    

   
  },

  render: function()
    {
    // if (this.cherry) this.game.debug.spriteBounds(this.cherry)
    // if (this.cherry) this.game.debug.spriteInfo(this.cherry, 0, 100)

    // this.game.debug.spriteBounds(this.player)
    // this.game.debug.spriteInfo(this.player, 500, 100)
        //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");   
    }
};