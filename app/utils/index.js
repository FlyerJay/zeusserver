const whitespace = "[\\x20\\t\\r\\n\\f]";
const rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" );

module.exports = {
    trim:function(text){
        return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
    },
    getCurrentDate:function(gutter=""){
        return String(new Date().getFullYear())+ gutter +String((new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1))+gutter+String(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
    },
    getLand(start,end){
        var s = -1;
        var n = -1;
        this.landArray.map((v,i) => {
            s == -1 ? (Number(v) >= Number(start) ? s = i : s = -1) : '';
            n == -1 ? (Number(v) > Number(end) ? n = i : n = -1) : '';
        })
        return this.landArray.slice(s,n).join(' ');
    },
    landArray:[
        '0.55',
        '0.6',
        '0.7',
        '0.75',
        '0.8',
        '0.85',
        '0.9',
        '0.8',
        '0.9',
        '0.95',
        '1.0',
        '1.1',
        '1.2',
        '1.3',
        '1.35',
        '1.4',
        '1.5',
        '1.6',
        '1.7',
        '1.8',
        '1.9',
        '2.0',
        '2.2',
        '2.3',
        '2.5',
        '2.75',
        '3.0',
        '3.25',
        '3.5',
        '3.75',
        '4.0',
        '4.25',
        '4.5',
        '4.75',
        '5.0',
        '5.5',
        '5.75',
        '6.0',
        '7.5',
        '7.75',
        '8.0',
        '8.75',
        '9.5',
        '9.75',
        '10.0',
        '11.5',
        '11.75',
        '12.0',
        '13.5',
        '13.75',
        '14.0',
        '15.5',
        '15.75',
        '16.0',
        '30.25',
    ]
};