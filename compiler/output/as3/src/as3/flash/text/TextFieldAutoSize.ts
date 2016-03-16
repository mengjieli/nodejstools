/**
 * Created by huitao on 5/4/2015.
 */
module as3
{
    export class TextFieldAutoSize
    {
        /**
         * [static] 指定将文本视为居中对齐文本。
         * @type {string}
         */
        static CENTER : string = "center"


        /**
         * [static] 指定将文本视为左对齐文本，即文本字段的左侧固定不变，只在右侧调整单行的大小。
         * @type {string}
         */
        static LEFT : string = "left"

        /**
         * [static] 指定不调整大小。
         * @type {string}
         */
        static NONE : string = "none"


        /**
         * [static] 指定将文本视为右对齐文本，即文本字段的右侧固定不变，只在左侧调整单行的大小。
         * @type {string}
         */
        static RIGHT : string = "right"
    }
}
