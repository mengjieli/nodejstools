var MapBlock = cc.Sprite.extend({
    info: null,
    type: null,
    draw: 0,
    light: null,
    ctor: function () {
        this._super();
    },
    setInfo: function (info) {
        this.info = info;
        this.setType(info.type);
    },
    getPosX: function () {
        return this.info.x;
    },
    getPosY: function () {
        return this.info.y;
    },
    setType: function (type) {
        if (this.type == type) {
            return;
        }
        this.type = type;
        var draw;
        if (!this.draw) {
            this.draw = new cc.DrawNode();
            this.addChild(this.draw);
            var txt = ccui.Text();
            txt.setString(this.info.x + "," + this.info.y);
            this.addChild(txt);
            txt.setOpacity(200);
        }
        draw = this.draw;
        draw.clear();
        var pts = MapBlock.pts;
        if (this.type == 1608001) {
            draw.drawPoly(pts, cc.color(255, 0, 0, 20), 1, cc.color(0, 0, 0, 10));
        } else {
            draw.drawPoly(pts, cc.color(100, 100, 100, 30), 1, cc.color(0, 0, 0, 10));
        }
    },
    showLight: function (r, g, b, a) {
        if (!this.light) {
            this.light = new cc.DrawNode();
            this.addChild(this.light);
        }
        if(a == 0) {
            this.light.visible = false;
        } else {
            this.light.visible = true;
            this.light.clear();
            var pts = MapBlock.pts;
            this.light.drawPoly(pts, cc.color(r, g, b, a), 1, cc.color(0, 0, 0, 10));
        }
    }
});

MapBlock.pts = [
    cc.p(-MapUtils.width / 2, -MapUtils.len / 2),
    cc.p(0, -MapUtils.len),
    cc.p(MapUtils.width / 2, -MapUtils.len / 2),
    cc.p(MapUtils.width / 2, MapUtils.len / 2),
    cc.p(0, MapUtils.len),
    cc.p(-MapUtils.width / 2, MapUtils.len / 2)
];