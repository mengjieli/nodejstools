/**
 * Created by huitao on 2015/5/10.
 */

module as3
{
    export class Shape extends egret.Shape
    {

        public transform:as3.Transform ;

        constructor()
        {
            super();
            this.transform = new as3.Transform();
            this.transform.owner = this;
            this.transform._matrix = this.__hack_local_matrix;

        }
    }
}