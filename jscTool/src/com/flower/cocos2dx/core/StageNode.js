var flower;
(function (flower) {
    var StageNode = cc.Sprite.extend({
        ctor: function () {
            this._super();
            this.scheduleUpdate();
            //注册鼠标事件
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchesBegan.bind(this),
                onTouchMoved: this.onTouchesMoved.bind(this),
                onTouchEnded: this.onTouchesEnded.bind(this)
            }, this);
        },
        update: function (delate) {
            jc.EnterFrame.update(delate);
        },
        onTouchesBegan: function (touch,event) {
            flower.MouseManager.getInstance().onMouseDown(touch.getID(), Math.floor(touch.getLocation().x), Math.floor(touch.getLocation().y));
            return true;
        },
        onTouchesMoved: function (touch,event) {
            flower.MouseManager.getInstance().onMouseMove(touch.getID(), Math.floor(touch.getLocation().x), Math.floor(touch.getLocation().y));
            return true;
        },
        onTouchesEnded: function (touch,event) {
            flower.MouseManager.getInstance().onMouseUp(touch.getID(), Math.floor(touch.getLocation().x), Math.floor(touch.getLocation().y));
            return true;
        }
    });
    flower.StageNode = StageNode;
})(flower || (flower = {}));
