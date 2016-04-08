/**
 * Created by huitao on 5/4/2015.
 */

module as3
{
    export class TextField extends egret.TextField
    {
        /**
         * 如果设置为 true 且文本字段没有焦点，Flash Player 将以灰色突出显示文本字段中的所选内容。
         */
        private _alwaysShowSelection : boolean;

        public get alwaysShowSelection():boolean
        {
            return this._alwaysShowSelection;
        }

        public set alwaysShowSelection(_value:boolean)
        {
            this._alwaysShowSelection = _value;
        }


        private _antiAliasType : string;
        /**
         * 用于此文本字段的消除锯齿类型。  TextField
         */
        public get antiAliasType():string
        {
            return this._antiAliasType;
        }

        public set antiAliasType(_value:string)
        {
            this._antiAliasType = _value;
        }

        /**
         * 控制文本字段的自动大小调整和对齐。  TextField
         */
        public get autoSize():string
        {
            return this.textAlign;
        }

        public set autoSize(_value:string)
        {
            //this._autoSize = _value;
            this.textAlign = _value;
        }

        //public get background ():boolean
        //{
        //    return this.background;
        //}
        //
        //public set background(_value:boolean)
        //{
        //    this.background = _value;
        //}
        //
        //public get backgroundColor():number
        //{
        //    return this.backgroundColor;
        //}

        /**
         * 文本字段背景的颜色
         * @param _value
         */
        //public set backgroundColor(_value:number)
        //{
        //    this.backgroundColor = _value;
        //}

        /**
         * 指定文本字段是否具有边框。
         */
            //public border : boolean;

        //public get border():boolean
        //{
        //    return this.border;
        //}
        //
        //public set border(_value:boolean)
        //{
        //    this.border = _value;
        //}

        /**
         * 文本字段边框的颜色。
         * @returns {number}
         */
        //public get borderColor():number
        //{
        //    return this.borderColor;
        //}
        //
        //public set borderColor(_value:number)
        //{
        //    this.borderColor = _value;
        //}


        /**
         * [read-only] 一个整数（从 1 开始的索引），指示指定文本字段中当前可以看到的最后一行。  TextField
         */

        public get bottomScrollV():number
        {
            return 0;
        }

        /**
         * [read-only] 插入点（尖号）位置的索引。  TextField
         */
        public get caretIndex():number
        {
            return this.caretIndex;
        }

        public set caretIndex(_value:number)
        {
            this.caretIndex = _value;
        }

        public _condenseWhite : boolean
        //一个布尔值，它指定是否应删除具有 HTML 文本的文本字段中的额外空白（空格、换行符等）。  TextField

        public get condenseWhite():boolean
        {
            return this._condenseWhite;
        }

        public set condenseWhite(_value:boolean)
        {
            this._condenseWhite = _value;
        }


        private _defaultTextFormat : TextFormat;

        /**
         * 指定应用于新插入文本（例如，使用 replaceSelectedText() 方法插入的文本或用户输入的文本）的格式。
         * @returns {null}
         */
        public get defaultTextFormat():TextFormat
        {
            return null;
        }

        public set defaultTextFormat(_value:TextFormat)
        {
            this._defaultTextFormat = _value;
        }

        /**
         * 指定文本字段是否是密码文本字段。
         * @returns {boolean}
         */
        public get displayAsPassword():boolean
        {
            return this.displayAsPassword;
        }

        public set displayAsPassword(_value:boolean)
        {
            this.displayAsPassword = _value;
        }

        private _embedFonts : boolean;
        /**
         * 指定是否使用嵌入字体轮廓进行呈现。
         */
        public get embedFonts():boolean
        {
            return this._embedFonts;
        }

        public set embedFonts(_value:boolean)
        {
            this._embedFonts = _value;
        }

        /**
         * 用于此文本字段的网格固定类型。  TextField
         */
        private _gridFitType : string


        public get gridFitType():string
        {
            return this._gridFitType;
        }

        public set gridFitType(_value:string)
        {
            this._gridFitType = _value;
        }

        // 包含文本字段内容的 HTML 表示形式。 TextField
        public get htmlText():string
        {
            return this._htmlTxt;
        }

        private _htmlTxt:string ;
        public set htmlText(_value:string)
        {
            this._htmlTxt = _value;
            var html:egret.HtmlTextParser = new egret.HtmlTextParser();
            var arr:Array<egret.ITextElement> = html.parser(_value);
            this.textFlow = arr;
        }

        //   [read-only] 文本字段中的字符数。  TextField
        public get length():number
        {
            return this.text.length;
        }

        //文本字段中最多可包含的字符数（即用户输入的字符数）。  TextField
        public get maxChars():number
        {
            return this.maxChars;
        }
        public set maxChars(_value:number)
        {
            this.maxChars = _value;
        }


        private _maxScrollH : number;
        public get maxScrollH():number
        {
            return this._maxScrollH;
        }

        public set maxScrollH(_value:number)
        {
            this._maxScrollH = _value;
        }

        //   [read-only] scrollH 的最大值。 TextField
        //private _maxScrollV : number

        //    [read-only] scrollV 的最大值。 TextField
        public get maxScrollV():number
        {
            return this.maxScrollV;
        }

        public set maxScrollV(_value:number)
        {
            this.maxScrollV = _value;
        }




        private _mouseWheelEnabled : boolean;
        //一个布尔值，指示当用户单击某个文本字段且用户滚动鼠标滚轮时，Flash Player 是否应自动滚动多行文本字段。  TextField
        public get mouseWheelEnabled():boolean
        {
            return this._mouseWheelEnabled;
        }

        public set mouseWheelEnabled(_value:boolean)
        {
            this._mouseWheelEnabled = _value;
        }

        //指示文本字段是否为多行文本字段。
        //public get multiline():boolean
        //{
        //    return this.multiline;
        //}
        //
        //public set multiline(_value:boolean)
        //{
        //    this.multiline = _value;
        //}

        //     [read-only] 定义多行文本字段中的文本行数。  TextField
        public get numLines():number
        {
            return this.numLines;
        }

        private _restrict : string;
        /**
         * 指示用户可输入到文本字段中的字符集。
         */
        public get restrict():string
        {
            return this._restrict;
        }

        public set restrict(_value:string)
        {
            this._restrict = _value;
        }

        //public scrollH : number
        //当前水平滚动位置。  TextField
        public get scrollH():number
        {
            return 0;
        }

        //文本在文本字段中的垂直位置。  TextField
        public get scrollV():number
        {
            return this.scrollV;
        }

        public set scrollV(_value:number)
        {
            this.scrollV = _value;
        }

        private _selectable : boolean;

        //一个布尔值，指示文本字段是否可选。  TextField
        public get selectable():boolean
        {
            return this._selectable;
        }
        public set selectable(_value:boolean)
        {
            this._selectable = _value;
        }

        //    [read-only] 当前所选内容中第一个字符从零开始的字符索引值。  TextField
        public get selectionBeginIndex():number
        {
            return this.selectionBeginIndex;
        }

        //    [read-only] 当前所选内容中最后一个字符从零开始的字符索引值。  TextField
        public get selectionEndIndex():number
        {
            return this.selectionEndIndex;
        }
        private _sharpness : number
        //此文本字段中字型边缘的清晰度。  TextField
        public get sharpness():number
        {
            return this._sharpness;
        }

        public set sharpness(_value:number)
        {
            this._sharpness = _value;
        }

        private _styleSheet : StyleSheet;

        public get styleSheet():StyleSheet
        {
            return this._styleSheet;
        }

        //将样式表附加到文本字段。  TextField
        public set styleSheet(_value:StyleSheet)
        {
            this._styleSheet = _value;
        }

        //作为文本字段中当前文本的字符串。  TextField
        //public get text():string
        //{
        //    return this.text;
        //}
        //
        //public set text(_value:string)
        //{
        //    this.text = _value;
        //}

        //文本字段中文本的颜色（采用十六进制格式）。  TextField
        //public get textColor():number
        //{
        //
        //    return this.textColor;
        //}
        //
        //public set textColor(_value:number)
        //{
        //    this.textColor = _value;
        //}


        //    [read-only] 文本的高度，以像素为单位。 TextField
        public get textHeight():number
        {
            return this.textHeight ;
        }

        private _thickness : number
        //此文本字段中字型边缘的粗细。  TextField
        public get thickness():number
        {
            return this._thickness ;
        }

        public set thickness(_value:number)
        {
            this._thickness = _value;
        }

        /**
         * 文本字段的类型。  TextField
         * @returns {string}
         */
        //public get type():string
        //{
        //    return this.type;
        //}
        //
        //public set type(_value:string)
        //{
        //    this.type = _value;
        //}




        /**
         * 指定在复制和粘贴文本时是否同时复制和粘贴其格式。
         */
        private _useRichTextClipboard : boolean;

        public get useRichTextClipboard():boolean
        {
            return this._useRichTextClipboard;
        }

        public set useRichTextClipboard(_value:boolean)
        {
            this._useRichTextClipboard = _value;
        }

        /**
         * 指示显示对象的宽度，以像素为单位。 DisplayObject
         */

        //public get width():number
        //{
        //    return this.width;
        //}
        //
        //public set width(_value:number)
        //{
        //    this.width = _value;
        //}

        /**
         * 一个布尔值，指示文本字段是否自动换行。
         */
        private _wordWrap : boolean;

        public get wordWrap():boolean
        {
            return this._wordWrap;
        }

        public set wordWrap(_value:boolean)
        {
            this._wordWrap = _value;
        }

        constructor()
        {
            super();
        }


        /**
         *  将 newText 参数指定的字符串追加到文本字段的文本的末尾。 TextField
         * @param newText
         */
        //public appendText(newText:string):void
        //{
        //    this.appendText(newText);
        //}


        /**
         * 返回一个矩形，该矩形是字符的边框。 TextField
         * @param charIndex
         */
        public getCharBoundaries(charIndex:number):egret.Rectangle
        {
            return null;
        }

        /**
         * 在 x 和 y 参数指定的位置返回从零开始的字符索引值。 TextField
         * @param x
         * @param y
         * @returns {number}
         */
        public getCharIndexAtPoint(x:Number, y:Number):number
        {
            return 0;
        }

        /**
         * 如果给定一个字符索引，则返回同一段落中第一个字符的索引。 TextField
         * @param charIndex
         * @returns {number}
         */
        public getFirstCharInParagraph(charIndex:number):number
        {
            return 0;
        }

        /**
         * 返回给定 id 或已使用 <img> 标签添加到 HTML 格式文本字段中的图像或 SWF 文件的 DisplayObject 引用。 TextField
         * @param id
         * @returns {null}
         */
        public getImageReference(id:string):egret.DisplayObject
        {
            return null;
        }

        /**
         * 在 x 和 y 参数指定的位置返回从零开始的行索引值。
         * @param x
         * @param y
         */
        public getLineIndexAtPoint(x:number, y:number):number
        {
            return 0;
        }

        /**
         * 返回 charIndex 参数指定的字符所在的行的索引值（从零开始）。
         * @param charIndex
         * @returns {number}
         */
        public getLineIndexOfChar(charIndex:number):number
        {
            return 0;
        }

        /**
         * 返回特定文本行中的字符数。 TextField
         * @param lineIndex
         * @returns {number}
         */
        public getLineLength(lineIndex:number):number
        {
            return 0;
        }

        /**
         * 返回给定文本行的度量信息。 TextField
         * @param lineIndex
         */
        public getLineMetrics(lineIndex:number):as3.TextLineMetrics
        {
            return null;
        }

        /**
         * 返回 lineIndex 参数指定的行中第一个字符的字符索引。
         * @param lineIndex
         * @returns {number}
         */
        public getLineOffset(lineIndex:number):number
        {
            return 0;
        }

        /**
         * 返回 lineIndex 参数指定的行的文本。 TextField
         * @param lineIndex
         */
        public getLineText(lineIndex:number):string
        {
            return null;
        }

        /**
         * 如果给定一个字符索引，则返回包含给定字符的段落的长度。
         * @param charIndex
         * @returns {number}
         */
        public getParagraphLength(charIndex:number):number
        {
            return 0;
        }


        /**
         * 返回 TextFormat 对象，其中包含 beginIndex 和 endIndex 参数指定的文本范围的格式信息。
         * @param beginIndex
         * @param endIndex
         * @returns {null}
         */
        public getTextFormat(beginIndex:number = -1, endIndex:number = -1):TextFormat
        {
            return null;
        }

        /**
         * 使用 value 参数的内容替换当前所选内容。
         * @param value
         */
        public replaceSelectedText(value:string):void
        {

        }

        /**
         * 使用 newText 参数的内容替换 beginIndex 和 endIndex 参数指定的字符范围。 TextField
         * @param beginIndex
         * @param endIndex
         * @param newText
         */
        public replaceText(beginIndex:number, endIndex:number, newText:string):void
        {
            console

        }

        /**
         * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
         * @param beginIndex
         * @param endIndex
         */
        public setSelection(beginIndex:number, endIndex:number):void
        {
            this._setSelection(beginIndex,endIndex);
        }

        /**
         * 将 format 参数指定的文本格式应用于文本字段中的指定文本。
         * @param format
         * @param beginIndex
         * @param endIndex
         */
        public setTextFormat(format:TextFormat, beginIndex:number = -1, endIndex:number = -1):void
        {
            if(format.font != null)
            {
                this.fontFamily =  format.font;
            }
            if(format.size != null)
            {
                this.size = format.size;
            }
            if(format.color != null)
            {
                this.textColor = format.color;
            }
            if(format.bold != null)
            {
                this.bold = format.bold;
            }
            if(format.italic != null)
            {
                this.italic = format.italic;
            }
            //this.underline = format.underline;
            //this.url = format.url;
            //this.target = format.target;
            if(format.align != null)
            {
                this.autoSize = format.align;
            }
            //this.leftMargin = format.leftMargin;
            //this.rightMargin = format.rightMargin;
            //this.indent = format.indent;
            if(format.leading != null)
            {
                this.lineSpacing = format.leading;
            }
        }

    }
}

