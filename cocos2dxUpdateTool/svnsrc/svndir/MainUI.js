var MainUI = cc.Sprite.extend({
    ctor: function () {
        this._super();
        var sp = new cc.Sprite("res/gy_kuang_di_02.png");
        this.addChild(sp);
        sp.setPosition(200, 200);

        var txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0, 0);
        txt.setString("中文");
        txt.setPosition(100, 130);
        txt.setTouchEnabled(true);
        txt.setTag(0);
        txt.setColor({r:255,g:255,b:0,a:255});
        this.addChild(txt);
    }
});