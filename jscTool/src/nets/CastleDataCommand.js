/**
 * Created by Administrator on 2015/12/3.
 */

//CastleNetEvent.GET_BUILDING=499;//每个城堡地基建筑信息
//CastleNetEvent.GET_RESOURCE=498;//城堡资源信息

var CastleDataCommand =  function() {
    var blockCall = function( cmd, msg ) {
        if(CastleNetEvent.GET_BUILDING==cmd){
            msg.resetCMDData();
            var obj = DataManager.getInstance().getNewData("CastleBlockItemData");
            obj.castleId        = msg.readString();
            obj.index           = msg.readUint();
            obj.buildId         = msg.readUint();
            obj.buildLevel      = msg.readUint();
            obj.state           = msg.readUint();
            obj.upgradeTime     = msg.readUint();
            obj.stateParam      = msg.readUint();
            obj.beginTime       = msg.readUint();
            obj.remainTime      = msg.readUint();

            //var blockData = ModuleMgr.inst().getData("CastleModule").getNetBlock()[obj.index];
            //if(blockData!=null&&blockData._building_level<obj.buildLevel&&blockData._building_level!=0){
            //    EventMgr.inst().dispatchEvent( CastleEvent.UPGRADE_COMPLETE,obj.index);//抛消息
            //}

            var exist = false;
            var list = mainData.castleData.blockList;
            for(var i = 0;i< list.length;i++){
                var block = list.getItemAt(i);
                if(obj.castleId == block.castleId && obj.index == block.index){
                    //cc.log("@@@CastleDataCommand true",obj.castleId,obj.index);
                    exist = true;
                    list.setItemAt(i,obj);
                    break;
                }
            }
            if(!exist){
                //cc.log("@@@CastleDataCommand false",obj.castleId,obj.index);
                mainData.castleData.blockList.push(obj);
            }

            var arrData=[obj.castleId,obj.index,obj.buildId,obj.buildLevel,obj.state,obj.upgradeTime,obj.stateParam,obj.beginTime,obj.remainTime];
            EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_BUILDING,arrData);

            ModuleMgr.inst().getData("CastleModule").updateNetBlock(arrData);//更新地块建筑物信息
        }
    };

    var resourceCall = function( cmd, msg ) {
        if(CastleNetEvent.GET_RESOURCE==cmd){
            msg.resetCMDData();
            var obj = DataManager.getInstance().getNewData("ResourceItemData");
            obj.castleId        = msg.readString();
            obj.resourceId      = msg.readUint();
            obj.num             = msg.readUint();

            var numEx = ModuleMgr.inst().getData("CastleModule").getNetResource(obj.castleId,obj.resourceId);
            if(numEx>0){
                var differ = obj.num-numEx;
                EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_RESOURCE,{castleId:obj.castleId,resourceId:obj.resourceId,differ:differ,current:obj.num});//城堡id 资源id 增减差值 当前值
            }

            var exist = false;
            var list = mainData.castleData.resourceList;
            for(var i = 0;i<list.length;i++){
                var res = list.getItemAt(i);
                if(obj.castleId == res.castleId && obj.resourceId==res.resourceId){
                    //cc.log("@CastleDataCommand true",obj.castleId,obj.resourceId);
                    exist = true;
                    list.setItemAt(i,obj);
                    break;
                }
            }
            if(!exist){
                //cc.log("@CastleDataCommand false",obj.castleId,obj.resourceId);
                mainData.castleData.resourceList.push(obj);
            }
        }
    };

    var init = function() {
        NetMgr.inst().addEventListener( CastleNetEvent.GET_BUILDING, blockCall, this );
        NetMgr.inst().addEventListener( CastleNetEvent.GET_RESOURCE, resourceCall, this );
    };

    init();
};