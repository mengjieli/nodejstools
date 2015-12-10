/**
 * Created by cgMu on 2015/11/12.
 */

var ChangeNameLayer = cc.Node.extend({
    _nicknameInput:null,
    _isValidNickname:false,

    ctor: function () {
        this._super();

        var colorbg = new cc.LayerColor(cc.color(0, 0, 0, 255*0.8));
        this.addChild(colorbg);

        var root = ccs.load("res/images/ui/HeadModule/ChangeNameLayer.json","res/images/ui/").node;
        this.addChild(root);

        var size = cc.director.getVisibleSize();
        root.setContentSize(size);
        ccui.helper.doLayout(root);

        var Panel_1 = root.getChildByName("Panel_1");
        this.sizeAutoLayout(Panel_1);
        this.posAutoLayout(Panel_1,0.5);

        var closeButton = ccui.helper.seekWidgetByName(root, "Button_1");
        closeButton.addTouchEventListener(this.touchCallback,this);

        var title = Panel_1.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);
        title.setString(ResMgr.inst().getString("head_18"));

        var label = Panel_1.getChildByName("Text_2");
        label.ignoreContentAdaptWithSize(true);
        label.setString(ResMgr.inst().getString("head_19"));

        var textField = Panel_1.getChildByName("TextField_1");
        textField.setPlaceHolder(ResMgr.inst().getString("head_21"));
        this._nicknameInput = textField;

        var btn1 = Panel_1.getChildByName("Button_2");
        btn1.addTouchEventListener(this.btnCallback1,this);

        var btntitle = btn1.getChildByName("Text_3");
        btntitle.ignoreContentAdaptWithSize(true);
        btntitle.setString(ResMgr.inst().getString("head_20"));

        var btn2 = Panel_1.getChildByName("Button_2_0");
        btn2.addTouchEventListener(this.btnCallback2,this);

        var btntitle2 = btn2.getChildByName("Text_3");
        btntitle2.ignoreContentAdaptWithSize(true);
        btntitle2.setString(ResMgr.inst().getString("head_12"));

    },

    touchCallback: function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.removeFromParent(true);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    btnCallback1: function (sender, type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            var nickname = this._nicknameInput.getString();
            cc.log("@new name ",nickname);
            if(this.isValidNickname()) {
                this.sendChangeNameNetMessage(nickname);
                this.removeFromParent(true);
            }
            else {
                cc.error("名字非法");
                ModuleMgr.inst().openModule("AlertPanel",{"txt":ResMgr.inst().getString("denglu_51"),"type":2})
            }
        }
    },

    btnCallback2: function (sender, type) {
        if(type == ccui.Widget.TOUCH_ENDED) {
            this.removeFromParent(true);
        }
    },

    //大小适配
    sizeAutoLayout:function(node,scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var size = node.getContentSize();
        size.height += down*scale;
        node.setContentSize( size );
    },
    //坐标适配
    posAutoLayout: function (node, scale) {
        scale = scale ? scale:1;
        var down = GameMgr.inst().frameSize.height - GameMgr.inst().scaleViewSize.height;
        down = down * (1/GameMgr.inst().scaleX);
        var posY = node.getPositionY();
        posY += down*scale;
        node.setPositionY( posY );
    },

    sendChangeNameNetMessage: function (name) {
        var msg = new SocketBytes();
        msg.writeUint(202);//设定昵称
        msg.writeString(name);
        NetMgr.inst().send(msg);
    },

    isValidNickname : function()
    {
        if(this._isValidNickname) return true;

        var input = this._nicknameInput.getString();
        var ret = CD.validNameByRule(input);
        if(1 != ret)
        {
            this._isValidNickname = false;
        }
        else
        {
            this._isValidNickname = true;
        }

        return this._isValidNickname;
    }
});