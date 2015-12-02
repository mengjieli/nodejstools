var Enemy = cc.Sprite.extend({
    roler: null,
    directions:{
        45:"140000",
        90:"130000",
        135:"120000",
        180:"110000",
        225:"160000",
        270:"150000",
        315:"140000"
    },
    ctor: function () {
        this._super();
        this.addChild(this.roler = new Animation({
            url: "res/fight/120000",
            format: "png",
            start: 0,
            end: 24,
            frameRate: 30,
            x: 0,
            y: 0
        }));
    },
    setDirection: function (rot) {
        rot = (rot + 360)%360;
        this.removeChild(this.roler);
        var dir = Math.floor((rot - 25)/45)*45;
        this.addChild(this.roler = new Animation({
            url: "res/fight/" + this.directions[dir],
            format: "png",
            start: 0,
            end: 24,
            frameRate: 30,
            x: 0,
            y: 0
        }));
    }
});