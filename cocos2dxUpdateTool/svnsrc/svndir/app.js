var HelloWorldLayer = cc.Sprite.extend({
    sprite: null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        console.log("enter HelloWorldLayer");
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        console.log("嗯???");

        var ui = new MainUI();
        console.log("new MainUI complete");
        this.addChild(ui);
        return true;
    }
});

