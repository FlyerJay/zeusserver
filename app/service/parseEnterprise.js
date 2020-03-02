'use strict';

module.exports = app => {
    class ParseEnterprise extends app.Service {
        // 去掉每行的空格，按~~拆分数据
        parseLine (options) {
            for(let i = 0; i < options.length; i++) {
                var option = options[i]
                option.lines.map((item, index) => {
                    var itemArr =  item.trim().split('~~').slice(1,6)
                    itemArr.splice(1,1)
                    if ( itemArr[2]) {
                        var append = itemArr[2].split(/\s+/)
                        if(append.length === 1) {
                            if(/\d{3,}/.test(append[0])) {
                                var matchs = append[0].match(/(0\d{2,}-)?\d{7,}/)
                                if (matchs && matchs[0]) {
                                    append[0] = append[0].replace(matchs[0], '')
                                    append[1] = matchs[0]
                                }
                            }
                        }
                        append.length = 2
                        itemArr.splice(2, 1, ...append)
                    }
                    if (itemArr[4]) {
                        var append = itemArr[4].split(/\s+/)
                        if(append.length === 1) {
                            if(/\d{3,}/.test(append[0])) {
                                var matchs = append[0].match(/(0\d{2,}-)?\d{7,}/)
                                if (matchs[0]) {
                                    append[0] = append[0].replace(matchs[0], '')
                                    append[1] = matchs[0]
                                }
                            }
                        }
                        append.length = 2
                        itemArr.splice(4, 1, ...append)
                    }
                    itemArr.length = 6
                    return option.lines[index] = itemArr
                })
                options[i] = option
            }
            return options
        }

        // 筛选出无效的数据
        invalidFilter (options) {
            return options.filter(item => {
                for(let i = 0; i < item.length; i++) {
                    if (!item[i]) {
                        return true
                    }
                }
                return false
            })
        }
    }
    return ParseEnterprise
}
