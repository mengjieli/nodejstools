/**
 * Created by huitao on 2015/5/9.
 */
module as3
{
    export class AccessibilityProperties
    {
        /**在呈现辅助功能时为该显示对象提供一个说明。  AccessibilityProperties*/
        public description : string;

        /** 如果为 true，则会导致 Flash® Player 在呈现辅助功能时排除该显示对象内的子对象。 AccessibilityProperties*/
        public forceSimple : boolean;

        /**在呈现辅助功能时为该显示对象提供一个名称。  AccessibilityProperties*/
        public name : string;

        /**如果为 true，则禁用 Flash Player 的默认自动标签系统。 AccessibilityProperties*/
        public noAutoLabeling : boolean

        /**指出与该显示对象关联的快捷键。  AccessibilityProperties*/
        public shortcut : string;

        /**如果为 true，则在呈现辅助功能时排除该显示对象。*/
        public silent : boolean;

        constructor()
        {

        }
    }
}
