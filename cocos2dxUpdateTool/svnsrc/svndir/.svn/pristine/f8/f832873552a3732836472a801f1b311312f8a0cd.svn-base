var FightTest = cc.Sprite.extend({
    ctor: function (map) {
        this._super();
        this.addChild(this.player = new Enemy());
        this.addChild(this.aim = new Enemy());
        this.setPosition(300, 300);
        //this.shootArrow(100,100);
    },
    touch: function (touch, event) {
        var pos = touch.getLocation();
        var tx = Math.floor(pos.x);
        var ty = Math.floor(pos.y);
        this.shootArrow(tx,ty);
    },
    player:null,
    aim:null,
    rot:0,
    shootArrow: function (x, y) {
        x = x - this.getPosition().x;
        y = y - this.getPosition().y;
        this.aim.setPosition(x,y);
        var angle = Math.atan2(y,x);
        var rot = angle*180/Math.PI;
        this.rot = rot;
        console.log("rot:" + Math.floor(rot));
        //console.log("x:" + Math.floor(x));
        //console.log("y:" + Math.floor(y));
        //this.arrow.setRotation(rot);
        var arrow = new Arrow();
        //console.log("x:" + x + ",y:" + y);
        arrow.fly(0,0,x,y);
        this.addChild(arrow);
        //this.player.setDirection(rot);
        //this.aim.setDirection(rot + 180);
        //console.log("gapx:" + x + ",gapy:" + y + ",angle:" + angle);
    }
});