/**
 * Created by zhouyulong on 2015/5/21.
 * 单选按钮组
 */
var RadioGroupButton = Component.extend({

    selectBT:null,//当前选中按钮
    selectIndex:null,//当前选中下标(默认从0开始,最先添加的是0依次递推)
    _buttonList:null,
    _selectCall:null,//选中回调
    _childOwner:null,

    ctor:function(selectCall,owner)
    {
        this._super();

        this._selectCall = selectCall;
        this._childOwner = owner;

        this.initUI();
    },

    initUI:function()
    {
        this._buttonList = [];
    },

    /**
     * @button          ccui.Button
     * @normalImage    正常状态图片路径
     * @selectedImage  选中状态图片路径
     * @texType         ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE
     * 添加单选按钮
     */
    addRadioButton:function(button,normalImage, selectedImage, texType)
    {
        var bt = new RadioButton(button,normalImage, selectedImage, texType);
        bt.index = this._buttonList.length;
        this._buttonList.push(bt);
        if(this._buttonList.length == 1)//默认选中第一个
        {
            this.touchEventHandler(bt.button,ccui.Widget.TOUCH_ENDED,bt);
        }
        bt.addTouchEventListener(this.touchEventHandler,this);
    },

    /**
     * 通过下标选中按钮
     */
    setSelectByIndex:function(index)
    {
        var bt = this._buttonList[index];
        if(bt != null)
        {
            this.touchEventHandler(bt.button,ccui.Widget.TOUCH_ENDED,bt);
        }
    },

    /**
     * 设置选中按钮
     */
    setSelectByButton:function(button)
    {
        if(button != null)
        {
            if(this.selectBT != null)
            {
                this.selectBT.setSelected(false);
            }
            button.setSelected(true);
            this.selectBT = button;
            this.selectIndex = this.selectBT.index;
        }
    },

    touchEventHandler:function(node,type,target)
    {
        if(ccui.Widget.TOUCH_ENDED == type)
        {
            this.setSelectByButton(target);
            if(this._selectCall != null)
            {
                this._selectCall.apply(this._childOwner,[node,type,target]);
            }
        }
    },

    destroy:function()
    {
        this._super();

        for(var a = 0; a < this._buttonList.length; a++)
        {
            var bt = this._buttonList[a];
            bt.destroy();
        }

        this.selectBT = null;
        this._buttonList.length = 0;
        this.selectIndex = null;
        this._buttonList = null;
        this._selectCall = null;
        this._childOwner = null;
    },

})
