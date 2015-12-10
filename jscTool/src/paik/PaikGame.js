function PaikGame() {
    this.ctor.apply(this, arguments);
};

PaikGame.prototype =
{
    txt: null,
    stage: null,
    bm: null,
    sp: null,
    input: null,
    ctor: function () {
        flower.StageCocos2DX.start();
        var stage = flower.StageCocos2DX.getInstance();
        this.stage = stage;


        //trace("cc.TextFieldTTF.textFieldWithPlaceHolder",cc.TextFieldTTF);
        //trace("cc.TextFieldTTF.textFieldWithPlaceHolder",cc.TextFieldTTF);
        //for(var key in cc.TextFieldTTF){
        //    trace(key," : " + cc.TextFieldTTF[key])
        //}
        //return;


        this.stage.addChild(this.sp = flower.DisplayObjectContainer.create());
        this.bm = flower.Bitmap.create("res/mm.png");
        this.sp.addChild(this.bm);
        this.bm.x = this.bm.y = 200;



        //this.input = flower.InputTextField.create(24, 0xff0000, 100, 30);
        //this.input.setText("就是个测试而已");
        //this.sp.addChild(this.input);
        //this.input.setPosition2(100, 100);
        //this.input.anchorX = 0;
        //this.input.anchorY = 0;

        //flower.Tween.to(this.input,5,{x:300,y:300},flower.Ease.LINE);

        this.sp.addEventListener(flower.MouseEvent.CLICK, this.click, this);
        //this.bm.x = 100;
        //this.bm.y = 200;
        //this.bm.anchorX = 0;
        //this.bm.anchorY = 0;
        //var txt = flower.TextField.create("AAA", 24, 0xff0000);
        //txt.addEventListener(flower.MouseEvent.CLICK, this.click, this);
        //stage.addChild(txt);
        //txt.setPosition2(100, 100);
        //this.txt = txt;
    },
    loadComplete: function (event) {
        var loader = event.currentTarget;
        loader.data.delCount();
    },
    click: function (e) {
        trace("click", e.mouseX, e.mouseY);

        if (this.sp) {
            this.sp.dispose();
        }
        this.stage.addChild(this.sp = flower.DisplayObjectContainer.create());

        this.input = flower.InputTextField.create(24, 0xff0000, 150, 30);
        this.input.setText("就是个测试而已");
        this.sp.addChild(this.input);
        this.input.setPosition2(100, 100);

        this.sp.addEventListener(flower.MouseEvent.CLICK, this.click, this);
    }
};

PaikGame.run = function () {
    new PaikGame();
};
PaikGame.extend = extendClass;