/**
 * Created by Administrator on 2015/10/30/0030.
 */
var Castle_Block = ccui.ImageView.extend({

    _blockBean:null,//地块csv数据
    _buildingBean:null,//建筑csv数据
    _buildingImg:null,//建筑物图
    _buildingId:null,//建筑id
    _blockImg:null,//地块图
    _touchArea:null,//点击区域

    _layerBlock:null,//地块层
    _layerEffectBuildingDown:null,//建筑物下特效层
    _layerBuilding:null,//建筑物层
    _layerEffectBuildingUp:null,//建筑物上特效层
    _layerEffectTop:null,//最上特效层
    _layerTfIcon:null,//文本图标层

    _imgTf:null,//等级牌子图
    _tfLevel:null,//等级文本
    _tfName:null,//建筑名
    _imgNameBg:null,//建筑名背景底
    _tfStateTime:null,//状态剩余时间
    _imgProgressTfUp:null,//进度上文字底框
    _imgProgressTfDown:null,//进度下文字底框
    _imgProgressDown:null,//进度底
    _imgProgress:null,//进度条
    _imgProgressRight:null,//进度头
    _imgIcon:null,//进度左边图标


    ctor: function (imageFileName, texType) {
        this._super(imageFileName,texType);

        this.initLayer();
    },
    //初始化显示层
    initLayer:function(){
        this._layerBlock=new cc.Layer();
        this.addChild(this._layerBlock);
        this._layerEffectBuildingDown=new cc.Layer();
        this.addChild(this._layerEffectBuildingDown);
        this._layerBuilding=new cc.Layer();
        this.addChild(this._layerBuilding);
        this._layerEffectBuildingUp=new cc.Layer();
        this.addChild(this._layerEffectBuildingUp);
        this._layerEffectTop=new cc.Layer();
        this.addChild(this._layerEffectTop);
        this._layerTfIcon=new cc.Layer();
        this.addChild(this._layerTfIcon);


    },
    //初始化点击区域
    initTouchArea:function(){
        var isWall=this._blockBean._index==15;//城墙 bool
        var isCastle=this._blockBean._index==16;//领主府 bool
        var isArrow=(this._blockBean._index==18||this._blockBean._index==19);//箭塔bool
        //if(!isWall&&!isArrow) this.scaleX=this.scaleY=0.8;//非城墙 箭塔 缩放80%;
        //if(this._blockBean._index!=15&&this._blockBean._index!=33&&this._blockBean._index!=34)
        this._touchArea= new ccui.Layout();
        this._touchArea.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this._touchArea.setContentSize( cc.size(90,90) );
        this._touchArea.setBackGroundColor(cc.color(100,100,100,255));
        this._touchArea.anchorX=this._touchArea.anchorY=0.4;

        if(!isWall&&!isArrow&&!isCastle) {
            this._touchArea.rotation=60;
            this._touchArea.rotationY=25;
        }
        if(isCastle){
            this._touchArea.setContentSize( cc.size(120,150) );
            this._touchArea.rotation=60;
            this._touchArea.rotationY=30;
            this._touchArea.anchorX=0;
            this._touchArea.anchorY=0.9;
        }
        if(isWall){
            this._touchArea.setContentSize( cc.size(160,150) );
            this._touchArea.anchorX=0.3;
            this._touchArea.anchorY=0.4;
            this._touchArea.rotation=30;
        }
        if(isArrow){
            this._touchArea.setContentSize( cc.size(60,100) );
            this._touchArea.anchorY=0.7;
        }
        //this._touchArea.setRotationY(30);

        this._touchArea.setOpacity(0);
        this._touchArea.setTouchEnabled(true);
        this.addChild(this._touchArea);
    },
    //初始化地块
    initBlock:function(url,index){

        this._blockImg=new ccui.ImageView(url,ccui.Widget.PLIST_TEXTURE);
        if(index!=15&&index!=18&&index!=19) this._blockImg.scaleX=this._blockImg.scaleY=0.8;
        this._layerBlock.addChild(this._blockImg);
    },
    //更新升级时间
    updateBuildingTime:function(netblock,isTech){
        if(!isTech) var blockNet = new CastleBlockBeanNet(netblock._data);//地块
        else var blockNet=new CastleTechBeanNet(netblock._data);//科技
        //cc.log(blockNet._state_remain+"剩余时间"+blockNet._state);

        if(blockNet._state==CastleData.STATE_NORMAL) {
            //this.removeTimeIcon();
            return;
        }

        if(this._imgProgressTfUp==null){
            this._imgProgressTfUp=new ccui.ImageView("castle/shijiandi.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressTfUp.x=35;
            this._imgProgressTfUp.y=-69;
            this._layerTfIcon.addChild(this._imgProgressTfUp);
        }
        if(this._imgProgressTfDown==null){
            this._imgProgressTfDown=new ccui.ImageView("castle/mingchengdi_beijin.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressTfDown.y=-100;
            this._imgProgressTfDown.setVisible(false);//底框暂时屏蔽
            this._layerTfIcon.addChild(this._imgProgressTfDown);
        }
        if(this._imgProgressDown==null){
            //this._imgProgressDown=new ccui.ImageView("castle/jz_nengliangtiao_di.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressDown=new ccui.ImageView("castle/jindutiaodikuang.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressDown.y=-80;
            this._layerTfIcon.addChild(this._imgProgressDown);
        }
        if(this._imgProgress==null){
            //this._imgProgress=new ccui.ImageView("castle/jz_nengliangtiao.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgress=new ccui.ImageView("castle/jidutiao_duquicon.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgress.anchorX=0;
            this._imgProgress.x=this._imgProgressDown.x-35;
            this._imgProgress.y=this._imgProgressDown.y;
            this._layerTfIcon.addChild(this._imgProgress);
        }
        if(this._imgProgressRight==null){
            //this._imgProgressRight=new ccui.ImageView("castle/jz_nengliangtiaotou.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressRight=new ccui.ImageView("castle/tubiaodi.png",ccui.Widget.PLIST_TEXTURE);
            this._imgProgressRight.x=this._imgProgressDown.x-56;
            this._imgProgressRight.y=this._imgProgressDown.y-2;
            this._layerTfIcon.addChild(this._imgProgressRight);
        }
        if(this._imgIcon==null){
            //this._imgIcon=new ccui.ImageView("res/images/ico/15010013.png");
            this._imgIcon=new ccui.ImageView("castle/jiantou_icon.png",ccui.Widget.PLIST_TEXTURE);
            this._imgIcon.x=this._imgProgressDown.x-55;
            this._imgIcon.y=this._imgProgressDown.y;
            this._layerTfIcon.addChild(this._imgIcon);
        }
        if(this._tfStateTime==null){
            this._tfStateTime=new cc.LabelTTF("","Arial",20);
            this._tfStateTime.x=this._imgProgressDown.x+10;
            this._tfStateTime.y=this._imgProgressDown.y+20;
            this._tfStateTime.setColor(cc.color.WHITE);
            this._layerTfIcon.addChild(this._tfStateTime);
        }
        if(blockNet._state==CastleData.STATE_NORMAL) blockNet._state_remain=0;//以状态为准
        this._tfStateTime.string=StringUtils.formatTimer(blockNet._state_remain);
        var scaleTime=blockNet._state_remain/blockNet._state_param1;
        if(scaleTime>1) scaleTime=1;
        if(blockNet._state_remain<1000||blockNet._state==CastleData.STATE_NORMAL) scaleTime=0;
        this._imgProgress.scaleX=scaleTime;
        //this._imgProgressRight.x=this._imgProgress.x+this._imgProgress.width;
    },
    //临时用
    _arrTest2:[1,6,7,8,17],//初始建筑//
    _arrTest3:[1915001,1911001,1910001,1912001,1909001],//初始建筑//
    //更新建筑状态等
    updateBuilding:function(netblock){
        this.showBuildingLevel(netblock);
        this.updateBuildingTime(netblock);
        this.showEffect(netblock);
    },
    //显示等级
    showBuildingLevel:function(netblock){
        var blockNet=new CastleBlockBeanNet(netblock._data);
        var nameString=ResMgr.inst().getString(String(blockNet._building_id)+"0");
        if(nameString=="null"){
            var nameString=ResMgr.inst().getString( String(this._arrTest3[this._arrTest2.indexOf(Number(blockNet._index))])+"0" );
        }
        var lvString=String(blockNet._building_level==0?1:blockNet._building_level);//"LV"+
        if(this._imgTf==null){
            if(this._blockBean._index!=15&&this._blockBean._index!=18&&this._blockBean._index!=19) {
                this._imgTf=new ccui.ImageView("castle/paizi.png",ccui.Widget.PLIST_TEXTURE);
                this._imgTf.x=70;
                //this._imgTf.y=1;
                //城堡和铁匠铺 没地块资源坐标特殊
                if(this._blockBean._index==17) this._imgTf.y=-25;
                if(this._blockBean._index==16) this._imgTf.y=-85;
                this._layerBuilding.addChild(this._imgTf);
            }
        }
        if(this._tfLevel==null){
            if(this._blockBean._index!=15&&this._blockBean._index!=18&&this._blockBean._index!=19) {
                this._tfLevel=new cc.LabelTTF(lvString,"Arial",12);//+lvString
                this._tfLevel.setColor(cc.color(122,81,3));
                this._tfLevel.x=this._imgTf.x;
                this._tfLevel.y=this._imgTf.y+2;
                this._tfLevel.rotation=0;
                this._tfLevel.rotationY=-20;
                this._layerBuilding.addChild(this._tfLevel);
                this._tfLevel.setString(lvString);
            }

        }
        if(this._imgNameBg==null){
            this._imgNameBg=new ccui.ImageView("castle/jzmc_dikuang.png",ccui.Widget.PLIST_TEXTURE);
            this._imgNameBg.y=60;
            this._layerTfIcon.addChild(this._imgNameBg);
        }
        if(this._tfName==null){
            this._tfName=new cc.LabelTTF(nameString,"Arial",20);//+lvString
            this._tfName.setColor(cc.color.YELLOW);
            this._tfName.y=60;
            this._layerTfIcon.addChild(this._tfName);
        }
        this._imgNameBg.setVisible(false);
        this._tfName.setVisible(false);

    },
    //显示名称
    showBuildingName:function(bool){
        //cc.log("bool$$$$$$$$$$$$$$$$$$$"+bool);
        return;//暂时屏蔽不显示
        if(this._imgNameBg!=null) this._imgNameBg.setVisible(bool);
        if(this._tfName!=null) this._tfName.setVisible(bool);
    },
    //显示特效
    showEffect:function(netblock){
        var blockNet=new CastleBlockBeanNet(netblock._data);
        if(blockNet._state==CastleData.STATE_UPGRADE){
            this.addEffect("castle_upgrade_hammer","Top");
            this.addEffect("castle_upgrade_down","BuildingDown");
            this.addEffect("castle_upgrade_up","BuildingUp");
        }
        else{
            this.removeTimeIcon();
            this.removeEffect("castle_upgrade_hammer","Top");
            this.removeEffect("castle_upgrade_down","BuildingDown");
            this.removeEffect("castle_upgrade_up","BuildingUp");
        }
    },
    //更新科技状态
    updateTech:function(netTech){
        this.updateBuildingTime(netTech,true);
        this.showTechEffect(netTech);
    },
    //显示科技特效
    showTechEffect:function(netTech){
        var techNet=new CastleTechBeanNet(netTech._data);
        if(techNet._state==CastleData.STATE_UPGRADE){
            this.addEffect("castle_tech_upgrade","Top");
        }
        else{
            this.removeTimeIcon();
            this.removeEffect("castle_tech_upgrade","Top");
        }
    },
    //科技升级成功
    upgradeTechComplete:function(){
        this.removeTimeIcon();
        this.removeEffect("castle_tech_upgrade","Top");
        this.addEffect("castle_tech_upgrade_complete","Top",1);

    },
    //升级成功
    upgradeComplete:function(){
        //cc.log("播放升级成功特效啊！！！！！！！");
        this.addEffect("castle_upgrade_complete","Top",1);
    },
    //造建筑
    createBuilding:function(id,index){
        if( ModuleMgr.inst().getData("CastleModule")._arrBuildingxyBean[id]==null||this._buildingImg!=null||id==0) {
            //cc.log(id+"###id"+this._buildingImg+"index"+ModuleMgr.inst().getData("CastleModule")._arrBuildingxyBean[id]);
            //cc.log(ModuleMgr.inst().getData("CastleModule")._arrBuildingxyBean[id]+"#####$$#$#$createBuilding    return#$#$$$$$$$$$$"+ModuleMgr.inst().getData("CastleModule")._arrBuildingxyBean[String(id)])
            return;
        }
        this._buildingId=id;
        var buildingxyBean=new CastleBuildingxyBeanCSV(ModuleMgr.inst().getData("CastleModule")._arrBuildingxyBean[id]._data);
        this._buildingBean=buildingxyBean;
        var url="castle/" + id+".png";
        //cc.log("createBuilding++++++++++++++++++++++");
        //cc.log(buildingxyBean._x+"<<<url"+buildingxyBean._y+"@@xy"+url);
        //cc.log(this.anchorX+"anchorxy"+this.anchorY+"wh"+this.width+"height"+this.height);
        this._buildingImg=new ccui.ImageView(url,ccui.Widget.PLIST_TEXTURE);
        //this._buildingImg.anchorX=this._buildingImg.anchorY=0;
        this._buildingImg.x= Number(buildingxyBean._x)+(this.width/2);
        this._buildingImg.y= Number(buildingxyBean._y)+(this.height/2);
        if(index!=15&&index!=18&&index!=19) this._buildingImg.scaleX=this._buildingImg.scaleY=0.8;
        //cc.log(this._buildingImg.x+"this._buildingImg.xy"+this._buildingImg.y);
        this._layerBuilding.addChild(this._buildingImg);
        //if(this._blockImg!=null)    this._layerBlock.removeChild(this._blockImg);
    },

    //添加特效  参数：特效名 显示层名
    addEffect:function(name,layerName,count){

        var layer=this["_layerEffect"+layerName];
        var effect=this["_layerEffect"+layerName].getChildByName(name);
        if(!layer){
            cc.log("BUG@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@参数错误  不存在层")
        }else{
            if(!effect){
                //cc.log("不存在该特效 新建");
                var csvEffect = ResMgr.inst().getCSV("animationConfig",name);
                var animate=new AnimationSprite();
                animate.setName(name);
                if(count>0) {
                    animate.setAnimationByCount(csvEffect,count,this.removeEffectCall,this,{param1:name,param2:layerName});
                }
                else animate.setAnimationByCount(csvEffect,count);
                layer.addChild(animate);
            }
            else{
                //cc.log(name+"存在特效不管了######"+layerName+"次数"+count);

            }
        }
    },
    //移除特效
    removeEffectCall:function(data){
        //cc.log(data);
        //cc.log(data.param1+"名称"+data.param2);
        this.removeEffect(data.param1,data.param2);
    },
    removeEffect:function(name,layerName){
        var layer=this["_layerEffect"+layerName];
        var effect=this["_layerEffect"+layerName].getChildByName(name);
        if(!layer||!effect){
            if(!layer)  cc.log("BUG@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@参数错误 移除特效 不存在层")
        }else{
            //cc.log(name+"特效移除成功"+layerName)
            effect.removeData();
            effect.removeFromParent();
            effect=null;
        }

    },
    //清除时间图标
    removeTimeIcon:function(){
        if(this._tfStateTime){
            this._tfStateTime.removeFromParent();
            this._tfStateTime=null;
        }
        if(this._imgProgressTfUp){
            this._imgProgressTfUp.removeFromParent();
            this._imgProgressTfUp=null;
        }
        if(this._imgProgressTfDown){
            this._imgProgressTfDown.removeFromParent();
            this._imgProgressTfDown=null;
        }
        if(this._imgProgressDown){
            this._imgProgressDown.removeFromParent();
            this._imgProgressDown=null;
        }
        if(this._imgProgress){
            this._imgProgress.removeFromParent();
            this._imgProgress=null;
        }
        if(this._imgProgressRight){
            this._imgProgressRight.removeFromParent();
            this._imgProgressRight=null;
        }
        if(this._imgIcon){
            this._imgIcon.removeFromParent();
            this._imgIcon=null;
        }
    },

    //拆除建筑
    removeBuilding:function(){
        if(this._buildingImg)   {
            this._buildingImg.removeFromParent();
            this._buildingImg=null;
            this._buildingId=null;
        }
        if(this._tfName){
            this._tfName.removeFromParent();
            this._tfName=null;
        }
        if(this._tfLevel){
            this._tfLevel.removeFromParent();
            this._tfLevel=null;
        }
        if(this._imgTf){
            this._imgTf.removeFromParent();
            this._imgTf=null;
        }
        if(this._imgNameBg){
            this._imgNameBg.removeFromParent();
            this._imgNameBg=null;
        }
        this.removeTimeIcon();
    },

    destroy : function()
    {

        this._blockBean=null;

        if(this._blockImg){
            this._blockImg.removeFromParent();
            this._blockImg=null;
        }
        if(this._touchArea){
            this._touchArea.removeFromParent();
            this._touchArea=null;
        }
        this.removeBuilding();


        if(this._layerBlock){
            this._layerBlock.removeFromParent();
            this._layerBlock=null;
        }
        if(this._layerEffectBuildingDown){
            this._layerEffectBuildingDown.removeFromParent();
            this._layerEffectBuildingDown=null;
        }
        if(this._layerBuilding){
            this._layerBuilding.removeFromParent();
            this._layerBuilding=null;
        }
        if(this._layerEffectBuildingUp){
            this._layerEffectBuildingUp.removeFromParent();
            this._layerEffectBuildingUp=null;
        }
        if(this._layerEffectTop){
            this._layerEffectTop.removeFromParent();
            this._layerEffectTop=null;
        }
        if(this._layerTfIcon){
            this._layerTfIcon.removeFromParent();
            this._layerTfIcon=null;
        }
    },

})