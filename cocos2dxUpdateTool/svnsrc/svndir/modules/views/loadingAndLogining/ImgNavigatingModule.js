/*
**图片浏览模块 2015-9-21 shenwei
*/
var ImgNavigatingModule = ModuleBase.extend({

    _scene : null,
    _bkgPanel : null,
    _panel : null,

    _title : null,
    _closeBtn : null,

    _filesListView : null,

    //浏览起始目录
    _baseFileDir : null,
    _outputCacheDir : null,
    _currentFileDir : null,

    ctor : function()
    {
        this._super();
        this._baseFileDir = "";
        this._currentFileDir = "";
        this._outputCacheDir = "";
    },

    initUI : function()
    {
        this._super();

        this._scene = NodeUtils.getUI("res/loadingAndLogining/imgNavigatingUI.json");

        if(null == this._scene)
        {
            cc.error("imgNavigatingModule加载imgNavigatingUI.json失败");
            return;
        }

        this.addChild(this._scene);

        this._bkgPanel = this._scene.getChildByName("bkg_panel");
        AutoResizeUtils.stretch(this._bkgPanel, 3, true, 3);
        AutoResizeUtils.resetNode(this._bkgPanel);
        this._bkgPanel.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._panel = this._scene.getChildByName("panel");
        AutoResizeUtils.setCenter(this._panel);
        AutoResizeUtils.resetNode(this._panel);

        this.updateFileSearchingPanel();

        this._outputCacheDir = SysCall.getCacheDir();
        cc.error("输出目录：" + this._outputCacheDir);

        if("" == this._outputCacheDir)
        {
            var value = ResMgr.inst().getString("denglu_10");
            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
            return;
        }

        this._baseFileDir = SysCall.getPublicPicturePath();
        if("" != this._baseFileDir)
        {
            this.showFileExplorer();
        }
        else
        {
            cc.error("获取目录失败");
            var value = ResMgr.inst().getString("denglu_11");
            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
        }
    },

    cleanListViewContent : function()
    {
        if(!this._filesListView)
        {
            cc.error("获取显示列表对象失败");
            return;
        }

        var lvSz = this._filesListView;
        for(var i = lvSz - 1; i >= 1; ++i)
        {
            this._filesListView.removeItem(i);
        }
        this._filesListView.getItem(0).setVisible(false);
    },

    //设置显示内容:此处为文本框
    addCustomListViewItem : function(index, data, type)
    {
        var item = (0 == index) ? this._filesListView.getItem(0) : this._filesListView.getItem(0).clone();
        item.setString(data);
        item.attr({"type":type});
        item.setVisible(true);
        item.setTouchEnabled(true);
        if(0 != index)
        {
            this._filesListView.pushBackCustomItem(item);
        }
    },

    showFileExplorer : function()
    {
        this.cleanListViewContent();

        var fileList = SysCall.openFileDialog(this._baseFileDir);
        if("" == fileList)
        {
            cc.error("获取目录失败");
            var value = ResMgr.inst().getString("denglu_12");
            ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2});
        }
        else
        {
            var files = fileList.split(":");
            for(var i = 0; i < files.length - 1; ++i)
            {
                cc.error("目录文件:" + files[i]);
                var searchId = files[i].lastIndexOf(".");
                var typeDesc = (-1 == searchId) ? "directory" : "file";
                this.addCustomListViewItem(i, files[i], typeDesc);
            }
        }
    },

    updateFileSearchingPanel : function()
    {
        if(!this._panel)
        {
            cc.error("获取显示对象失败");
            return;
        }

        CD.uniformChildrenStyle(this._panel, this._panel);

        this._title = this._panel.getChildByName("title");
        this._title.setContentSize(cc.size(448, 28));

        this._closeBtn = this._panel.getChildByName("close_btn");
        this._closeBtn.addTouchEventListener(this.onCommonBtnEvtDispatcher, this);

        this._filesListView = this._panel.getChildByName("items_view");
        this._filesListView.attr({"owner":this});
        this._filesListView.addCCSEventListener(this.onListViewBtnEvtDispatcher);
    },

    onListViewBtnEvtDispatcher : function(target, type)
    {
        if(type == ccui.ListView.ON_SELECTED_ITEM_END)
        {
            var index = target.getCurSelectedIndex();
            cc.error("index:" + index.toString());
            var item = target.getItem(index);
            if("file" == item.type)
            {
                var value = ResMgr.inst().getString("denglu_13");
                ModuleMgr.inst().openModule("AlertPanel", {"txt":value, "type":2, "okFun":target.owner.resizeImage, "owner":target.owner, "params":[item.getString()]});
            }
            else if("directory" == item.type)
            {
                cc.error("选择目录");
            }
        }
    },

    resizeImage : function(v)
    {
        var fullInPath = this._baseFileDir + "/" + v;
        cc.error("fullInPath:" + fullInPath);
//         var fullOutPath = this._outputCacheDir + "/" + v + (new Date()).getTime().toString();
//         cc.error("fullOutPath:" + fullOutPath);

        var fullOutPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
        fullOutPath += (new Date()).getTime().toString();
        fullOutPath += v;
        cc.error("fullOutPath:" + fullOutPath);
        //var ret = SysCall.genThumbImage(fullInPath, fullOutPath, 173.0, 173.0, false);
        var ret = SysCall.genThumbImageEx(fullInPath, fullOutPath, ImgNavigatingModule.RESIZE_THUMB_WIDTH, ImgNavigatingModule.RESIZE_THUMB_HEIGHT, ImgNavigatingModule.RESIZE_QUALITY_RATIO);
        cc.error("压缩该图片:" + ret);

        if(ret)
        {
            EventMgr.inst().dispatchEvent(EventType.MOD_CUSTOM_PORTRAIT, fullOutPath);
            SelfData.getInstance().userTmpPortraitPath = fullOutPath;
//            var login = ModuleMgr.inst().getModlue("Logining").module;
//            var loge = login._logo.loadTexture(fullOutPath, ccui.Widget.LOCAL_TEXTURE);
        }
    },

    onCommonBtnEvtDispatcher : function(target, type)
    {
        if(type == ccui.Widget.TOUCH_ENDED)
        {
            switch(target)
            {
                case this._bkgPanel:
                    cc.error("this._bkgPanel");
                    ModuleMgr.inst().closeModule("ImgNavigating", {"closeSound":true});
                    break;
                case this._closeBtn:
                    cc.error("this._closeBtn");
                    ModuleMgr.inst().closeModule("ImgNavigating", {"closeSound":true});
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
        NodeUtils.removeUI("res/LoadingAndLogining/imgNavigatingUI.json");

        this._title = null;
        this._closeBtn = null;

        this._filesListView = null;

        //浏览起始目录
        this._baseFileDir = null;
        this._currentFileDir = null;
        this._outputCacheDir = null;

        this._bkgPanel = null;
        this._panel = null;
        this._scene = null;
    },

    destroy : function()
    {
        this._super();
        this.clean();
    },
});
//缩略头像大小
ImgNavigatingModule.RESIZE_THUMB_WIDTH = 173;
ImgNavigatingModule.RESIZE_THUMB_HEIGHT = 173;
//缩略头像压缩质量
ImgNavigatingModule.RESIZE_QUALITY_RATIO = 100;
