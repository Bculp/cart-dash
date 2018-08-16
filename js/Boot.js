var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
InfiniteScroller.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'http://localhost:5001/resources/preloader-bar.png');
  },
  create: function() {
    //the game will have a sky blue background
    this.game.stage.backgroundColor = '#0068B3';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    this.scale.setScreenSize(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  
    this.state.start('Preload');
  }
};