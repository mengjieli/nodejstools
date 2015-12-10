/**
 * Created by yx on 2015/10/26/0026.
 */

var CastleModule = ModuleBase.extend({

    _castleData:null,//data数据
    _arrBlock:null,//地块数组

    _bgLayer:null,//远景底图
    _bottomLayer:null,//近景底图
    _buildingLayer:null,//建筑物层
    _effectLayer:null,//特效层
    _testLayer:null,//测试按钮层

    _cameraPos: null,        //背景图摄像机坐标
    _cameraPos2: null,        //远景背景图摄像机坐标
    _cameraPosInit2: null,        //远景背景图初始点摄像机坐标

    _scaleValue:null,//缩放倍率
    _selectBlock:null,//选中的地块建筑

    _isTest:false,//测试用true
    _arrTest:[1906001,1907001,1903001,1913001,1913002,1901001,1909001],//这些建筑以外的建筑点击未开放
    _arrTest2:[1,6,7,8,17],//初始建筑///
    _arrTest3:[1915001,1911001,1910001,1912001,1909001],//初始建筑///


    ctor: function ()
    {
        this._super();
    },

    initUI: function ()
    {
        cc.log("主城堡initUI 初始化")
        this.scale=this._scaleValue=1;
        //EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_RESOURCE);
        //建筑物地块数据  修改
        this._castleData = ModuleMgr.inst().getData("CastleModule");

        EventMgr.inst().addEventListener(CastleEvent.MOVETO_BUILDING, this.moveToBuilding, this);//屏幕锁定到建筑坐标
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);//1903001学院
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_TECH, this.netUpdateTech, this);
        EventMgr.inst().addEventListener(CastleEvent.TECH_UPGRADE_COMPLETE, this.netTechUpgradeComplete, this);
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_BLOCK_TIME, this.netUpdateTime, this);
        EventMgr.inst().addEventListener(CastleEvent.UPDATE_BUILDING, this.netUpdateBuilding, this);
        EventMgr.inst().addEventListener(CastleEvent.UPGRADE_COMPLETE, this.netUpgradeComplete, this);

        EventMgr.inst().addEventListener(CastleEvent.NET_COMPLETE, this.netComplete, this);//请求成功返回

        //150B80D2-5A50-0009-DE4C-30748E7EC20F
        //150B80E7-2950-0009-DEB0-93B673677553
        //150B80EB-B720-0009-DEB9-FF9AAE0DB2CC


        //cc.eventManager.addListener(
        //    {
        //        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //        swallowTouches: true,
        //        onTouchBegan: this.onTouchBegan.bind(this),
        //        onTouchMoved: this.onTouchMoved.bind(this),
        //        onTouchEnded: this.onTouchEnded.bind(this)
        //    },
        //    this);
        cc.eventManager.addListener(//和单点有冲突
            {
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                swallowTouches: true,
                onTouchesBegan: this.onTouchBegan.bind(this),//onTouchesBegan
                onTouchesMoved: this.onTouchMoved.bind(this),//onTouchesMoved
                onTouchesEnded: this.onTouchEnded.bind(this)//onTouchesEnded
            },
            this);


        this._isMove=false;

        this._bgLayer = new cc.Layer();
        this.addChild(this._bgLayer);

        this._bottomLayer = new cc.Layer();
        this.addChild(this._bottomLayer);

        this._buildingLayer = new cc.Layer();
        this.addChild(this._buildingLayer);

        //测试层
        if(this._isTest){

            this._testLayer = new cc.Layer();
            this.addChild(this._testLayer);
            for(var i=0;i<4;i++){
                var touchArea= new ccui.Layout();
                touchArea.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                touchArea.setContentSize( cc.size(30,20) );
                touchArea.setBackGroundColor(cc.color(100,100,100,255));
                touchArea.index=i;
                touchArea.setTouchEnabled(true);
                touchArea.addTouchEventListener(this.onTestTouch,this);
                this._testLayer.addChild(touchArea);
                touchArea.setPosition(cc.p(35*i,40));
            }
        }


        //摄像机显示部分
        this.moveToPos(500, 500);//750

        //背景部分
        this.showMap();

    },


    show:function( data )
    {
        //ModuleMgr.inst().openModule("ChatModule");

        cc.log(" 主城堡一级地图打开  show------------"+this._castleData._currentCastleId);
        this.showBlock();
        //cc.log("城堡发送请求信息 城堡id"+this._castleData._currentCastleId);
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_CASTLE);
        msg.writeString(this._castleData._currentCastleId);
        NetMgr.inst().send(msg);
        UIData.getInstance().showCastleComplete();
        //特殊处理
        //this.setLayerPos(this._cameraPos);
        //this.setBgLayerPos(this._cameraPos2);

    },
    //背景 远景近景 显示
    showMap:function()
    {
        //var img=new ccui.ImageView(MapModule.bottomPath+id+".png");
        for(var i=0;i<CastleModule.COLUMN;i++){
            var urlbg="castle/castlebg_" + 0+"_"+i + ".png";
            var imgbg=new ccui.ImageView();
            imgbg.ignoreContentAdaptWithSize(false);
            imgbg.loadTexture(urlbg,ccui.Widget.PLIST_TEXTURE);
            imgbg.anchorX=imgbg.anchorY=0;
            var sizebg = imgbg.getContentSize();
            sizebg.width =CastleModule.GRID_WIDTH+1;//0.5
            sizebg.height =CastleModule.BG_GRID_HEIGHT+1;//0.5
            imgbg.setSize(sizebg);
            imgbg.x=i*CastleModule.GRID_WIDTH;
            imgbg.y=CastleModule.ROW*CastleModule.GRID_HEIGHT-CastleModule.BG_GRID_HEIGHT;//-CastleModule.BG_GRID_HEIGHT/2

            this._bgLayer.addChild(imgbg);
        }

        for(var i=0;i< CastleModule.ROW;i++) {
            for (var j = 0; j < CastleModule.COLUMN; j++) {
                var url="castle/castle_" + i+"_"+j + ".png";
                var img=new ccui.ImageView();
                img.ignoreContentAdaptWithSize(false);
                img.loadTexture(url,ccui.Widget.PLIST_TEXTURE);
                img.anchorX=img.anchorY=0;
                var size = img.getContentSize();
                size.width =CastleModule.GRID_WIDTH+0.5;
                size.height =CastleModule.GRID_HEIGHT+0.5;
                img.setSize(size);
                img.x=j*CastleModule.GRID_WIDTH;
                img.y=i*CastleModule.GRID_HEIGHT;
                this._bottomLayer.addChild(img);
                //cc.log( size.width +"w h" + size.height)
                //cc.log(img.x+"xy"+img.y)

            }
        }
    },

    //地块 建筑显示部分 默认建筑
    showBlock:function()
    {
        //cc.log("show block"+this._castleData.getNetBlock(null));
        if(this._arrBlock==null) this._arrBlock={};
        for (var i in this._castleData.getNetBlock(null)){
            //cc.log("showBlock初始化地块",this._castleData.getNetBlock(null)[i])
            var blockBean=new CastleBlockBeanCSV(this._castleData._arrBlockBean[i]._data);
            //if(blockBean._index>19) continue;//超过19暂时屏蔽
            var url="castle/" + blockBean._res;
            var img=new Castle_Block();
            img._blockBean=blockBean;
            img.initTouchArea();
            if(blockBean._res==0||blockBean._res==""){
            }
            else {
                img.initBlock(url,blockBean._index);
                //cc.log(url+"####################showBlock"+blockBean._index)
            };
            img.x=blockBean._x;
            img.y=blockBean._y;
            this._buildingLayer.addChild(img);
            img._touchArea.addTouchEventListener(this.onBlockTouch,this);

            //img.setTouchEnabled(true);
            //img.setPropagateTouchEvents(true);
            //img.addTouchEventListener(this.onBlockTouch,this);
            this._arrBlock[blockBean._index]=img;

            //================特殊处理 默认创建某些特殊建筑==================
            if(this._arrTest2.indexOf(Number(blockBean._index))!=-1){
                this._arrBlock[blockBean._index].createBuilding(this._arrTest3[this._arrTest2.indexOf(Number(blockBean._index))]);
                this._arrBlock[blockBean._index].updateBuilding(this._castleData.getNetBlock(null)[i]);
            }

        }
        //暂时特殊处理 显示无地块的建筑
    },
    //屏幕显示到制定位置
    moveToPos:function(x,y){
        this._cameraPos=cc.p(x,y);
        this._cameraPos2=cc.p(x,y);
        var size = cc.director.getVisibleSize();
        var limith=CastleModule.GRID_HEIGHT*CastleModule.ROW*this._scaleValue-size.height;//缩放倍率
        this._cameraPos2.y=limith-(limith-this._cameraPos2.y)/CastleModule.MOVE_SPEED;
        //this._cameraPos2.y=this._cameraPos2.y+(limith-CastleModule.BG_GRID_HEIGHT-this._cameraPos2.y)/CastleModule.MOVE_SPEED;
        this._cameraPosInit2=cc.p(this._cameraPos.x, this._cameraPos.y);
        this.setCameraPos(this._cameraPos,this._cameraPos2);
    },
    //移屏设置屏幕窗口坐标
    setCameraPos:function(pos,pos2)
    {
        var size = cc.director.getVisibleSize();
        //this._scaleValue
        var limitw=CastleModule.GRID_WIDTH*CastleModule.COLUMN*this._scaleValue-size.width;//缩放倍率
        var limith=CastleModule.GRID_HEIGHT*CastleModule.ROW*this._scaleValue-size.height;//缩放倍率

        if(pos.x<0) pos.x=0;
        else if(pos.x>limitw)  pos.x=limitw;
        if(pos.y<0) pos.y=0;
        else if(pos.y>limith)  pos.y=limith;

        //if(pos2.x<(this._cameraPosInit2.x)/CastleModule.MOVE_SPEED) pos2.x=(this._cameraPosInit2.x)/CastleModule.MOVE_SPEED;
        if(pos2.x<this._cameraPosInit2.x-(this._cameraPosInit2.x)/CastleModule.MOVE_SPEED) pos2.x=this._cameraPosInit2.x-(this._cameraPosInit2.x)/CastleModule.MOVE_SPEED;
        else if(pos2.x>this._cameraPosInit2.x+(limitw-this._cameraPosInit2.x)/CastleModule.MOVE_SPEED)  pos2.x=this._cameraPosInit2.x+(limitw-this._cameraPosInit2.x)/CastleModule.MOVE_SPEED;
        cc.log(pos2.y+"!!!!!!!!!!!!!!!!pos2.y@@@@@@@@@@@@@@"+limith+"hhhh"+(limith-CastleModule.BG_GRID_HEIGHT));
        //if(pos2.y<(limith-(limith-CastleModule.BG_GRID_HEIGHT)/CastleModule.MOVE_SPEED)) pos2.y=limith-(limith-CastleModule.BG_GRID_HEIGHT)/CastleModule.MOVE_SPEED;
        if(pos2.y<(limith-(limith-CastleModule.BG_GRID_HEIGHT)/CastleModule.MOVE_SPEED)) pos2.y=limith-(limith-CastleModule.BG_GRID_HEIGHT)/CastleModule.MOVE_SPEED;
        else if(pos2.y>limith)  pos2.y=limith;//CastleModule.MOVE_SPEED
        //cc.log(limith+"limith########"+pos2.y+"###"+(limith-CastleModule.BG_GRID_HEIGHT) );//-(limith-this._cameraPosInit2.y)/CastleModule.MOVE_SPEED)
        this._cameraPos=pos;
        this._cameraPos2=pos2;
        cc.log(pos2.y+"pos2.y@@@@@@@@@@@@@@");
        this.setLayerPos(pos);
        this.setBgLayerPos(pos2);


        if(this._selectBlock!=null)   {
            //cc.log("this._selectBlock null@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            this._castleData._movePos=cc.p(this._selectBlock.x-this._cameraPos.x,this._selectBlock.y-this._cameraPos.y);
            EventMgr.inst().dispatchEvent( CastleEvent.MOVE_SCREEN,cc.p(this._selectBlock.x-this._cameraPos.x,this._selectBlock.y-this._cameraPos.y));
        }

    },
    //锁定到建筑事件
    moveToBuilding:function(type,buildingId){
        var size = cc.director.getVisibleSize();
        var block=this.getBlockByBuildingId(buildingId);
        cc.log(type+"收到锁定到建筑"+buildingId+"xxx"+block.x+"YYYY"+block.y);
        //CastleModule.GRID_HEIGHT*CastleModule.ROW
        this.moveToPos(block.x-size.width/2,block.y-size.height/2);
    },
    //屏幕锁定位置 设置坐标
    setLayerPos:function(pos)
    {
        //cc.log(pos.x+"XposY"+pos.y);
        //this._bgLayer.x=-pos.x;
        this._bottomLayer.x=this._buildingLayer.x=-pos.x;
        this._bottomLayer.y=this._buildingLayer.y=-pos.y;
    },
    setBgLayerPos:function(pos)
    {
        this._bgLayer.x=-pos.x;
        this._bgLayer.y=-pos.y;
    },
    //根据建筑id获取castle_block地块建筑
    getBlockByBuildingId:function(buildingId){
        var block=null;
        for(var i in this._arrBlock){
            if((this._arrBlock[i])._buildingId==buildingId){//学院科技倒计时
                block=this._arrBlock[i];
                break;
            }
        }
        return block;
    },

    //-------------------------------------事件
    //触摸点击事件
    _touchPos:null,//多点触摸对象
    _touchPosDis:null,//多点触摸原始距离
    _beganPos: null,
    _movedPos: null,
    _movedPos2: null,
    _isMove:null,//用于判断大于30像素点击地块也拖动
    onTouchBegan: function (touch, event)
    {
        //cc.log(touch.length);
        //cc.log(touch[0].getID());
        if(this._touchPos==null) this._touchPos={};
        //for(var i in this._touchPos){
        //    cc.log("key:::"+i);
        //}

        var touch=touch[0];
        this._touchPos[touch.getID()]=touch.getLocation();
        if(this._touchPos[0]!=undefined&&this._touchPos[1]!=undefined){
            this._touchPosDis=MathUtils.twoPointsDistance(this._touchPos[0],this._touchPos[1]);
        }
        //cc.log(this._touchPos[0]+"touch 0  1"+this._touchPos[1]);
        //cc.log("场景onTouchBegan"+touch.getLocation().x+"xy"+touch.getLocation().y);
        //this._beganPos = touch.getLocation();
        //this._movedPos = this._beganPos;
        this.doTouchBegan(touch.getLocation());
        return true;
    },

    doTouchBegan:function(pos){
        this._isMove=false;//置false
        this._beganPos = pos;
        this._movedPos = this._beganPos;

        //cc.log("doTouchBegan"+pos.x);
    },

    onTouchMoved: function (touch, event)
    {
        var touch=touch[0];
        var startPos = this._touchPos[touch.getID()];
        var endPos = touch.getLocation();
        this._touchPos[touch.getID()]=touch.getLocation();
        if(this._touchPos[0]!=undefined&&this._touchPos[1]!=undefined){//进入缩放逻辑
            if ((Math.abs(startPos.x - endPos.x) > 30 || Math.abs(startPos.y - endPos.y) > 30)) {
                var dis=MathUtils.twoPointsDistance(this._touchPos[0],this._touchPos[1]);
                var scaleValue=dis/this._touchPosDis;
                if(scaleValue<0.4) scaleValue=0.4;
                if(scaleValue>1.6) scaleValue=1.6;
                this._scaleValue=scaleValue;
                this.scale=scaleValue;
            }
            return;
        }
        this.doTouchMoved(touch.getLocation());
    },

    doTouchMoved:function(pos){

        var startPos = this._beganPos;
        var endPos = pos;
        //cc.log(startPos.x+"doTouchMoved"+endPos.x);
        //触摸范围大于30
        if ((Math.abs(startPos.x - endPos.x) > 30 || Math.abs(startPos.y - endPos.y) > 30))
        {
            //cc.log("超过30像素"+this._isMove);
            this._isMove=true;
            var offset = MathUtils.pointSubtract(this._movedPos, endPos);
            var cameraP = MathUtils.pointAdd(this._cameraPos, offset);
            //pos2
            var offx=(endPos.x-startPos.x)/CastleModule.MOVE_SPEED;
            var offy=(endPos.y-startPos.y)/CastleModule.MOVE_SPEED;
            //var endPos2 = new cc.p(endPos.x+offx,endPos.y+offy);
            var endPos2 = new cc.p(startPos.x+offx,startPos.y+offy);//endPos
            var offset2 = new cc.p(offset.x/CastleModule.MOVE_SPEED, offset.y/CastleModule.MOVE_SPEED);
            var cameraP2 = MathUtils.pointAdd(this._cameraPos2, offset2);
            this.setCameraPos(cameraP,cameraP2);
            //cc.log("//触摸范围大于30")
        }
        this._movedPos = endPos;
        this._movedPos2 = endPos2;
    },

    onTouchEnded: function (touch, event)
    {
        var touch=touch[0];
        if(this._touchPos[touch.getID()])   delete this._touchPos[touch.getID()];//删除触摸点
        if(this.scale<0.5) this.scale=0.5;
        if(this.scale>1.5) this.scale=1.5;
        if(this._isMove==true) return;
        for(var i in this._arrBlock){
            this._arrBlock[i].showBuildingName(false);
        }
        ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
        ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null,objectpos:null,objectstate:null});
    },

    onBlockTouch: function (target,type) {
        //cc.log("子对象onTouch"+type);
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                //cc.log(target.getTouchBeganPosition().x+"《《，target.getTouchEndPosition().x")
                this.doTouchBegan(target.getTouchBeganPosition());
                break;
            case ccui.Widget.TOUCH_MOVED:
                //cc.log(target.getTouchMovePosition().x+"《《，TOUCH_MOVED");
                this.doTouchMoved(target.getTouchMovePosition());
                break;
            case ccui.Widget.TOUCH_ENDED:
                if(this._isMove==true) break;
                if(this._selectBlock!=null) this._selectBlock.showBuildingName(false);
                this._selectBlock=target.getParent();
                var p=new cc.p(target.getParent().x-this._cameraPos.x,target.getParent().y-this._cameraPos.y);
                //this._castleData._movePos=p;//保存移动坐标
                //cc.log("testlog$$$$$$$$$$$$$move##################################################################")
                if(target.getParent()._buildingImg!=null){//有建筑
                    this._selectBlock.showBuildingName(true);
                    ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});

                    if(this._arrTest.indexOf(Number(target.getParent()._buildingId))==-1){
                        ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("castle_1"),color:null,time:null,pos:target.getTouchBeganPosition()});
                        //ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:null});
                        ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null,objectpos:null,objectstate:null});
                        //return;
                    }
                    else {
                        this._castleData._movePos=p;//保存移动坐标
                        ModuleMgr.inst().openModule("BuildingUIModule",{objectid:target.getParent()._buildingId,
                            objectpos:p,objectstate:null,
                            objectindex:target.getParent()._blockBean._index});
                    }

                }
                else {
                    if (target.getParent()._blockBean._building_id!=0) {
                        this._castleData._movePos=p;//保存移动坐标
                    }
                    ModuleMgr.inst().openModule("BuildingUIModule",{objectid:null,objectpos:p,objectstate:null});
                    ModuleMgr.inst().openModule("CreateBuildingUIModule",{objectid:target.getParent()._blockBean._index,objectpos:p})
                }

                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    onTestTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(target.index+"onTestTouch测试按钮")
                switch (target.index){
                    case 0:
                        //cc.log("测试拆建筑");
                        //EventMgr.inst().dispatchEvent( CastleEvent.REMOVE_SUCCESS,11);
                        //cc.log("test 发送测试 道具")
                        //var msg = new SocketBytes();
                        //msg.writeUint(500);
                        //NetMgr.inst().send(msg);
                        break;
                    case 1:
                        //EventMgr.inst().dispatchEvent( CastleEvent.SPEED_SUCCESS,11);
                        //ModuleMgr.inst().openModule("CitadelResourceModule");//测试打开城堡资源显示
                        break;
                    case 2:
                        //EventMgr.inst().dispatchEvent( CastleEvent.CANCEL_SUCCESS,11);


                        break;
                    case 3:

                        break;

                }


                break;
        }
    },

    //通讯部分-------------
    isTest:true,//是否是测试数据

    //更新学院科技倒计时
    netUpdateTechTime:function(type, netTech){
        //cc.log(netTech+"1netUpdateTechTime");
        var techNet = new CastleTechBeanNet(netTech._data);
        for(var i in this._arrBlock){
            if((this._arrBlock[i])._buildingId==1903001){//学院科技倒计时
                this._arrBlock[i].updateBuildingTime(techNet,true);
                break;
            }
        }
    },
    //更新学院科技状态
    netUpdateTech:function(type, arr){
        //cc.log(arr+"netUpdateTech");
        var techNet = new CastleTechBeanNet(arr);
        for(var i in this._arrBlock){
            if((this._arrBlock[i])._buildingId==1903001){//学院科技倒计时
                this._arrBlock[i].updateTech(techNet);
                break;
            }
        }
    },
    //学院科技升级完成
    netTechUpgradeComplete:function(type, netTech){
        var techNet = new CastleTechBeanNet(netTech._data);
        for(var i in this._arrBlock){
            if((this._arrBlock[i])._buildingId==1903001){//学院科技倒计时
                this._arrBlock[i].upgradeTechComplete();
                break;
            }
        }
    },
    //更新建筑倒计时
    netUpdateTime:function(type, netblock){
        var blockNet = new CastleBlockBeanNet(netblock._data);
        //cc.log(blockNet._state_remain+"#######stateTime"+blockNet._index+"###"+blockNet._building_id);
        this._arrBlock[blockNet._index].updateBuildingTime(blockNet);
    },
    //更新建筑状态
    netUpdateBuilding:function(type, arr){
        cc.log(arr+"收到更新建筑地块事件   目测有各种蛋疼的状态判断 index  blockid"+arr[1]+"@@建筑id"+arr[2]+"@@等级"+arr[3]+"@@状态"+arr[4]+"@@4"+arr[5]+"@@"+arr[6]+"@@6");
        var blockNet=new CastleBlockBeanNet(arr);
        if(blockNet._building_id==0){
            if(this._arrBlock[blockNet._index]._buildingId!=null){
                cc.log("拆除建筑");
                this._arrBlock[blockNet._index].removeBuilding();
            }
            else{
                cc.log("空地块逻辑");
            }
        }
        else{
            //cc.log(this._arrBlock+"this._arrBlock$$$$$$$$$$$$$$$$$$")
            //for(var i in this._arrBlock){
            //    cc.log(blockNet._index+"ceshi:arrBlock"+i);
            //}
            if(this._arrBlock[blockNet._index]._buildingId==null){
                cc.log("无建筑 造一个建筑");
                this._arrBlock[blockNet._index].createBuilding(blockNet._building_id,blockNet._index);

            }
            cc.log("更新建筑状态等信息");
            this._arrBlock[blockNet._index].updateBuilding(blockNet);
        }
    },
    //升级成功处理
    netUpgradeComplete:function(type, index){
        this._arrBlock[index].upgradeComplete();
    },
    //
    netComplete:function(type, index){
        if(index==CastleNetEvent.SEND_BUILD){

        }

    },
    //清除方法
    destroy:function() {

        this._cameraPos = null;
        this._cameraPos2 = null;
        this._cameraPosInit2 = null;
        this._selectBlock = null;

        for (var i in this._arrBlock) {
            if(this._arrBlock[i]) {
                //this._arrBlock[i]._touchArea.removeTouchEventListener(this.onBlockTouch,this);
                this._arrBlock[i].destroy();
                this._arrBlock[i].removeFromParent();
                this._arrBlock[i]=null;
            }
        }
        this._arrBlock=null;
        this._buildingLayer=null;

        this._bgLayer.removeAllChildren();
        this._bgLayer.removeFromParent();
        this._bgLayer=null;

        this._bottomLayer.removeAllChildren();
        this._bottomLayer.removeFromParent();
        this._bottomLayer=null;

        //this._effectLayer.removeAllChildren();
        //this._effectLayer.removeFromParent();
        //this._effectLayer=null;

        if(this._testLayer) {
            this._testLayer.removeAllChildren();
            this._testLayer.removeFromParent();
            this._testLayer=null;
        }

        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_TECH_TIME, this.netUpdateTechTime, this);//1903001学院
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_TECH, this.netUpdateTech, this);
        EventMgr.inst().removeEventListener(CastleEvent.TECH_UPGRADE_COMPLETE, this.netTechUpgradeComplete, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_BLOCK_TIME, this.netUpdateTime, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPDATE_BUILDING, this.netUpdateBuilding, this);
        EventMgr.inst().removeEventListener(CastleEvent.UPGRADE_COMPLETE, this.netUpgradeComplete, this);
        EventMgr.inst().removeEventListener(CastleEvent.NET_COMPLETE, this.netComplete, this);//请求成功返回

        if(this._castleData)    {
            this._castleData.clear();
            this._castleData = null;
        }
    }

});

//静态属性
CastleModule.ROW=4;
CastleModule.COLUMN=6;
CastleModule.GRID_WIDTH=400;
CastleModule.GRID_HEIGHT=375;//400
CastleModule.BG_GRID_HEIGHT=348;

CastleModule.MOVE_SPEED=12;//默认8分之一