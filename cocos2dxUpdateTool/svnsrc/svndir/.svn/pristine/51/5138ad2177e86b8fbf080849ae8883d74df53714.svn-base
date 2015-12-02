/**
 * Created by cgMu on 2015/11/2.
 */

var CollegeData = DataBase.extend({
    remainTime:0,
    ctor:function() {

        this._techData=[];
        this._techData[0]=[];
        this._techData[1]=[];
        this._techData[2]=[];
        this._techData[3]=[];

        var tech_data = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("City_College_tech");//ResMgr.inst().getJSON("City_College_tech",null,true);
        for(var i in tech_data) {
            //cc.log("CollegeData",i,tech_data[i].tech_type);
            if (tech_data[i].tech_type==1) {
                var temp = this.getArray(tech_data[i].tech_id_level);
                //cc.log("***CollegeData",temp[0],temp[1]);
                if ( this.existInArray(this._techData[0],temp[0]) == false ) {
                    this._techData[0].push(temp[0]);
                }
            }
            else if (tech_data[i].tech_type==2) {
                var temp = this.getArray(tech_data[i].tech_id_level);
                if ( this.existInArray(this._techData[1],temp[0]) == false ) {
                    this._techData[1].push(temp[0]);
                }
            }
            else if (tech_data[i].tech_type==3) {
                var temp = this.getArray(tech_data[i].tech_id_level);
                if ( this.existInArray(this._techData[2],temp[0]) == false ) {
                    this._techData[2].push(temp[0]);
                }
            }
            else if (tech_data[i].tech_type==2) {
                var temp = this.getArray(tech_data[i].tech_id_level);
                if ( this.existInArray(this._techData[3],temp[0]) == false ) {
                    this._techData[3].push(temp[0]);
                }
            }
        }
    },

    init:function()
    {
        return true;
    },

    destroy:function() {

    },

    existInArray: function (array, value) {
        var exist = false;
        for(var i in array) {
            if(value == array[i]) {
                exist=true;
                break;
            }
        }
        return exist;
    },

    getArray: function (string) {
        var last = string.length;
        var substr = string.substr(1,last-2);
        var array = substr.split(",");
        return array;
    },

    getTechLevel: function (techid) {
        var data = ModuleMgr.inst().getData("CastleModule").getNetTech();
        var levelstring = 0;
        if(data[techid]) {
            levelstring=data[techid]._tech_level;
        }
        return levelstring;
    }
});