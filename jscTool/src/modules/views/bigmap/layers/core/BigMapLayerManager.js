var BigMapLayerManager = cc.Sprite.extend({
    data: null, //BigMapData
    actionData: null,//BigMapActionData
    backgroundLayer: null, //背景层
    shaderLayer: null,//阴影层
    treeLayer: null, //对象层
    gridLayer: null,//格子层
    changeLayer: null,//交换层
    frontLayer: null, //前景层
    moveX: 0,
    moveY: 0,
    ctor: function () {
        this._super();
        this.data = ModuleMgr.inst().getData("BigMapModule");
        this.actionData = this.data.getActionManager();
        this.addChild(this.backgroundLayer = new BackgroundLayer(0, 0, 0, 0, 0));
        this.addChild(this.treeLayer = new BackgroundLayer(1,
            -MapUtils.singleWidth / 4, -MapUtils.singleHeight / 4, MapUtils.singleWidth / 2, MapUtils.singleHeight / 2));
        this.addChild(this.shaderLayer = new cc.Sprite());
        this.addChild(this.gridLayer = new GridLayer());
        this.frontLayer = new FrontLayer();
        this.addChild(this.changeLayer = new ChangeLayer(this.shaderLayer, this.frontLayer));
        this.addChild(this.frontLayer);
    },
    addDisplay: function () {
    },
    /**
     * 显示区域背景
     * @param rect
     */
    updateShow: function (camera) {
        this.moveX = camera.x;
        this.moveY = camera.y;
        this.backgroundLayer.updateShow(camera);
        this.shaderLayer.setPosition(-camera.x, -camera.y);
        this.treeLayer.updateShow(camera);
        this.gridLayer.updateShow(camera);
        this.changeLayer.updateShow(camera);
        this.frontLayer.updateShow(camera);
    },
    onTouchBegan: function (x, y) {
        ModuleMgr.inst().openModule("TileMenuModule", null);//关闭弹框
    },
    dragMap: function () {
        this.changeLayer.dragMap();
    },
    onTouchEnded: function (x, y) {
        this.changeLayer.onTouch(x + this.moveX, y + this.moveY);
        //this.gridLayer.onTouch(x + this.moveX, y + this.moveY);
        //this.backgroundLayer.onTouch(x + this.moveX, y + this.moveY);
    },
    dispose:function(){
        this.changeLayer.dispose();
    }
});