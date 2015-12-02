/**
 * Created by Administrator on 2015/10/27/0027.
 */

//模块间事件
CastleEvent = {};
CastleEvent.MOVETO_BUILDING="castle_moveto_building";//收到视角锁定到建筑事件
CastleEvent.BUILD_SUCCESS = "castle_build_success";//模块间收到 建造事件  发包
CastleEvent.CANCEL_SUCCESS = "castle_cancel_success";//模块间收到 取消当前状态事件 发包
CastleEvent.UPGRADE_SUCCESS = "castle_upgrade_success";//模块间收到 升级建筑事件 发包
CastleEvent.REMOVE_SUCCESS = "castle_remove_success";//模块间收到 拆除建筑事件 发包
CastleEvent.SPEED_SUCCESS = "castle_speed_success";//模块间收到 花钱立即完成当前状态事件 发包
CastleEvent.BLOCK_SUCCESS = "castle_block_success";//模块间收到 请求单个地块建筑信息事件 发包

CastleEvent.TECH_UPGRADE_SUCCESS = "castle_tech_upgrade_success";//模块间收到 科技升级事件 发包
CastleEvent.TECH_CANCEL_SUCCESS = "castle_tech_cancel_success";//模块间收到 取消科技当前状态事件 发包
CastleEvent.TECH_SPEED_SUCCESS = "castle_tech_speed_success";//模块间收到 立即完成科技升级事件 发包
CastleEvent.TECH_SUCCESS = "castle_tech_success";//模块间收到 获取科技信息 事件 发包
//广播事件 便于其他模块接受消息处理
CastleEvent.MOVE_SCREEN = "castle_move_screen";//广播间屏幕移动事件
CastleEvent.UPDATE_BLOCK_TIME="castle_update_block_time";//广播更新地块建筑状态 倒计时
CastleEvent.UPDATE_TECH_TIME="castle_update_tech_time";//广播更新科技状态 倒计时
CastleEvent.UPDATE_TECH="castle_update_tech";//广播更新科技信息
CastleEvent.UPDATE_RESOURCE="castle_update_resource";//广播更新资源信息
CastleEvent.UPDATE_BUILDING="castle_update_building";//广播更新地块建筑信息
CastleEvent.NET_COMPLETE="castle_net_complete";//广播 通讯请求成功返回
CastleEvent.UPGRADE_COMPLETE="castle_upgrade_complete";//广播 建筑升级成功
CastleEvent.TECH_UPGRADE_COMPLETE="castle_tech_upgrade_complete";//广播 科技升级成功


//通讯部分
CastleNetEvent = {};

CastleNetEvent.ERROR=0;//错误信息

CastleNetEvent.SEND_CASTLE=400;//获得城堡信息

CastleNetEvent.SEND_BUILD=401;//建造建筑
CastleNetEvent.SEND_CANCEL=402;//取消建造/升级/拆除任务
CastleNetEvent.SEND_UPGRADE=403;//升级建筑
CastleNetEvent.SEND_REMOVE=404;//拆除建筑
CastleNetEvent.SEND_SPEED=405;//405 花钱立即完成建造/升级/拆除任务
CastleNetEvent.SEND_BLOCK=406;//获得单个地块信息

CastleNetEvent.SEND_TECH_UPGRADE=407;//升级科技
CastleNetEvent.SEND_TECH_CANCEL=408;//取消升级科技
CastleNetEvent.SEND_TECH_SPEED=409;//花钱立即完成科技升级
CastleNetEvent.SEND_TECH=410;//获得城堡单个科技信息

CastleNetEvent.GET_TECH=497;//城堡科技信息
CastleNetEvent.GET_RESOURCE=498;//城堡资源信息
CastleNetEvent.GET_BUILDING=499;//每个城堡地基建筑信息


var CastleData = DataBase.extend({

    _arrBlockBean:null,//csv地块数组
    _arrBuildingxyBean:null,//csv建筑偏移数组

    _castleTimer:null,//计时器 处理各种倒计时

    _movePos:null, //保存移动屏幕坐标

    //通讯数据
    _arrNetTech:null,//科技数据
    _arrNetResource:null,//资源数据
    _arrNetBlock:null,//地块建筑数据
    _arrCastleId:null,//城堡id数组
    _currentCastleId:null,//城堡id

    ctor:function()
    {

    },
    //初始化
    init:function()
    {
        //getConfigTableData(name)
        //getConfigTableValueByKey : function(tableName, key)
        //var configTable=ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableData("castle_buildingxy");
        //cc.log(typeof(configTabel)+"table"+configTabel);
        //var configTable=ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("castle_buildingxy");
        //var configTable2=ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueByKey("castle_buildingxy","1901001");
        //cc.log(typeof(configTable)+"#################table"+configTable.length);
        //cc.log(configTable2.id);

        //var selfData=SelfData.getInstance();
        //cc.log(selfData.platformId+"pid"+selfData.token+"token"+selfData.accountId+"aid"+selfData.nick+"hid"+selfData.headId);
        //NetMgr.inst().addEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );
        cc.log(CastleModule.CURRENT_CASTLEID+"城堡id   CastleData初始化城堡data  init");//LoadingModule.CASTLE_ID
        //this._currentCastleId="150B80EB-B720-0009-DEB9-FF9AAE0DB2CC";
        //this._currentCastleId=LoadingModule.CASTLE_ID;
        //this._arrCastleId=[this._currentCastleId];
        if(ProfileData.getInstance().castle.id){
            this._currentCastleId=ProfileData.getInstance().castle.id;
            this._arrCastleId=ProfileData.getInstance().castleIdList;
        }else{
            cc.log("ProfileData.getInstance().castle.id 不存在");
            return;
        }

        //var csvblock = ResMgr.inst().getCSV("castle_block");
        var csvblock = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("castle_block");
        if(this._arrBlockBean==null) this._arrBlockBean={};

        if(this._arrNetTech==null) this._arrNetTech={};
        if(this._arrNetResource==null) this._arrNetResource={};
        if(this._arrNetBlock==null) this._arrNetBlock={};

        for(var i=0;i<this._arrCastleId.length;i++){
            cc.log("各城堡id"+this._arrCastleId[i]);
            this._arrNetTech[this._arrCastleId[i]]={};
            this._arrNetResource[this._arrCastleId[i]]={};
            this._arrNetBlock[this._arrCastleId[i]]={};
        }

        for(var key in csvblock){
            //cc.log(key+"####key"+(key==2));  暂时只开放城内20索引以前的
            if(key<19){
                var blockbean=new CastleBlockBeanCSV(csvblock[key]);
                //cc.log(blockbean._index+"####"+key);
                this._arrBlockBean[blockbean._index]=blockbean;
                //初始化空地块
                for(var j=0;j<this._arrCastleId.length;j++){
                    this.getNetBlock(this._arrCastleId[j])[blockbean._index]=new CastleBlockBeanNet([this._arrCastleId[j],blockbean._index,0,0,0,0,0,0,0]);//blockbean._building_id[0]
                }
                //this.getNetBlock(null)[blockbean._index]=new CastleBlockBeanNet([this._currentCastleId,blockbean._index,0,0,0,0,0,0,0]);//blockbean._building_id[0]
            }
        }
        //cc.log("this._arrBlockBean.length@@"+this._arrBlockBean.length);
        //var csvbuildingxy = ResMgr.inst().getCSV("castle_buildingxy");
        var csvbuildingxy = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("castle_buildingxy");
        if(this._arrBuildingxyBean==null) this._arrBuildingxyBean={};
        for(var key in csvbuildingxy){
            var buildingxybean=new CastleBuildingxyBeanCSV(csvbuildingxy[key]);
            this._arrBuildingxyBean[buildingxybean._id]=buildingxybean;
        }

        //--------------------------------------  监听
        ProfileData.getInstance().addListener(ProfileData.UPDATE_CASTLE_COUNT,this.updataCastleCount,this);
        //城堡建筑
        EventMgr.inst().addEventListener(CastleEvent.BUILD_SUCCESS, this.onSendBuild, this);
        EventMgr.inst().addEventListener(CastleEvent.CANCEL_SUCCESS, this.onSendCancel, this);
        EventMgr.inst().addEventListener(CastleEvent.UPGRADE_SUCCESS, this.onSendUpgrade, this);
        EventMgr.inst().addEventListener(CastleEvent.REMOVE_SUCCESS, this.onSendRemove, this);
        EventMgr.inst().addEventListener(CastleEvent.SPEED_SUCCESS, this.onSendSpeed, this);
        EventMgr.inst().addEventListener(CastleEvent.BLOCK_SUCCESS, this.onSendBlock, this);
        //城堡科技
        EventMgr.inst().addEventListener(CastleEvent.TECH_UPGRADE_SUCCESS, this.onSendTechUpgrade, this);
        EventMgr.inst().addEventListener(CastleEvent.TECH_CANCEL_SUCCESS, this.onSendTechCancel, this);
        EventMgr.inst().addEventListener(CastleEvent.TECH_SPEED_SUCCESS, this.onSendTechSpeed, this);
        EventMgr.inst().addEventListener(CastleEvent.TECH_SUCCESS, this.onSendTech, this);

        //通讯监听


        //NetMgr.inst().addEventListener(599, this.netGetItem, this);//测试用 测试道具
        NetMgr.inst().addEventListener(CastleNetEvent.ERROR, this.netGetError, this);

        NetMgr.inst().addEventListener(CastleNetEvent.GET_TECH, this.netGetTech, this);
        NetMgr.inst().addEventListener(CastleNetEvent.GET_RESOURCE, this.netGetResource, this);
        NetMgr.inst().addEventListener(CastleNetEvent.GET_BUILDING, this.netGetBuilding, this);
        //if(this.isTest){
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,15,1907001,1,0,0,0,0,0]);
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,16,1901001,1,0,0,0,0,0]);
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,17,1909001,1,0,0,0,0,0]);
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,18,1913001,1,0,0,0,0,0]);
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,19,1913002,1,0,0,0,0,0]);
        //
        //    NetMgr.inst().dispatchEvent(CastleNetEvent.GET_BUILDING,[this._currentCastleId,3,1902001,1,0,0,0,0,0]);
        //}

        return true;
    },
    //事件
    updataCastleCount:function(type){
        //cc.log("updataCastleCount$$$"+type);
        if(ProfileData.getInstance().castle.id) this._currentCastleId=ProfileData.getInstance().castle.id;
        this._arrCastleId=ProfileData.getInstance().castleIdList;
    },
    //通讯部分-----------------------------
    //------------------发送-------
    //建造请求
    onSendBuild:function(type,index,buildingId,castleId){
        //cc.log(index+"###index城堡发送建造请求信息id###"+buildingId);
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_BUILD);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        msg.writeUint(buildingId);
        NetMgr.inst().send(msg);
    },

    onSendCancel:function(type,index,castleId){
        //cc.log(index+"###index城堡发送取消状态信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_CANCEL);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        NetMgr.inst().send(msg);
    },

    onSendUpgrade:function(type,index,castleId){
        //cc.log(index+"###index城堡发送升级请求信息id###");
        //cc.log("测试发送升级##########################################################################################################");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_UPGRADE);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        NetMgr.inst().send(msg);
    },

    onSendRemove:function(type,index,castleId){
        //cc.log(index+"###index城堡发送拆除请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_REMOVE);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        NetMgr.inst().send(msg);
    },

    onSendSpeed:function(type,index,castleId){
        //cc.log(index+"###index城堡发送加速状态请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_SPEED);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        NetMgr.inst().send(msg);
    },

    onSendBlock:function(type,index,castleId){
        //cc.log(index+"###index城堡发送单个地块请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_BLOCK);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(index);
        NetMgr.inst().send(msg);
    },

    onSendTechUpgrade:function(type,techId,castleId){
        //cc.log(techId+"###techid科技升级请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_TECH_UPGRADE);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(techId);
        NetMgr.inst().send(msg);
    },
    onSendTechCancel:function(type,techId,castleId){
        //cc.log(techId+"###techid取消科技状态请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_TECH_CANCEL);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(techId);
        NetMgr.inst().send(msg);
    },
    onSendTechSpeed:function(type,techId,castleId){
        //cc.log(techId+"###techid科技加速 立即完成请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_TECH_SPEED);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(techId);
        NetMgr.inst().send(msg);
    },
    onSendTech:function(type,techId,castleId){
        //cc.log(techId+"###techid科技信息 请求信息id###");
        var msg = new SocketBytes();
        msg.writeUint(CastleNetEvent.SEND_TECH);
        msg.writeString(castleId==undefined?this._currentCastleId:castleId);
        msg.writeUint(techId);
        NetMgr.inst().send(msg);
    },
    //=========================收到通讯处理数据=========================
    isTest:false,//是否是测试数据

    //测试收到道具
    netGetItem:function(cmd,data){
        if ( cmd==599) {
            data.resetCMDData();
            var data0 = data.readUint();
            var data1 = data.readUint();
            cc.log("收到道具id"+data0+"道具数量"+data1);
        }
    },

    //错误信息
    netGetError:function(cmd, data){
        if (CastleNetEvent.ERROR == cmd) {
            data.resetCMDData();
            var data0=data.readUint();
            var data1=data.readInt();
            var data2=data.readString();

            if(data1!=0&&data0!=0){
                cc.log("收到错误信息  对应协议号"+data0+"@@@错误信息@@@"+ResMgr.inst().getString(String(data1))+"@@@处理id@@@"+data2);
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString(String(data1)),color:null,time:null,pos:null});

            }
            if(data0!=0&&data1==0){
                cc.log("请求成功 返回消息 协议号"+data0);
                EventMgr.inst().dispatchEvent( CastleEvent.NET_COMPLETE,data0);
            }

        }
    },

    //获取科技信息
    netGetTech:function(cmd,data){
        if (CastleNetEvent.GET_TECH == cmd) {
            data.resetCMDData();
            var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
            //cc.log(arrData[1]+"####arrData[1]@@@@@"+arrData[2]+"dispatchEvent( CastleEvent.UPDATE_BUILDIN"+arrData[3]);
            this.updateNetTech(arrData);
            EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH,arrData);
        }
    },

    //获取建筑物更新信息
    netGetBuilding:function(cmd, data){
        if(CastleNetEvent.GET_BUILDING == cmd)
        {
            if(this.isTest){
                cc.log("收到通讯模拟数据》》》》》》》》");
                this.updateNetBlock(data);
                EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_BUILDING,data);
                return;
            }
            data.resetCMDData();

            var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
            cc.log(ResMgr.inst().getString(String(arrData[2])+"0")+arrData[1]+"####建筑名  地块id  建筑id@@"+arrData[2]+"等级level"+arrData[3]+"状态"+arrData[4]+"开始时间"+arrData[7]+"剩余时间"+arrData[8]);
            this.updateNetBlock(arrData);
            EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_BUILDING,arrData);
            //cc.log("#################测试 抛出建筑物事件啊啊");
        }
    },


    //获取资源信息
    netGetResource:function(cmd, data) {
        if (CastleNetEvent.GET_RESOURCE == cmd) {
            data.resetCMDData();
            var data0=data.readString();
            var data1=data.readUint();
            var data2=data.readUint();
            cc.log("data0"+data0);
            cc.log("this.getNetResource(data0)"+this.getNetResource(data0));
            if(this.getNetResource(data0)!=undefined)   var differ=data2-this.getNetResource(data0)[data1];
            this.updateNetResource(data0,data1,data2);
            cc.log(differ+"#差值￥￥￥收到资源更新id"+data1+"值"+data2);
            if(this.getNetResource(data0)!=undefined)EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_RESOURCE,{castleId:data0,resourceId:data1,differ:differ,current:data2});//城堡id 资源id 增减差值 当前值
        }
    },

    //更新科技信息
    updateNetTech:function(data){
        var techNet=new CastleTechBeanNet(data);
        //cc.log(this.getNetTech(null)+"this.getNetTech"+this.getNetTech(null)[techNet._tech_id]);
        if(this.getNetTech(null)[techNet._tech_id]!=null&&this.getNetTech(null)[techNet._tech_id]!=undefined&&this.getNetTech(null)[techNet._tech_id]._tech_level<techNet._tech_level){
            EventMgr.inst().dispatchEvent( CastleEvent.TECH_UPGRADE_COMPLETE,techNet);//抛消息
        }
        this.getNetTech(null)[techNet._tech_id]=techNet;
        //cc.log(techNet+"techNet"+techNet._state);
        if(techNet._state_remain>0&&techNet._state!=CastleData.STATE_NORMAL){//无计时器的时候初始化
            if(this._castleTimer==null) this._castleTimer=new IntervalCall(this.timeUpdate,this,1);

            EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH_TIME, techNet);
        }
    },

    //更新地块建筑物信息
    updateNetBlock:function(arr){
        var blockNet=new CastleBlockBeanNet(arr);
        if(this.getNetBlock(null)[blockNet._index]!=null&&this.getNetBlock(null)[blockNet._index]._building_level<blockNet._building_level&&this.getNetBlock(null)[blockNet._index]._building_level!=0){
            EventMgr.inst().dispatchEvent( CastleEvent.UPGRADE_COMPLETE,blockNet._index);//抛消息
        }
        this.getNetBlock(null)[blockNet._index]=blockNet;

        if(blockNet._state_remain>0&&blockNet._state!=CastleData.STATE_NORMAL){//无计时器的时候初始化
            if(this._castleTimer==null) this._castleTimer=new IntervalCall(this.timeUpdate,this,1);
            EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_BLOCK_TIME, blockNet);
            //cc.log("#################测试 抛出倒计时事件啊啊啊啊啊啊");
            //cc.log("#################测试 抛出倒计时事件啊啊啊啊啊啊");
        }
    },
    //更新资源信息
    updateNetResource:function(castleId,resourceId,num){
        //var blockNet=new CastleBlockBeanNet(data);
        //this._arrNetBlock[blockNet._index]=blockNet;
        this.getNetResource(castleId)[resourceId]=num;
    },
    //每秒更新
    timeUpdate:function( )
    {
        //cc.log("测试  计时器@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //城堡地块建筑倒计时
        var num=0;
        for (var i in this.getNetBlock()) {
            var blockNet = new CastleBlockBeanNet(this.getNetBlock()[i]._data);
            if(blockNet._state!=CastleData.STATE_NORMAL) num+=1;
            if(blockNet._state_remain>0&&blockNet._state!=CastleData.STATE_NORMAL){//&&blockNet._state!=CastleData.STATE_NORMAL
                blockNet._state_remain-=1000;
                blockNet._data[8]=blockNet._state_remain;
                if( blockNet._state_remain<=0)  {
                    var dtime=-blockNet._state_remain;
                    cc.log(dtime+"倒计时归零 特殊处理 请求 ###地块###信息"+blockNet._state);
                    blockNet._state_remain=0;
                    blockNet._data[8]=blockNet._state_remain;
                    this.onSendBlock(null,blockNet._index);
                    //var ac = cc.sequence( cc.delayTime(0.5), cc.callFunc( this.xxxxx, this ));
                }
                //事件 倒计时
                EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_BLOCK_TIME, blockNet);//if(blockNet._state!=CastleData.STATE_NORMAL)
            }
        }
        //城堡科技倒计时
        for (var i in this.getNetTech()) {
            var techNet = new CastleTechBeanNet(this.getNetTech()[i]._data);
            if(techNet._state!=CastleData.STATE_NORMAL) num+=1;
            if(techNet._state_remain>0&&techNet._state!=CastleData.STATE_NORMAL){
                techNet._state_remain-=1000;
                techNet._data[7]=techNet._state_remain;
                if( techNet._state_remain<=0)  {
                    cc.log("倒计时归零 特殊处理 请求 @科技@信息");
                    techNet._state_remain=0;
                    techNet._data[7]=techNet._state_remain;
                    this.onSendTech(null,techNet._tech_id);
                }
                //事件 倒计时
                EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH_TIME, techNet);//if(techNet._state!=CastleData.STATE_NORMAL)
            }
        }
        //cc.log(num+"num@@@@@@@@@")
        if(num==0) {
            //this._castleTimer.clear();
            //this._castleTimer=null;
            //this._castleTimer=new IntervalCall(this.timeUpdate,this,1);
        }

    },

    //-------------------@@@@@@@@@@@@@@@@@@@@@@@@@其他模块常用 获取数据方法@@@@@@@@@@@@@@@@@@@@@@@@@@@-----------------------
    //获取可建造建筑物过滤数组
    getCanBuilding:function(index,castleId){
        var blockbean=new CastleBlockBeanCSV(this._arrBlockBean[index]._data);
        var arr= blockbean._building_id;
        //cc.log(arr.length+"%%%%arr.length1"+arr+"###"+castleId);
        if(arr.length==1) return arr;
        for (var i in this.getNetBlock(castleId)){
            //cc.log(this.getNetBlock(castleId)[i]._data+"###########");
            var blockNet=new CastleBlockBeanNet(this.getNetBlock(castleId)[i]._data);
            //cc.log(blockNet._building_id+"<<arr   blockNet._building_id"+arr.indexOf(1902001)+"###"+arr.indexOf("1902001"));
            var sindex=arr.indexOf(String(blockNet._building_id));//blockNet._building_id
            if(sindex!=-1){
                arr.splice(sindex,1);
            }
        }
        //cc.log(arr.length+"<<<<arr.length2"+arr);
        return arr;
    },

    //根据科技id获取 科技数据  //用法：getNetTech(castleId)[科技id]   可以用new CastleTechBeanCSV( 前面的对象._data)
    getNetTech:function(castleId, techId ) {
        //cc.log(castleId+"$$$$$$$$$$"+this._currentCastleId)
        var dic = null;
        if (castleId == null || castleId == undefined)
        {
            dic = this._arrNetTech[this._currentCastleId];
        }
        else
        {
            dic = this._arrNetTech[castleId];
        }

        if (dic && techId != undefined)
        {
            dic = dic[techId];
        }

        return dic;
    },

    //根据城堡id获取城堡内netblock地块数据  //用法：getNetBlock(castleId,blockId地块index)   可以new CastleBlockBeanCSV( 前面的对象._data)
    getNetBlock:function(castleId,blockId){
        //cc.log(castleId+"$$$$$$$$$$"+this._currentCastleId)
        var dic = null;

        if(castleId==null||castleId==undefined) {
            dic= this._arrNetBlock[this._currentCastleId];
        }
        else{
            dic = this._arrNetBlock[castleId];
        }
        if( blockId != undefined )
        {
            return dic[blockId];
        }
        return dic;
    },
    //根据城堡id获取  netResource  资源对象   //用法：getNetResource(castleId,资源id)  获取对应资源的值
    getNetResource:function(castleId, resourceId ){
        //cc.log(castleId+"$$$$$$$$$$"+this._currentCastleId)

        var dic = null;

        if(castleId==null||castleId==undefined)
        {
            dic =  this._arrNetResource[this._currentCastleId];
        }
        else
        {
            dic = this._arrNetResource[castleId];
        }

        if( resourceId != undefined )
        {
            return dic[resourceId];
        }
        return dic;
    },

    //根据建筑id取netBlock地块数据 参照netblock
    getNetBlockByBuildingId:function(buildingId,castleId){
        var arr=[];
        var blockObj=this.getNetBlock(castleId);
        for(var i in blockObj){
            var blockNet = new CastleBlockBeanNet(blockObj[i]._data);
            if(Number(blockNet._building_id)==buildingId){
                arr.push(blockNet);
            }
        }
        return arr;
    },

    //根据升级拆除等状态获取netBlock地块建筑列表  状态看最下面静态属性
    getNetBlockByState:function(state,castleId){
        var arr=[];
        var blockObj=this.getNetBlock(castleId);
        for(var i in blockObj){
            var blockNet = new CastleBlockBeanNet(blockObj[i]._data);
            if(Number(blockNet._state)==state){
                arr.push(blockNet);
            }
        }
        return arr;
    },

    //根据升级拆除等状态获取netTech科技列表  状态看最下面静态属性
    getNetTechByState:function(state,castleId){
        var arr=[];
        var techObj=this.getNetTech(castleId);
        for(var i in techObj){
            var techNet = new CastleTechBeanNet(techObj[i]._data);
            if(Number(techNet._state)==state){
                arr.push(techNet);
            }
        }
        return arr;
    },
    destroy:function()
    {
        //NetMgr.inst().removeEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );

    },
    clear:function(){
        if(this._castleTimer)   this._castleTimer.clear();
    },
});

//静态属性
CastleData.STATE_NORMAL=0;//无状态 正常状态
CastleData.STATE_BUILD=1;//正在建造
CastleData.STATE_UPGRADE=2;//正在升级
CastleData.STATE_REMOVE=3;//正在拆除
CastleData.STATE_PRODUCE=4;//正在生产