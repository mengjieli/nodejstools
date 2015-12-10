/*
**免责声明模块 shenwei 2015-9-12
*/
var UserAnnouncingModule = ModuleBase.extend({

    _scene : null,
    _panelBkg : null,
    _panel : null,

    _title : null,
    _head : null,
    _closeBtn : null,
    _contentViewer : null,

    ctor : function()
    {
        this._super();
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/announcingUI.json");
        if(null == this._scene)
        {
            cc.error("UserAnnouncingModule模块加载AnnouncingUI.json失败");
            return;
        }
        this.addChild(this._scene);

        this._panelBkg = this._scene.getChildByName("bkg_panel");

        var node = this._panel.getChildByName("title");
        node.setString(ResMgr.inst().getString("denglu_0"));
        var node = this._panel.getChildByName("head");
        node.setString(ResMgr.inst().getString("denglu_1"));


        AutoResizeUtils.stretch(this._panelBkg, 3, true, 3);
        AutoResizeUtils.resetNode(this._panelBkg);
        this._panelBkg.setVisible(false);
        this._panelBkg.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._panel = this._scene.getChildByName("panel");
        AutoResizeUtils.setCenter(this._panel);
        AutoResizeUtils.resetNode(this._panel);

        this.updateContentPanel();
    },

    updateContentPanel : function()
    {
        if(!this._panel)
        {
            cc.error("获取显示对象失败");
            return;
        }

        CD.uniformChildrenStyle(this._panel, this._panel);

        this._title = this._panel.getChildByName("title");
        this._head = this._panel.getChildByName("title");
        this._contentViewer = this._panel.getChildByName("content_view");
        //TODO:滑动条设置api无法调用成功
        //this._contentViewer.setScrollBarEnabled(true);
        //this._contentViewer.setScrollBarAutoHideEnabled(false);
        this.updateContentViewPanel();

        this._closeBtn = this._panel.getChildByName("close_btn");
        this._closeBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);
    },

    updateContentViewPanel : function()
    {
        var childs = this._contentViewer.getChildren();
        for(var i = 0; i < childs.length; ++i)
        {
            NodeUtils.setFontName(childs[i]);
        }
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
        if(type == ccui.Widget.TOUCH_ENDED)
        {
            switch(target)
            {
                case this._panelBkg:
                    //break;//同下
                case this._closeBtn:
                    ModuleMgr.inst().closeModule("UserAnnouncing");
                    break;
                default:
                    break;
            }
        }
    },

    show : function(data)
    {
        if(null != data && undefined != data)
        {
            this._super(data.data, data.openSound);
        }
        else
        {
            this._super(null, true);
        }
    },

    close : function(data)
    {
        if(null != data && undefined != data)
        {
            this._super(data.closeSound);
        }
        else
        {
            this._super(true);
        }
    },

    clean : function()
    {
        NodeUtils.removeUI("res/loadingAndLogining/announcingUI.json");
        this._title = null;
        this._head = null;
        this._closeBtn = null;
        this._contentViewer = null;
        this._scene = null;
        this._panelBkg = null;
        this._panel = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
    }
});