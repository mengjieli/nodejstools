/*
 * 字典类
 * 2015年5月11日 11:35:59
 */
var Dictionary = cc.Class.extend({
	
	list:null,
	length:null,
	
	ctor:function()
	{
		this.length = 0;
		this.list = {};
	},
	
	hasKey:function(key)
	{
		if(this.list[key] == undefined || this.list[key] == null)
		{
			return false;
		}
		
		return true;
	},

	getValue:function(key)
	{
		return this.list[key];
	},
	
	push:function(key,value)
	{
		if(this.hasKey(key) == false)
		{
			this.length++;
			this.list[key] = value;
		}
	},
	
	remove:function(key)
	{
		if(this.hasKey(key) == true)
		{
			this.length--;
			delete this.list[key];
		}
		
		if(this.length < 0)
		{
			this.length = 0;
		}
	},

	removeAll:function()
	{
		for(var key in this.list)
		{
			this.remove(key);
		}
	},
	
	destroy:function()
	{
		this.list = null;
		this.length = null;
	},
	
});