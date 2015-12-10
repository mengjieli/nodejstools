/**
 * Created by Administrator on 2015/10/8.
 * 场景静态对象
 */


var StaticObject = ObjectBase.extend({

    _sprite:null,
    ctor:function()
    {
        this._super();
    },

    initConfig:function( configData )
    {
        this._configId = configData.id;
        var userId = this._configId + "" + configData.x + "" + configData.y;
        this.setID( userId );
        this.createShow( configData );

        this.setObjectType( ObjectType.STATIC );
        this.setObjectLayer( configData.isBj ? ObjectLayerType.BACKGROUND : ObjectLayerType.STATICOBJECT );

    },

    createShow:function( configData )
    {
        if( configData == null )return;
        this.removeAllChildren();

        this._sprite = null;

        var pos = cc.p( configData.x, configData.y );
        var img = "#map_static_" + configData.id + ".png";
        var sp = new cc.Sprite(img);
        sp.setAnchorPoint(0,0);
        sp.setPosition( pos );
        sp.setRotation( configData.rotation );
        sp.setScaleX( configData.scaleX  );
        sp.setScaleY( configData.scaleY );
        sp.setOpacity( configData.opacity * 255 );

        this.addChild( sp );
        this._sprite = sp;
    },

    updateConfig:function( configData )
    {
        this._configId = configData.id;
        var userId = this._configId + "" + configData.x + "" + configData.y;
        this.setID( userId );
        this.createShow( configData );

        if( this._sprite )
        {
            this._sprite.setPosition( pos );
            this._sprite.setRotation( configData.rotation )
            this._sprite.setScaleX( configData.scaleX * 2 );
            this._sprite.setScaleY( configData.scaleY * 2 );
            this._sprite.setOpacity( configData.opacity * 255 );
        }
        else
        {
            this.createShow( configData );
        }
    }

});