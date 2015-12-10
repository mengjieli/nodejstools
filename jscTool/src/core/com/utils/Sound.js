/*
 * 声音
 * 2015年5月4日 11:55:58
 */
var Sound = cc.Class.extend({

})

Sound.audioID;//当前播放音效ID

Sound.playSound = function (url,loop)
{
	if(url == undefined || GameConfig.StopSound == true)
	{
		return;
	}
	if(loop == undefined || loop == null)
	{
		loop = false;
	}

	Sound.audioID = cc.audioEngine.playEffect(url,loop);
	//Sound.audioID = cc.AudioEngine.getInstance().playEffect(url,loop);
};

Sound.stopSound = function ()
{
	if(Sound.audioID == undefined || Sound.audioID == null)
	{
		return;
	}
	cc.AudioEngine.getInstance().stopEffect(Sound.audioID);
};

