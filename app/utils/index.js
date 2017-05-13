const whitespace = "[\\x20\\t\\r\\n\\f]";
const rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" );

module.exports = {
    trim:function(text){
        return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
    }
};