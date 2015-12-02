//2015-10-15 显示支持
var CD = cc.Class.extend({
	constHeight : 640,
	ctor : function ()
	{
		this.constHeight = 640;
	},
	init : function ()
	{
		CD.screenWidth = cc.Director.getInstance().getWinSize().width;
		CD.screenHeight = cc.Director.getInstance().getWinSize().height;
		CD.phone = true;
		CD.mapScale = CD.screenHeight / this.constHeight;
		CD.width = CD.screenWidth / CD.mapScale;
		CD.height = this.constHeight;
		CD.smallScale = CD.screenWidth / CD.gameWidth;
		CD.smallScale = CD.smallScale < (CD.screenHeight / CD.gameHeight) ? CD.smallScale : (CD.screenHeight / CD.gameHeight);

		//set config
		for(var i = 0; i < 100; i+=6)
		{
			CD.scrollSensorConfig[i.toString()] = true;
		}
	}
});
CD.screenWidth;
CD.screenHeight;
CD.gameWidth = 960;
CD.gameHeight = 640;
CD.phone;
CD.smallScale;
CD.mapScale;
CD.width;
CD.height;
CD.CLICK_NPC = "click_npc";
CD.FINT_NPC_AND_CLICK = "fint_npc_and_click";
CD.AUTO_RUN = "CD.auto_run";
CD.START_CHANGE_MAP = "start_change_map";
CD.CLEAR_CUR_MAP = "clear_cur_map";
CD.CHANGE_MAP = "change_map";
CD.LOAD_MAP_READ = "load_map_ready";
CD.LOAD_MAP_COMPLETE = "load_map_complete";
CD.instance;

CD.isPhoneNum = function(phone)
{
	var head = phone.substr(0, 3);
	var headNum = parseInt(head);
	return (130 <= headNum && 199 >= headNum && 11 == phone.length);
};

//随机密码
CD.genRandToken = function()
{
	var str = "";
	str += new Date().getTime();
	str += "_";
	for(var i = 0; i < 32; ++i)
	{
		str += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)];
	}
	return str;
};

//满足字符合法
CD.isValidUserName = function (name)
{
	var reg = "^[a-z0-9A-Z\u4e00-\u9fa5]+$";
	var genReg = new RegExp(reg);
	return genReg.test(name);
};

//满足规则合法
CD.validNameByRule = function (name)
{
	if(!cc.isString(name)) return -2;

	if(0 < name.length)
	{
		//字符非法
		if(!CD.isValidUserName(name)) return -2;

		var banned = cc.loader.getRes("res/configs/txts/bannedWords.txt");
		var parsedBanned = JSON.parse(banned);
		var re = false;
		for(var o in parsedBanned)
		{
			var parsedBannedAtom = new RegExp(parsedBanned[o].toString(), 'g');
			re = parsedBannedAtom.test(name);
			if(re) break;
		}

		if(re) return -1;
		else return 1;
	}
},

//临时配置滑动条音效响应参数
CD.scrollSensorConfig = {};

//container []
//container [i] {}
//attr Num
CD.sortOnAttr = function (container, attr)
{
	if(null == container || undefined == container) return;

	var sz = container.length;
	for(var i = 0; i < sz; ++i)
	{
		for(var j = 0; j < sz - i - 1; ++j)
		{
			if(container[j].hasOwnProperty(attr) && container[j + 1].hasOwnProperty(attr))
			{
				var left = Number(container[j][attr]);
				var right = Number(container[j + 1][attr]);

				if(left > right)
				{
					var temp = container[j];
					container[j] = container[j+1];
					container[j+1] = temp;
				}
			}
		}
	}
};
CD.getXAdjustment = function ()
{
	return (CD.screenWidth - 960 * CD.mapScale) / 2 * CD.width / CD.screenWidth;
};
CD.getScaleXAdjust = function ()
{
	return CD.gameWidth / CD.width * CD.height / CD.gameHeight;
};
CD.getScaleYAdjust = function ()
{
	return CD.gameHeight / CD.height * CD.width / CD.gameWidth;
};
CD.adjustBackgroundSize = function(target)
{
	if(target)
	{
		if(CD.isLandscapeMode())
		{
			target.setScaleX(target.getScaleX() * CD.screenWidth / CD.gameWidth);
			target.setScaleY(target.getScaleY() * CD.screenWidth / CD.gameWidth);
		}
		else
		{
			target.setScaleX(target.getScaleX() * CD.screenHeight / CD.gameHeight);
			target.setScaleY(target.getScaleY() * CD.screenHeight / CD.gameHeight);
		}
	}
};
CD.isLandscapeMode = function ()
{
	var sw = AutoResizeUtils.frameSize.width;
	var sh = AutoResizeUtils.frameSize.height;
	if(sw / sh > 1.5)
	{
		return true;
	}
	else
	{
		return false;
	}
};
//统一样式
CD.uniformChildrenStyle = function (parent, rootParent, omits)
{
	var omitsObj = (undefined == omits) ? "line" : omits;
	if(null == parent || undefined == parent || null == rootParent || undefined == rootParent)
	{
		cc.error("错误,统一样式设置父对象为空");
		return;
	}

	var itemObjs = parent.getChildren();
	var itemObjNum = itemObjs.length;
	for(var i = 0; i < itemObjNum; ++i)
	{
		if(omitsObj != itemObjs[i].getName())
		{
			CD.getAdjustScale(itemObjs[i], rootParent);
			if("TextField" != itemObjs[i].getDescription())
			{
				itemObjs[i].ignoreContentAdaptWithSize(true);
			}
		}
		AutoResizeUtils.resetNode(itemObjs[i]);
		NodeUtils.setFontName(itemObjs[i]);
	}
};
CD.getAdjustScale = function (target, panel)
{
	var sw = AutoResizeUtils.frameSize.width;
	var sh = AutoResizeUtils.frameSize.height;
	if(null != target && undefined != target && null != panel && undefined != panel)
	{
		var sx = 1.0 / panel.getScaleX();
		var sy = 1.0 / panel.getScaleY();
		if(sw / sh >= 1.5)
		{
			target.setScaleX(target.getScaleX() * sx);
		}
		else
		{
			target.setScaleY(target.getScaleY() * sy);
		}
	}
};
CD.getInstance = function ()
{
	if(CD.instance == null) CD.instance = new CD();
	return CD.instance;
};
CD.getWinScale = function (w,h)
{
	var sw = CD.screenWidth / w;
	var sh = CD.screenHeight / h;
	return sw < sh ? sw : sh;
};
