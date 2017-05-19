'use strict';

module.exports = app => {
    class youfa extends app.Service {
        * YF(options,query) {
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.separateSpecAndPer($2);
            return $3;
        }
        separateSpecAndPer(options){/**分离规格和单支件数 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let specAndper = lines[0][0];
                lines.map((v)=>{//把规格加到每一行的末尾，把奇葩的X|x替换成*,把前面加的F|J干掉
                    if(v[0].indexOf('X') > -1){
                        v[0] = v[0].replace(/X|x/g,'*');
                        v[0] = v[0].replace(/J|F/g,'');
                        specAndper = v[0]
                    }else{
                        v.push(specAndper);
                    }
                })
                let newLine = [];
                lines.map((v)=>{
                    if(v[0].indexOf('*') > -1 || !v[0] || !v[1]){

                    }else{
                        newLine.push(v);
                    }
                })
                options[i].lines = newLine;
                //先匹配最后一项有米的数据吧
                options[i].lines.map((v)=>{
                    if(/\*\d*米/.test(v[3])){
                        v[3] = v[3].replace(/\*\d*米/g,(w)=>{
                            let long = w.replace(/[^0-9]/ig,'');
                            v.push(long);
                            return ''
                        })
                    }else{
                        v.push(6);
                    }
                })
                //再匹配件/支
                options[i].lines.map((v)=>{
                    if(/[(（].*[)）]*/.test(v[3])){//后面的*号表示还有可能忘了加反括号，全角半角括号就算了，你他妈忘了加算怎么回事啊！
                        v[3] = v[3].replace(/[(（].*[)）]*/g,(w)=>{
                            let per = w.replace(/[^0-9]/ig,'');
                            v.push(per);
                            return ''
                        })
                    }else{
                        v.push(100);
                    }
                })
            }
            return options;
        }
    }
    return youfa;
}