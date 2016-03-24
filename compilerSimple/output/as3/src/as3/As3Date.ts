/**
 * Created by huitao on 2015/5/8.
 */
module as3
{
    /**
     * 日期类
     */
    export class As3Date
    {
        private _date:Date;

        /**按照本地时间返回 Date 对象所指定的表示月中某天的值（1 到 31 之间的一个整数）。 Date*/
            //date : number
        public get date():number
        {
            return this._date.getDate();
        }

        public set date(val:number)
        {
            this._date.setDate(val);
        }

        /**    按照通用时间 (UTC) 返回 Date 对象中的日期值（1 到 31 之间的一个整数）。 Date*/
            //dateUTC : number
        public get dateUTC():number
        {
            return this._date.getUTCDate();
        }

        public set dateUTC(val:number)
        {
            this._date.setUTCDate(val);
        }

        /** [read-only] 按照本地时间返回该 Date 所指定的星期值（0 代表星期日，1 代表星期一，依此类推）。 Date*/
            //day : number
        public get day():number
        {
            return this._date.getDay();
        }

        public set day(val:number)
        {
            this._date.setDate(val)
        }

        /**  [read-only] 按照通用时间 (UTC) 返回该 Date 中的星期值（0 代表星期日，1 代表星期一，依此类推）。 Date*/
            //dayUTC : number
        public get dayUTC():number
        {
            return this._date.getUTCDay();
        }

        public set dayUTC(val:number)
        {
            this._date.setUTCDate(val)
        }

        /**按照本地时间返回 Date 对象中的完整年份值（一个 4 位数，例如 2000）。 Date*/
            //fullYear : number
        public get fullYear():number
        {
            return this._date.getFullYear();
        }

        public set fullYear(val:number)
        {
            this._date.setFullYear(val);
        }

        /**按照通用时间 (UTC) 返回 Date 对象中的四位数年份值。 Date*/
            //fullYearUTC : number
        public get fullYearUTC():number
        {
            return this._date.getUTCFullYear();
        }

        public set fullYearUTC(val:number)
        {
            this._date.setUTCFullYear(val);
        }

        /**按照本地时间返回 Date 对象中一天的小时值（0 到 23 之间的一个整数）。 Date*/
            //hours : number
        public get hours():number
        {
            return this._date.getHours();
        }

        public set hours(val:number)
        {
            this._date.setHours(val);
        }


        /**按照通用时间 (UTC) 返回 Date 对象中一天的小时值（0 到 23 之间的一个整数）。 Date*/
            //hoursUTC : number
        public get hoursUTC():number
        {
            return this._date.getUTCHours();
        }

        public set hoursUTC(val:number)
        {
            this._date.setUTCHours(val);
        }

        /**按照本地时间返回 Date 对象中的毫秒值（0 到 999 之间的一个整数）部分。 Date*/
            //milliseconds : number
        public get milliseconds():number
        {
            return this._date.getMilliseconds();
        }

        public set milliseconds(val:number)
        {
            this._date.setMilliseconds(val);
        }


        /**按照通用时间 (UTC) 返回 Date 对象中的毫秒值（0 到 999 之间的一个整数）部分。 Date*/
            //millisecondsUTC : number

        public get millisecondsUTC():number
        {
            return this._date.getUTCMilliseconds();
        }

        public set millisecondsUTC(val:number)
        {
            this._date.setUTCMilliseconds(val);
        }
        /**按照本地时间返回 Date 对象的分钟值（0 到 59 之间的一个整数）部分。 Date*/
            //minutes : number
        public get minutes():number
        {
            return this._date.getMinutes();
        }

        public set minutes(val:number)
        {
            this._date.setMinutes(val);
        }



        /**按照通用时间 (UTC) 返回的 Date 对象的分钟值（0 到 59 之间的一个整数）部分。 Date*/
            //minutesUTC : Number
        public get minutesUTC():number
        {
            return this._date.getUTCMinutes();
        }

        public set minutesUTC(val:number)
        {
            this._date.setUTCMinutes(val);
        }

        /**按照本地时间返回 Date 对象的月份值（0 代表一月，1 代表二月，依此类推）。 Date*/
            //month : number
        public get month():number
        {
            return this._date.getMonth()
        }

        public set month(val:number)
        {
            this._date.setMonth(val);
        }


        /**按照通用时间 (UTC) 返回的 Date 对象的月份值（0 [1 月] 到 11 [12 月]）部分。 Date*/
            //monthUTC : number
        public get monthUTC():number
        {
            return this._date.getUTCMonth();
        }

        public set monthUTC(val:number)
        {
            this._date.setUTCMonth(val);
        }

        /**按照本地时间返回 Date 对象的秒值（0 到 59 之间的一个整数）。 Date*/
            //seconds : number
        public get seconds():number
        {
            return this._date.getSeconds();
        }

        public set seconds(val:number)
        {
            this._date.setSeconds(val);
        }

        /**按照通用时间 (UTC) 返回的 Date 对象的秒值（0 到 59 之间的一个整数）部分。 Date*/
            //secondsUTC : number
        public get secondsUTC():number
        {
            return this._date.getUTCMonth();
        }

        public set secondsUTC(val:number)
        {
            this._date.setUTCSeconds(val);
        }

        /**Date 对象中自 1970 年 1 月 1 日午夜（通用时间）以来的毫秒数。 Date*/
            //time : number
        public get time():number
        {
            return this._date.getTime();
        }

        public set time(val:number)
        {
            this._date.setTime(val);
        }


        /**[read-only] 计算机的本地时间和通用时间 (UTC) 之间的差值（以分钟为单位）。*/
//        timezoneOffset : number
        public timezoneOffset():number
        {
            return 0;
        }



        public constructor(yearOrTimevalue?:Object, month?:number, date:number = 1, hour:number = 0, minute:number = 0, second:number = 0, millisecond:number = 0)
        {
            this._date = new Date();
//            yearOrTimevalue, month, date, hour, minute, second, millisecond
//            if((yearOrTimevalue != null || yearOrTimevalue != undefined) && month == undefined && date == 1 &&  hour == 0 && minute == 0 && second == 0 && millisecond == 0 )
//            {
//
//                this._date.setTime(<number>yearOrTimevalue);
//            }
//            if(yearOrTimevalue > -1 && yearOrTimevalue < 100)
//            {
//            	this._date.setFullYear(1900+yearOrTimevalue,month,date);
//			}
//
//            if()
//            {
//
//            }
//
//            this._date.setHours(hour,minute,second)
        }

        public getDate():number
        {
            return this._date.getDate();
        }

        /**
         * 按照本地时间返回该 Date 所指定的星期值（0 代表星期日，1 代表星期一，依此类推）。 Date
         * @returns {number}
         */
        public getDay():number
        {
            return this._date.getDay();
        }


        /**
         * 按照本地时间返回 Date 对象中的完整年份值（一个 4 位数，如 2000）。 Date
         * @returns {number}
         */
        public getFullYear():number
        {
            return this._date.getFullYear();
        }

        /**
         * 按照本地时间返回 Date 对象中一天的小时值（0 到 23 之间的一个整数）部分。 Date
         * @returns {number}
         */
        public getHours():number
        {
            return this._date.getHours();
        }


        /**
         * 按照本地时间返回 Date 对象中的毫秒值（0 到 999 之间的一个整数）部分。 Date
         * @returns {number}
         */
        public getMilliseconds():number
        {
            return this._date.getMilliseconds();
        }

        /**
         * 按照本地时间返回 Date 对象中的分钟值（0 到 59 之间的一个整数）部分。 Date
         */
        public getMinutes():number
        {
            return this._date.getMinutes();
        }

        /**
         * 按照本地时间返回该 Date 中的月份值（0 代表一月，1 代表二月，依此类推）部分。 Date
         */
        public getMonth():number
        {
            return this._date.getMonth();
        }

        /**
         * 按照本地时间返回 Date 对象中的秒值（0 到 59 之间的一个整数）部分。 Date
         */
        public getSeconds():number
        {
            return this._date.getSeconds();
        }

        /**
         * 按照通用时间返回 Date 对象中自 1970 年 1 月 1 日午夜以来的毫秒数。 Date
         */
        public getTime():number
        {
            return this._date.getTime();
        }

        /**
         *  以分钟为单位，返回计算机的本地时间和通用时间 (UTC) 之间的差值。 Date
         */
        public getTimezoneOffset():number
        {
            return 0;
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中表示月中某天的值（1 到 31 之间的一个整数）。 Date
         * @returns {number}
         */
        public getUTCDate():number
        {
            return this._date.getUTCDate();
        }


        /**
         * 按照通用时间 (UTC) 返回该 Date 中表示星期的值（0 代表星期日，1 代表星期一，依此类推）。 Date
         */
        public getUTCDay():number
        {
            return this._date.getUTCDate();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中的四位数年份值。 Date
         * @returns {number}
         */
        public getUTCFullYear():number
        {
            return this._date.getUTCFullYear();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中一天的小时值（0 到 23 之间的一个整数）。 Date
         */
        public getUTCHours():number
        {
            return this._date.getUTCHours();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中的毫秒值（0 到 999 之间的一个整数）部分。 Date
         * @returns {number}
         */
        public getUTCMilliseconds():number
        {
            return this._date.getUTCMilliseconds();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中的分钟值（0 到 59 之间的一个整数）部分。 Date
         */
        public getUTCMinutes():number
        {
            return this._date.getUTCMinutes();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中的月份值（0 [一月] 到 11 [十二月]）部分。 Date
         * @returns {number}
         */
        public getUTCMonth():number
        {
            return this._date.getUTCMonth();
        }

        /**
         * 按照通用时间 (UTC) 返回 Date 对象中的秒值（0 到 59 之间的一个整数）部分。 Date
         */
        public getUTCSeconds():number
        {
            return this._date.getUTCSeconds();
        }

        /**
         * [static] 按照 UTC 将表示日期的字符串转换为一个数字，它等于自 1970 年 1 月 1 日起已经过的毫秒数。 Date
         * @param date
         */
        static parse(date:String):number
        {
            //RegExp.exec()

            return 0;
        }


        /**
         * 按照本地时间设置月中的某天，并以毫秒为单位返回新时间。 Date
         * @param day
         */
        public setDate(day:number):number
        {
            this._date.setDate(day);
            return this.date;
        }

        /**
         * 按照本地时间设置年份值，并以毫秒为单位返回新时间。 Date
         * @param year
         * @param month
         * @param day
         */
        public setFullYear(year:number, month:number, day:number):number
        {
            this._date.setFullYear(year,month,day);
            return this.fullYear;
        }

        /**
         * 按照本地时间设置小时值，并以毫秒为单位返回新时间。 Date
         * @param hour
         * @param minute
         * @param second
         * @param millisecond
         * @returns {number}
         */
        public setHours(hour:number, minute:number, second:number, millisecond:number):number
        {
            this._date.setHours(hour,minute,second,millisecond);
            return this.hours;
        }

        /**
         * 按照本地时间设置毫秒值，并以毫秒为单位返回新时间。 Date
         * @param millisecond
         * @returns {number}
         */
        public setMilliseconds(millisecond:number):number
        {
            this._date.setMilliseconds(millisecond);
            return this.milliseconds;
        }

        /**
         * 按照本地时间设置分钟值，并以毫秒为单位返回新时间。 Date
         * @param minute
         * @param second
         * @param millisecond
         * @returns {number}
         */
        public setMinutes(minute:number, second:number, millisecond:number):number
        {
            this._date.setMinutes(minute,second,millisecond);
            return this.minutes;
        }


        /**
         * 按照本地时间设置月份值以及（可选）日期值，并以毫秒为单位返回新时间。 Date
         * @param month
         * @param day
         */
        public setMonth(month:number, day:number):number
        {

            this._date.setMonth(month,day);
            return this.month;
        }

        /**
         * 按照本地时间设置秒值，并以毫秒为单位返回新时间。 Date
         * @param second
         * @param millisecond
         * @returns {number}
         */
        public setSeconds(second:number, millisecond:number):number
        {
            this._date.setSeconds(second,millisecond);
            return this.seconds;
        }

        /**
         * 以毫秒为单位设置自 1970 年 1 月 1 日午夜以来的日期，并以毫秒为单位返回新时间。 Date
         * @param millisecond
         */
        public setTime(millisecond:number):number
        {
            this.time = millisecond;
            return this.time;
        }

        /**
         * 按照通用时间 (UTC) 设置日期值，并以毫秒为单位返回新时间。 Date
         * @param day
         */
        public setUTCDate(day:number):number
        {
            this._date.setUTCDate(day);
            return this.dateUTC;
        }

        /**
         * 按照通用时间 (UTC) 设置年份值，并以毫秒为单位返回新时间。 Date
         * @param year
         * @param month
         * @param day
         */
        public setUTCFullYear(year:number, month:number, day:number):number
        {
            this._date.setUTCFullYear(year,month,day);
            return this.fullYearUTC;
        }

        /**
         * 按照通用时间 (UTC) 设置小时值，并以毫秒为单位返回新时间。 Date
         * @param hour
         * @param minute
         * @param second
         * @param millisecond
         */
        public setUTCHours(hour:number, minute:number, second:number, millisecond:number):number
        {
            this._date.setUTCHours(hour,minute,second,millisecond);
            return this.hoursUTC;
        }


        public setUTCMilliseconds(millisecond:number):number
        {
            this._date.setUTCMilliseconds(millisecond);
            return this.millisecondsUTC;
        }

        /**
         * 按照通用时间 (UTC) 设置分钟值，并以毫秒为单位返回新时间。 Date
         * @param minute
         * @param second
         * @param millisecond
         */
        public setUTCMinutes(minute:number, second:number, millisecond:number):number
        {
            this._date.setUTCMinutes(minute,second,millisecond);
            return this.minutesUTC;
        }

        /**
         * 按照通用时间 (UTC) 设置月份值及（可选）日期值，并以毫秒为单位返回新时间。 Date
         * @param month
         * @param day
         * @returns {number}
         */
        public setUTCMonth(month:number, day:number):number
        {
            this._date.setUTCMonth(month,day);
            return this.minutesUTC;
        }

        /**
         * 按照通用时间 (UTC) 设置秒值以及（可选）毫秒值，并以毫秒为单位返回新时间。 Date
         * @param second
         * @param millisecond
         */
        public setUTCSeconds(second:number, millisecond:number):number
        {

            this._date.setUTCSeconds(second,millisecond);
            return this.secondsUTC;
        }

        /**
         * 仅返回星期值和日期值的字符串表示形式，而不返回时间或时区。 Date
         */
        public toDateString():string
        {
            return this._date.toDateString();
        }

        /**
         * 仅返回星期值和日期值的字符串表示形式，而不返回时间或时区。 Date
         */
        public toLocaleDateString():string
        {
            return this._date.toLocaleDateString();
        }

        /**
         * 按本地时间返回星期值、日期值以及时间的字符串表示形式。 Date
         */
        public toLocaleString():string
        {
            return this._date.toLocaleString();
        }

        /**
         * 仅返回时间的字符串表示形式，而不返回星期值、日期值、年份或时区。 Date
         */
        public toLocaleTimeString():string
        {
            return this._date.toLocaleTimeString();
        }

        /**
         * 返回星期值、日期值、时间和时区的字符串表示形式。 Date
         * @returns {string}
         */
        public toString():string
        {
            return this._date.toString();
        }


        /**
         * 仅返回时间和时区的字符串表示形式，而不返回星期值和日期值。 Date
         */
        public toTimeString():string
        {
            return this._date.toTimeString();
        }

        /**
         * 按照通用时间 (UTC) 返回星期值、日期值以及时间的字符串表示形式。 Date
         */
        public toUTCString():string
        {
            return this._date.toUTCString();
        }

        /**
         * [static] 返回 1970 年 1 月 1 日午夜（通用时间）与参数中指定的时间之间相差的毫秒数。 Date
         * @param year
         * @param month
         * @param date
         * @param hour
         * @param minute
         * @param second
         * @param millisecond
         * @constructor
         */
        static UTC(year:number, month:number, date:number = 1, hour:number = 0, minute:number = 0, second:number = 0, millisecond:number = 0):string
        {

            //Date.UTC();
            return "";
        }

        /**
         * 按照通用时间返回 Date 对象中自 1970 年 1 月 1 日午夜以来的毫秒数。
         */
        public valueOf():number
        {
            return this._date.valueOf();
        }
    }
}
