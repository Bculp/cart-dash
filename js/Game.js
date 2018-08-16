var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {

    // |-- Set up background and ground layer --|
    this.game.world.setBounds(0, 0, 3500, this.game.height);

    // |-- Game height is 420. Game width is 746. --|
    // |-- Create the fruit sprites and position them --|
    this.cherry = this.game.add.sprite(this.game.width - 10, this.game.height - 330, 'cherry');
    this.strawberry = this.game.add.sprite(this.game.width + 1000, this.game.height - 230, 'strawberry');
    this.pear = this.game.add.sprite(this.game.width + 500, this.game.height - 270, 'pear');
    this.ground = this.add.tileSprite(0,this.game.height-70,this.game.world.width,70,'ground');
    
    // |-- Scale the sprites down to a much better size --|
    this.cherry.scale.setTo(0.5, 0.5);
    this.strawberry.scale.setTo(0.5, 0.5);
    this.pear.scale.setTo(0.3, 0.3);

    
    // |-- Create & scale player --|
    this.player = this.game.add.sprite(this.game.width/4, this.game.height-90, 'cart');
    this.player.scale.setTo(.20,.20)
    
    // |-- Reset order of sprites (if have layered sprites) --|
    this.game.world.bringToTop(this.ground);

    // |-- Enable physics on the player and ground --|
    this.game.physics.arcade.enable(this.cherry);
    this.game.physics.arcade.enable(this.strawberry);
    this.game.physics.arcade.enable(this.pear);
    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.ground);

    // |-- Player gravity --|
    this.player.body.gravity.y = 1000;
    
    // |-- So player can walk on ground --|
    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    
    // |-- The camera will follow the player in the world --|
    this.game.camera.follow(this.player);
    
    // ...or by swiping
    // this.swipe = this.game.input.activePointer;

    // |-- Set some variables we need throughout the game --|
    this.wraps = 0;
    this.points = 0;
    this.wrapping = true;
    

    // |-- Add spacebar as valid key --|
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    // |-- Display points --|
    var style1 = { font: "20px Arial", fill: "#FFF"};
    var t1 = this.game.add.text(this.game.width - 110, this.game.height - 400, "Points:", style1);
    t1.fixedToCamera = true;
    this.pointsText = this.game.add.text(this.game.width - 30, this.game.height - 400, '', style1);
    this.pointsText.fixedToCamera = true;
    this.refreshPoints();
  },
  
  update: function() {
    // |-- Collision detection --|
    this.game.physics.arcade.collide(this.player, this.ground, () => {}, null, this);
    this.game.physics.arcade.collide(this.player, this.cherry, () => this.playerHit(this.cherry), null, this);
    this.game.physics.arcade.collide(this.player, this.strawberry, () => this.playerHit(this.strawberry), null, this);
    this.game.physics.arcade.collide(this.player, this.pear, () => this.playerHit(this.pear), null, this);

    
    // |-- Only respond to keys and keep the speed if the player is alive --|
    if(this.player.alive) {
      
      this.player.body.velocity.x = 300;

      // |-- We do a little math to determine whether the game world has wrapped around. --|
      // |-- If so, we want to destroy everything and regenerate, so the game will remain random --|
      if(!this.wrapping && this.player.x < this.game.width) {
        // |-- Not used yet, but may be useful to know how many times we've wrapped --|
        this.wraps++;
        
        // |-- We only want to destroy and regenerate once per wrap, so we test with wrapping var --|
        this.wrapping = true;
        
        // |-- Put everything back in the proper order --|
        this.game.world.bringToTop(this.ground);
      }
      else if(this.player.x >= this.game.width) {
        this.wrapping = false;
      }

      // \-- Reset the player's angle when they land on the ground --|
      if (this.player.body.velocity.y === 0){
        this.player.angle = 0;
      }

      if (this.spaceBar.isDown) {
        this.playerJump()
      }

      /* 
       |-- The game world is infinite in the x-direction, so we wrap around.
              We subtract padding so the player will remain in the middle of the screen when
              wrapping, rather than going to the end of the screen first. --|
      */
     // |-- Removing this will allow the cart to roll off the screen --|
     this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
    }

  },

  // |-- Show updated point values --|
  refreshPoints: function() {
    this.pointsText.text = this.points;
  },
  playerHit: function(objectHit) {
    // TODO: show animation on screen

    // |-- Add points --|
    this.points += 10;
    this.refreshPoints();

    // |-- Destroy the sprite --|
    objectHit.destroy();
  },

  gameOver: function() {
    this.game.state.start('Game');
  },

  playerJump: function() {
     // |-- Rotate sprite when in the air --|
     this.player.angle = -25;
    // |-- When the ground is a sprite, we need to test for "touching" instead of "blocked" --|
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
    }
};