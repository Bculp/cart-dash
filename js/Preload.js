var InfiniteScroller = InfiniteScroller || {};

// |-- Loading the game assets --|
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    // |-- Show loading screen --|
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    // |-- Load game assets --|
    this.load.image('cart', 'http://localhost:5001/resources/cart.svg');
    // |-- Add fruit --|
    this.load.image('apple', 'http://localhost:5001/resources/apple.png');
    this.load.image('cherry', 'http://localhost:5001/resources/cherry.png');
    this.load.image('strawberry', 'http://localhost:5001/resources/strawberry.png');
    this.load.image('pear', 'http://localhost:5001/resources/pear.png');

    // |-- Add the floor --|
    this.load.image('ground', 'http://localhost:5001/resources/ground.png');
  },
  create: function() {
    this.state.start('Game');
  }
};