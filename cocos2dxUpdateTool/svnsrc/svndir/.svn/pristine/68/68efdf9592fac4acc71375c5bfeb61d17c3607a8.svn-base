var Arrow = cc.Sprite.extend({
    ctor: function () {
        this._super();
        var sp = new cc.Sprite("res/fight/arrow.png");
        this.addChild(sp);
        sp.setPosition(0, -13);
        this.setScale(0.2, 0.2);
        this.scheduleUpdate();
    },
    toX: 0,
    toY: 0,
    x3d: 0,
    y3d: 0,
    z3d: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    maxv: 400,
    gz:1000,
    time:0,
    fly: function (fromX, fromY, toX, toY) {
        this.toX = toX;
        this.toY = toY;
        this.setPosition(fromX, fromY);
        this.x3d = fromX;
        this.y3d = fromY;
        this.z3d = 0;
        var dx = toX - fromX;
        var dy = toY - fromY;
        var angle = Math.atan2(dy,dx);
        var rot = angle*180/Math.PI;
        //console.log((toX-fromX) + "," + (toY-fromY) + "," + Math.sin(angle));
        this.vx = this.maxv * Math.cos(angle);
        this.vy = this.maxv * Math.sin(angle);
        var t = Math.sqrt((dx*dx) + (dy*dy))/this.maxv;
        this.time = t;
        this.vz = this.gz*(t/2);
        this.z3d = 20;
        console.log("disX:" + (toX - fromX) + ",disY:" + (toY - fromY) +
            ",t:" + t + ",vx:" + Math.floor(this.vx) + ",vy:" + Math.floor(this.vy) + ",vz:" + Math.floor(this.vz)
            + "," + Math.floor(angle) + "," + Math.floor(rot));
    },
    update: function (dt) {
        this.time -= dt;
        if(this.time <= 0) {
            this.unscheduleUpdate();
            if(this.getParent()) {
                this.getParent().removeChild(this);
                return;
            }
        }
        this.x3d += this.vx*dt;
        this.y3d += this.vy*dt;
        var svz = this.vz;
        this.vz -= this.gz*dt;
        this.z3d += this.vz*dt;
        //console.log(this.vz + "," + this.z3d);
        this.setPosition(this.x3d,this.y3d + this.z3d);
        this.setRotation(Math.atan2(this.vx,this.vy+this.vz)*180/Math.PI);
    }
});