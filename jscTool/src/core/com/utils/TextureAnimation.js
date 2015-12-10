/*
 * 序列帧动画
 * 2015年5月11日 20:52:02
 */
var TextureAnimation = cc.Class.extend({


});

TextureAnimation.cacheDic = {};

/**
 * 播放动画从贴图(一张大的png动画图和一张plist文件)
 * @parent 			添加动画的容器
 * @attr			动画属性({x:200, y:200,rotationX:-17,scaleX:0.8})
 * @plist  			动画plist文件
 * @png				动画png文件
 * @keyName  		动画节点名称(plist里面key)
 * @startInd 		节点数字开始下标
 * @endInd			节点数字结束下标
 * @delay			动画播放间隔(秒)
 * @count    		播放次数(无限播放设置最大值)
 * @completeCall 	播放完成回调
 * @owner			传this就可以了
 * @params			参数
 */
TextureAnimation.playAnimationForMap = function(parent,attr,plist,png,keyName,startInd,endInd,delay,count,completeCall,owner,params)
{
	var remove = function(target,agrgs)
	{
		var completeCall = agrgs[0];
		var owner = agrgs[1];
		var params = agrgs[2];
		if(target != null)
		{
			target.removeFromParent();
			target = null;
		}

		if(completeCall != null)
		{
			completeCall.apply(owner,[params]);
		}

		completeCall = null;
		owner = null;
		params = null;
		remove = null;
	}

	var cache = {};
	var sprite = new cc.Sprite();
	var animation = new cc.Animation();
	var runningAction = new cc.Animate();
	if(attr != null && attr != undefined)
	{
		sprite.attr(attr);
	}
	if(TextureAnimation.cacheDic[plist] == null)
	{
		cc.spriteFrameCache.addSpriteFrames(plist);

		var animFrames = [];
		for (var i = startInd; i <= endInd; i++)
		{
			var str = keyName + i + ".png";
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		animation.initWithSpriteFrames(animFrames,delay,count);
		runningAction.initWithAnimation(animation);
		sprite.runAction(cc.sequence(runningAction,cc.callFunc(remove,this,[completeCall,owner,params])));
		cache.animFrames = animFrames;
		TextureAnimation.cacheDic[plist] = cache;
	}
	else
	{
		cache = TextureAnimation.cacheDic[plist];
		animation.initWithSpriteFrames(cache.animFrames,delay,count);
		runningAction.initWithAnimation(animation);
		sprite.runAction(cc.sequence(runningAction,cc.callFunc(remove,this,[completeCall,owner,params])));
	}

	parent.addChild(sprite);

	return sprite;
};

/**
 * 播放动画贴图从列表 [{plist:"res/clock1.plist",startInd:1,endInd:80},{plist:"res/clock2.plist",startInd:81,endInd:100}]
 * @parent 		添加动画的容器
 * @attr			动画属性({x:200, y:200,rotationX:-17,scaleX:0.8})
 * @plist  			动画plist文件
 * @keyName  		动画节点名称(plist里面key)
 * @startInd 		节点数字开始下标
 * @count    		播放次数(无限播放设置最大值)
 * @completeCall 	播放完成回调
 * @owner			传this就可以了
 * @params			参数
 */
TextureAnimation.playAnimationListForMap = function(parent,attr,list,keyName,delay,count,completeCall,owner,params)
{
	var playCount = 0;
	var index = 0;
	check();

	function remove(target)
	{
		if(target != null)
		{
			target.removeFromParent();
			target = null;
		}

		check()
	}

	function check()
	{
		if(playCount < count)
		{
			if(index >= list.length)
			{
				playCount++;
				index = 0;
				check();
			}
			else
			{
				var obj = list[index];
				play(obj.plist,obj.startInd,obj.endInd);
				index++;
			}
		}
		else
		{
			if(completeCall != null)
			{
				completeCall.apply(owner,[params]);
			}

			completeCall = null;
			owner = null;
			params = null;
			list = null;
			playCount = null;
			index = null;
			check = null;
			play = null;
			remove = null;
		}
	}

	function play(plistKey,startInd,endInd)
	{
		var cache = {};
		var sprite = new cc.Sprite();
		var animation = new cc.Animation();
		var runningAction = new cc.Animate();
		if(attr != null && attr != undefined)
		{
			sprite.attr(attr);
		}
		if(TextureAnimation.cacheDic[plistKey] == null)
		{
			cc.spriteFrameCache.addSpriteFrames(plistKey);

			var animFrames = [];
			for (var i = startInd; i <= endInd; i++)
			{
				var str = keyName + i + ".png";
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animFrames.push(frame);
			}

			animation.initWithSpriteFrames(animFrames,delay,1);
			runningAction.initWithAnimation(animation);
			sprite.runAction(cc.sequence(runningAction,cc.callFunc(remove,this)));
			cache.animFrames = animFrames;
			TextureAnimation.cacheDic[plistKey] = cache;
		}
		else
		{
			cache = TextureAnimation.cacheDic[plistKey];
			animation.initWithSpriteFrames(cache.animFrames,delay,1);
			runningAction.initWithAnimation(animation);
			sprite.runAction(cc.sequence(runningAction,cc.callFunc(remove,this)));
		}

		parent.addChild(sprite);
	}
};


/**
 * 播放动画从多张图片
 * @parent 			添加动画的容器
 * @attr			动画属性({x:200, y:200,rotationX:-17,scaleX:0.8})
 * @key  			动画节点名称
 * @startInd 		节点数字开始下标
 * @endInd			节点数字结束下标
 * @delay			动画播放间隔(秒)
 * @count    		播放次数(-1为无限播放)
 * @completeCall 	播放完成回调(垃圾底层不提供回调，只能以时间判断了)
 * @owner			传this就可以了
 * @params			参数
 */
TextureAnimation.playAnimationForImage = function(parent,attr,key,startInd,endInd,delay,count,completeCall,owner,params)
{
	var sprite = new cc.Sprite();
	parent.addChild(sprite);
	var animation = cc.Animation.create();
	for( var i = startInd; i <= endInd; i++)
	{
		var str = key + i + ".png";
		animation.addSpriteFrameWithFile(str);
	}

	animation.setDelayPerUnit(delay);
	animation.setLoops(count);

	var action = cc.Animate.create(animation);
	if(attr != null && attr != undefined)
	{
		sprite.attr(attr);
	}
	if(completeCall != null)
	{
		sprite.runAction(cc.sequence(action,cc.callFunc(completeCall,owner,params)));
	}
	else
	{
		sprite.runAction(action);
	}

	return sprite;
};

/**
 * 清除
 */
TextureAnimation.clear = function()
{
	for(var key in TextureAnimation.cacheDic)
	{
		cc.spriteFrameCache.removeSpriteFramesFromFile(key);
		delete TextureAnimation.cacheDic[key];
	}
};