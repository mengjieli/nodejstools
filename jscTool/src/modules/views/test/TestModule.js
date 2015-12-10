/**
 * Created by Administrator on 2015/10/19.
 */


var TestModule = ModuleBase.extend({

    _ui:null,

    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {

        EventMgr.inst().addEventListener( TestEvent.SEND_TEX_TEVENT, this.textCallBack, this );


        this._ui = ccs.load("res/images/ui/test/testModule.json","res/images/ui/").node;
        this.addChild( this._ui );

        var button = this._ui.getChildByName("Button_1");
        button.addTouchEventListener( this.buttonCallBack, this );

        var button1 = this._ui.getChildByName("Button_2");
        button1.addTouchEventListener( this.buttonDataCallBack, this );

        //适配
        var size = cc.director.getVisibleSize();
        this._ui.setContentSize( size );
        ccui.helper.doLayout( this._ui );
    },

    destroy:function()
    {
        EventMgr.inst().removeEventListener( TestEvent.SEND_TEX_TEVENT, this.textCallBack, this );

    },

    show:function( data )
    {

    },

    close:function()
    {

    },

    buttonCallBack:function( node, eventType )
    {
        if( eventType != ccui.Widget.TOUCH_ENDED ) return;

        var txt = this._ui.getChildByName("Text_1");
        txt.setString("点了按钮");
    },

    buttonDataCallBack:function( node, eventType )
    {
        if( eventType != ccui.Widget.TOUCH_ENDED ) return;

        var testData = ModuleMgr.inst().getData("TestModule");

        if( testData == null )return;

        var str = testData.getStr();

        var txt = this._ui.getChildByName("Text_1");
        txt.setString(str);
    },

    textCallBack:function( eventName, num )
    {


    }


});