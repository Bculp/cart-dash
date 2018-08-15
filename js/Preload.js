var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    // this.load.spritesheet('dog', 'http://localhost:5001/resources/dog_walk.png', 122, 92, 2);
    this.load.image('cart', 'http://localhost:5001/resources/cart.svg');
    // add fruit
    this.load.spritesheet('fruit', 'http://localhost:5001/resources/fruit.png', 55, 67, 32)
    this.load.image('ground', 'http://localhost:5001/resources/ground.png');
    // this.load.image('grass', 'http://localhost:5001/resources/grassCopy.png');
    
  },
  create: function() {
    this.state.start('Game');
  }
};