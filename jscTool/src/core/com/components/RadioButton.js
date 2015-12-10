/**
 * Created by zhouyulong on 2015/5/21.
 * 单选按钮
 */
var RadioButton = Component.extend({

    button:null,
    index:null,//下标
    _selected:null,//是否选中
    _normalImage:null,
    _selectedImage:null,
    _texType:null,

    /**
     * @button          ccui.Button
     * @normalImage    正常状态图片路径
     * @selectedImage  选中状态图片路径
     * @texType         ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE
     */
    ctor:function(button,normalImage, selectedImage, texType)
    {
        this._super();

        this.button = button;
        this._normalImage = normalImage;
        this._selectedImage = selectedImage;
        this._texType = texType;

        this.initUI();
    },

    initUI:function()
    {
        this._selected = false;
        this.button.touchEnabled = true;
        //让正常跟按下一样目的为了以后选择
        if(this._texType == null || this._texType == undefined)
        {
            this._texType = ccui.Widget.LOCAL_TEXTURE;
        }
        this.button.loadTextureNormal(this._normalImage, this._texType);
        this.button.loadTexturePressed(this._normalImage, this._texType);
        this.button.addTouchEventListener(this.touchEventHandler, this);
    },

    setSelected:function(selected)
    {
        if(selected == this._selected)
        {
            return;
        }
        if(selected != null && selected != undefined)
        {
            this._selected = selected;
        }
        else
        {
            this._selected = !this._selected;
        }

        if(this._selected == false)
        {
            this.button.loadTextureNormal(this._normalImage, this._texType);
        }
        else
        {
            this.button.loadTextureNormal(this._selectedImage, this._texType);
        }
    },

    touchEventHandler:function(node,type)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            NodeUtils.playButtonSoundEffect();
            if(this._callBack != null)
            {
                this._callBack.apply(this._owner,[node,type,this]);
            }
        }
    },

    destroy:function()
    {
        this._super();
        
        this.button = null;
        this._selected = null;
        this._normalImage = null;
        this._selectedImage = null;
        this._texType = null;
        this.index = null;
    },
});
