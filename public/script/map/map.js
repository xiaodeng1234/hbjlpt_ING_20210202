var myChart
var minNumber = 0;
var maxNumber = 10;
var option = null;
var dataList = [];
var star = [];
var map_dwbm;
function loadMap() {
    var cdata = null;
    var parentCityCode = '';
    if (map_dwbm.substr(2, 2) != "00") {
        parentCityCode = map_dwbm.substr(0, 2) + '0000';
        cdata = getCity(cityData, parentCityCode);
    }
    if (map_dwbm.substr(4, 2) != "00") {
        parentCityCode = map_dwbm.substr(0, 4) + '00';
        cdata = getCity(cdata != null ? cdata.children : cityData, parentCityCode);
        cdata = getCity(cdata != null ? cdata.children : cityData, map_dwbm);
    } else {
        cdata = getCity(cdata != null ? cdata.children : cityData, map_dwbm);
    }

    if (cdata == null) {
        return;
    }

    myChart = echarts.init(document.getElementById("hubei_map"));
    //默认右键返回最顶级
    document.getElementById('hubei_map').oncontextmenu = function (e) {
        // debugger
        if (e.button == 2) {
            option.geo.map = cdata.name;
            option.title.text = cdata.name;
            option.title.subtext = '';
            option.series[0].data = star;
            option.series[1].data = setData(cdata.children);
            option.dataRange.splitList = setMaxAndMin(true, option.series[1].data);
            myChart.setOption(option, true);
            if (parent != null && parent.clickAreaCallback != null) {
                parent.clickAreaCallback(map_dwbm);
            }
            var dj_dwbm = cdata.cityCode
            $('#gkzl_dw').combotree('setValue',dj_dwbm);
            var type = document.getElementById('gkzy_xjdw').checked;
            var startDate = $('#gkzl_sqrq_begin').datebox('getValue');
            var endDate = $('#gkzl_sqrq_end').datebox('getValue');
            $('.tb-span1-selected').removeClass('tb-span1-selected')
            $('.home_sxbty').eq(0).addClass('tb-span1-selected')
            // gkzl_blqk(dj_dwbm, startDate, endDate, type);
            // gkzl_sqsx(dj_dwbm, startDate, endDate, type);
            // gkzl_sqzt(dj_dwbm, startDate, endDate, type);
            // gkzl_sqd(dj_dwbm, startDate, endDate, type);
            // gkzl_ajlx(dj_dwbm, startDate, endDate, type);
            // gkzl_bazt(dj_dwbm, startDate, endDate, type,10);
            // gkzl_blhj(dj_dwbm, startDate, endDate, type);
            //                    console.log('右');
        } else if (e.button == 0) {
            //                    console.log('中')
        } else if (e.button == 1) {
            //                    console.log('左')
        }
        return false;
    }

    //若找到对应单位，则读取区域坐标的json文件
    $.getJSON(cdata.jsonFile, function (data) {
        echarts.registerMap(cdata.name, data);
        //双击默认进入下一级
        myChart.off('dblclick');
        myChart.on("dblclick", function (param) {
            if (parent != null && parent.clickAreaCallback != null) {
                parent.clickAreaCallback(param.data.cityCode);
            }
            setChild(myChart, param, cdata, option);
        });

        //重写重置按钮事件
        myChart.off("restore");
        myChart.on("restore", function (param) {
            option.geo.map = cdata.name;
            option.title.text = cdata.name;
            option.title.subtext = '';
            option.series[0].data = star;
            option.series[1].data = setData(cdata.children);
            option.dataRange.splitList = setMaxAndMin(true, option.series[1].data);
            myChart.setOption(option, true);
            if (parent != null && parent.clickAreaCallback != null) {
                parent.clickAreaCallback(map_dwbm);
            }
            var new_dwbm = cdata.cityCode;
            $('#gkzl_dw').combotree('setValue',new_dwbm);
            var type = document.getElementById('gkzy_xjdw').checked;
            var startDate = $('#gkzl_sqrq_begin').datebox('getValue');
            var endDate = $('#gkzl_sqrq_end').datebox('getValue');
            $('.tb-span1-selected').removeClass('tb-span1-selected')
            $('.home_sxbty').eq(0).addClass('tb-span1-selected')
            // gkzl_blqk(new_dwbm, startDate, endDate, type);
            // gkzl_sqsx(new_dwbm, startDate, endDate, type);
            // gkzl_sqzt(new_dwbm, startDate, endDate, type);
            // gkzl_sqd(new_dwbm, startDate, endDate, type);
            // gkzl_ajlx(new_dwbm, startDate, endDate, type);
            // gkzl_bazt(new_dwbm, startDate, endDate, type,10);
            // gkzl_blhj(new_dwbm, startDate, endDate, type);
        });

        //省会坐标点
        var geoCoordMap = {
            '省院机关': cdata.point
        };
        //覆盖物信息
        if (map_dwbm.substr(2, 4) == "0000") {
            star = [
                {
                    name: '省院机关',
                    value: cdata.point.concat(randomValue()),
                    cityCode: cdata.cityCode
                }
            ];
        }

        function setData(data) {
            var res = [];
            if (data == null)
                return res;
            var val;
            var i;
            if (dataList != null && dataList.length > 0) {
                for (i = 0; i < data.length; i++) {
                    for (var j = 0; j < dataList.length; j++) {
                        if (data[i].cityCode == dataList[j].DWBM) {
                            val = {
                                name: data[i].name,
                                cityCode: data[i].cityCode,
                                jsonFile: data[i].jsonFile
                            };
                            val.sl = dataList[j].SL != null ? parseInt(dataList[j].SL) : 0;
                            val.ty = dataList[j].TY != null ? parseInt(dataList[j].TY) : 0;
                            val.bty = dataList[j].BTY != null ? parseFloat(dataList[j].BTY) : 0;
                            //val.wt = dataList[j].wt != null ? parseFloat(dataList[j].wt) : 0;
                            val.value = val.sl;
                            res.push(val);
                            break;
                        }
                    }
                }
            } else {
                for (i = 0; i < data.length; i++) {
                    res.push({
                        name: data[i].name,
                        cityCode: data[i].cityCode,
                        jsonFile: data[i].jsonFile,
                    });
                }
            }
            return res;
        };

        if (cdata.children == undefined) {
            cdata.children = [];
            cdata.children.push(cdata);
        }
        var localData = setData(cdata.children);
        option = {
            title: {//左上角的标题
                text: cdata.name,
                subtext: '',
                textStyle: {
                    color: '#07b1f9'
                }
            },
            toolbox: {//将重置按钮修改为返回按钮，作用为范围至最顶级(地址中的dwbm)
                show: true,
                feature: {
                    restore: {
                        show: true,
                        icon: "image://../../image/map/back.png",
                        title: '返回'
                    }
                }
            },
            itemStyle: {
                color: '#30c0e3'
            },
            tooltip: {//鼠标移动到区域内显示的信息
                formatter: function (params) {
                    return params.name +
                        '<br>申请总数量（项）：' + (params.data.sl != null ? params.data.sl : 0) +
                        '<br>同意申请数量（项）：' + (params.data.ty != null ? params.data.ty : 0) +
                        '<br>不同意申请数量（项）：' + (params.data.bty != null ? params.data.bty : 0);
                }
            },
            visualMap: {//根据数据多少显示区域颜色
                //                min: minNumber,
                //                max: maxNumber,
                left: 'left',
                top: 'bottom',
                show: false,
                text: ['Low', 'High'],
                seriesIndex: [1],
                inRange: {
                },
                calculable: true
            },
            geo: {
                map: cdata.name,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: 'rgba(0,0,0,0.4)'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis: {
                        areaColor: null,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            dataRange: {
                show: false,
                splitList: setMaxAndMin(true, localData),
                color: ['#009dd1', '#00a8df', '#00ade5', '#00afe9', '#30cbfe', '#00c0ff', '#4cd2fe', '#79dfff']
            },
            series: [{//省会坐标点覆盖物
                type: 'scatter',
                coordinateSystem: 'geo',
                data: star,
                symbolSize: 20,
                symbol: 'image://../../image/map/star.png',
                /*symbol:'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQ' +
                'AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlR' +
                'jemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICA' +
                'gICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp' +
                '4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmN' +
                'vbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjk' +
                '2RUY5Q0UxNUU3MTFFN0FEOEY5QUExODg0NzYyMTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjk2RUY5Q0YxNUU3MTFFN0FEOEY5QUExODg0NzYyMTQiPiA8eG1wTU06RGVyaXZlZEZyb20' +
                'gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCOTZFRjlDQzE1RTcxMUU3QUQ4RjlBQTE4ODQ3NjIxNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOTZFRjlDRDE1RTcxMUU3QUQ4RjlBQTE' +
                '4ODQ3NjIxNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmvgAxwAAAD/SURBVDhPpZO/agJBEIdXSaXY2gdLKzt7Qcgj6As' +
                'EbGxTCFroI1hYKwoR7UKClrbiA6TQWkv/Yenvtzu76LqeoB98zOzM7dyxdxdbfxTUK8QlPo0/oAYXMKtX17DG3pdeCf6Af5iDc1iFMZE5a+wtocM/gyTcwIReKTWRWJR4hGl40CvgPwEbPybVcKP' +
                'dTNhzm0noEMcSQ4wkOvwBedg0aZAW5DUOO+ANNuAMZli4A3u8pg65xw2YQld8gL2ZPmD7Fj7hO5MLKjBlUrWHbZM6VrAT9Sn3YcmkagDLJr0m9BYs3xLJUOINUQP+4Bbu4C8LIaIGnGAPdiUP8uL' +
                'vrNQZVLIswGZW5AUAAAAASUVORK5CYII=',*/
                symbolRotate: 35,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false,
                    },
                    emphasis: {
                        show: true
                    }

                },
                itemStyle: {
                    normal: {
                        color: '#F48e50'
                    }
                }
            }, {//区域数据显示
                name: 'categoryA',
                type: 'map',
                geoIndex: 0,

                data: localData

            }]
        };
        myChart.setOption(option, true);

        if (parent != null && parent.loadMapOverCallBack != null) {
            parent.loadMapOverCallBack();
        }
    });
}

function getCity(cityData, map_dwbm) {
    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].cityCode == map_dwbm) {
            return cityData[i];
        }
        if(cityData[i].children!=null)
        {
            for(var j=0;j<cityData[i].children.length;j++)
            {
                if(cityData[i].children[j].cityCode == map_dwbm)
                    return cityData[i].children[j];
            }
        }
    }
    return null;
}

//双击进入下一级方法
function setChild(myChart, param, data, option) {
    var city = {};
    if (param.name != data.name) {
        if (param.data.cityCode.substr(2, 4) == "0000") {
            //上级为顶级
            for (var i = 0; i < data.children.length; i++) {
                if (data.children[i].name == name) {
                    city = data.children[i];
                    break;
                }
            }
            option.series[0].data = star;
        } else {
            //上级不为顶级
            for (var i = 0; i < data.children.length; i++) {
                if (data.children[i].name == param.name) {
                    city = data.children[i];
                    if (city.children != undefined) {
                        for (var j = 0; j < city.children.length; j++) {
                            if (city.children[j].name == name) {
                                city = city.children[j];
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            option.series[0].data = [];
        }

        $.getJSON(param.data.jsonFile, function (data) {
            option.geo.map = param.name;
            option.title.text = param.name;
            option.title.subtext = '';
            option.series[1].data = city.children == null ? [param.data] : setData(city.children);
            echarts.registerMap(param.name, data);
            option.dataRange.splitList = setMaxAndMin(true, option.series[1].data);
            myChart.setOption(option, true);
        });
    } else {
        option.geo.map = param.name;
        option.title.text = param.name;
        option.title.subtext = '';
        option.dataRange.splitList = setMaxAndMin(true, option.series[1].data);
        myChart.setOption(option, true);
    }
    var new_dwbm = param.data.cityCode;
    $('#gkzl_dw').combotree('setValue',new_dwbm);
    var type = document.getElementById('gkzy_xjdw').checked;
    var startDate = $('#gkzl_sqrq_begin').datebox('getValue');
    var endDate = $('#gkzl_sqrq_end').datebox('getValue');
    $('.tb-span1-selected').removeClass('tb-span1-selected')
    $('.home_sxbty').eq(0).addClass('tb-span1-selected');
    // gkzl_blqk(new_dwbm, startDate, endDate, type);
    // gkzl_sqsx(new_dwbm, startDate, endDate, type);
    // gkzl_sqzt(new_dwbm, startDate, endDate, type);
    // gkzl_sqd(new_dwbm, startDate, endDate, type);
    // gkzl_ajlx(new_dwbm, startDate, endDate, type);
    // gkzl_bazt(new_dwbm, startDate, endDate, type,10);
    // gkzl_blhj(new_dwbm, startDate, endDate, type);
}

function setData(data) {
    var res = [];
    if (data == null)
        return res;
    if (dataList != null && dataList.length > 0) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < dataList.length; j++) {
                if (data[i].cityCode == dataList[j].DWBM) {
                    var val = {
                        name: data[i].name,
                        cityCode: data[i].cityCode,
                        jsonFile: data[i].jsonFile
                    };
                    val.sl = dataList[j].SL != null ? parseInt(dataList[j].SL) : 0;
                    val.ty = dataList[j].TY != null ? parseInt(dataList[j].TY) : 0;
                    val.bty = dataList[j].BTY != null ? parseFloat(dataList[j].BTY) : 0;
                    //val.wt = dataList[j].wt != null ? parseFloat(dataList[j].wt) : 0;
                    val.value = val.sl;
                    res.push(val);
                    break;
                }
            }
        }
    }
    else {
        for (i = 0; i < data.length; i++) {
            res.push({
                name: data[i].name,
                cityCode: data[i].cityCode,
                jsonFile: data[i].jsonFile,
            });
        }
    }
    return res;
}

function setMaxAndMin(refresh, data) {
    if (refresh) {
        minNumber = 0, maxNumber = 0;
        if (data.length == 1) {
            minNumber = data[0].value;
            maxNumber = data[0].value;
        } else {
            for (var i = 0; i < data.length; i++) {
                var sl = parseInt(data[i].value);
                if (minNumber > sl) {
                    minNumber = sl;
                }
                if (maxNumber < sl) {
                    maxNumber = sl;
                }
            }
        }
    }
    return [
        { start: maxNumber / 8 * 7 + 0.0001, end: maxNumber + 1, },
        { start: maxNumber / 8 * 6 + 0.0001, end: maxNumber / 8 * 7 },
        { start: maxNumber / 8 * 5 + 0.0001, end: maxNumber / 8 * 6 },
        { start: maxNumber / 8 * 4 + 0.0001, end: maxNumber / 8 * 5 },
        { start: maxNumber / 8 * 3 + 0.0001, end: maxNumber / 8 * 4 },
        { start: maxNumber / 8 * 2 + 0.0001, end: maxNumber / 8 * 3 },
        { start: maxNumber / 8 + 0.0001, end: maxNumber / 8 * 2 },
        { start: minNumber - 1, end: maxNumber / 8 }
    ];
}

function randomValue() {
    return Math.round(Math.random() * 18);
}