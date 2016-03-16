/**
 * Created by huitao on 5/4/2015.
 */
module as3
{
    export class TextFormat
    {
        /**
         * 指示段落的对齐方式。 有效值为 TextFormatAlign 常数。
         * 默认值为 TextFormatAlign.LEFT.
         */
        public align:string = as3.TextFormatAlign.LEFT;

        /**指示块缩进，以像素为单位。 块缩进应用于整个文本块，即文本的所有行。 而普通缩进 (TextFormat.indent) 只影响各段的第一行。 如果此属性为 null，则 TextFormat 对象不指定块缩进（块缩进为 0）。 */
        public blockIndent:Object = null;

        /**
         *指定文本是否为粗体字。 默认值为 null，这意味着不使用粗体字。 如果值为 true，则文本为粗体字。
         */
        public bold:any = null;

        /**
         * 指示文本为带项目符号的列表的一部分。 在带项目符号的列表中，文本的各段都是缩进的。 项目符号显示在各段第一行的左侧。 默认值为 null，这意味着不使用带项目符号的列表。
         * @type {null}
         */
        public bullet:any = null;


        /**
         * 指示文本的颜色。 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。 默认值为 null，这意味着 Flash Player 使用黑色 (0x000000)
         */
        public color:any = null;

        /**
         * 使用此文本格式的文本的字体名称，以字符串形式表示。 默认值为 null，这意味着 Flash Player 对文本使用 Times New Roman 字体。
         * @type {null}
         */
        public font:any = null;

        /**
         * 指示从左边距到段落中第一个字符的缩进。 默认值为 null，它指示不使用缩进。
         * @type {null}
         */
        public indent:any = null;

        /**
         * 指示使用此文本格式的文本是否为斜体。 默认值为 null，这意味着不使用斜体。
         * @type {null}
         */
        public italic:any = null;


        /**
         * 一个布尔值，指示是启用 (true) 还是禁用 (false) 字距调整。 通过字距调整可为了提高可读性而调整某些字符对之间的像素，并且只在需要时（如使用大字体标题时）使用字距调整。 仅嵌入字体支持字距调整。
         *某些字体（如宋体）和等宽字体（如 Courier New）不支持字距调整。
         * 默认值为 null，这意味着没有启用字距调整。
         * @type {null}
         */
        public kerning:any = null;


        /**
         * 一个整数，表示行与行之间的垂直间距（称为前导）量。 默认值为 null，它指示使用的前导量为 0。
         * @type {null}
         */
        public leading:any = null;


        /**
         * 段落的左边距，以像素为单位。 默认值为 null，它指示左边距为 0 像素。
         * @type {null}
         */
        public leftMargin:any = null;

        /**
         * 段落的右边距，以像素为单位。 默认值为 null，它指示右边距为 0 像素。
         * @type {null}
         */
        public letterSpacing:any = null;

        /**
         * 段落的右边距，以像素为单位。 默认值为 null，它指示右边距为 0 像素。
         * @type {null}
         */
        public rightMargin:any = null;

        /**
         * 使用此文本格式的文本的磅值。 默认值为 null，这意味着使用的磅值为 12。
         * @type {null}
         */
        public size:any = null;

        /**
         * 将自定义 Tab 停靠位指定为一个非负整数的数组。指定每个 Tab 停靠位，以像素为单位。如果没有指定自定义 Tab 停靠位 (null)，则默认的 Tab 停靠位为 4（平均字符宽度）。
         * @type {null}
         */
        public tabStops:Array<any> = null;

        /**
         * 表示显示超链接的目标窗口。如果目标窗口为空字符串，则文本显示在默认目标窗口 _self 中。可以选择自定义名称或以下四种名称中的一个：_self 指定当前窗口中的当前帧，_blank 指定一个新窗口，_parent 指定当前帧的父级，_top 指定当前窗口中的顶级帧。如果 TextFormat.url 属性是空字符串或 null，则虽然您可以获取或设置此属性，但该属性不起作用。
         * @type {string}
         */
        public target:string = "";


        /**
         * 表示使用此文本格式的文本是带下划线 (true) 还是不带下划线 (false)。此下划线类似于用 <U> 标签生成的下划线，但后者不是真正的下划线，因为它不能正确地跳过下行字符。默认值为 null，它表示不使用下划线。
         * @type {null}
         */
        public underline:any = null;


        /**
         * 表示使用此文本格式的文本的目标 URL。如果 url 属性为空字符串，则文本没有超链接。默认值为 null，它表示文本没有超链接。
         * 注意：必须使用 htmlText 属性对具有指定文本格式的文本进行设置以使超链接起作用。
         * @type {null}
         */
        public url:string = null;


        constructor(font:string = null, size:any = null, color:any = null, bold:any = null, italic:any = null, underline:any = null, url:string = null, target:string = null, align:string = null, leftMargin:any = null, rightMargin:any = null, indent:any = null, leading:any = null)
        {
            this.font = font;
            this.size = size;
            this.color = color;
            this.bold = bold;
            this.italic = italic;
            this.underline = underline;
            this.url = url;
            this.target = target;
            this.align = align;
            this.leftMargin = leftMargin;
            this.rightMargin = rightMargin;
            this.indent = indent;
            this.leading = leading;
        }
    }

}