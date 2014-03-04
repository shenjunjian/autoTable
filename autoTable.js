/// <reference path="jquery-1.11.0-vsdoc.js" />
/// <reference path="highchart/js/highcharts.js" />

//2014.3月，分公司报表的辅助插件，包括自动生成表头，表体，柱状图、饼图等。
//使用方法：
//$("#tt").autoThead(options);
//options的格式是：
//[ {'列名1|id1': [列扩展, 行扩展, 附加属性],'列名2|id2': [列扩展, 行扩展, 附加属性]……}     ----第一行
//  {'列名3|id3': [列扩展, 行扩展, 附加属性],'列名4|id4': [列扩展, 行扩展, 附加属性]……}		----第二行
//]
//列单元格的id为  tt_id1
//$("#tt").autoTbody(data);
//data是数组，格式为：[{第一行},{第二行},{第三行}]
//每一列的class为tt_field1
(function ($) {
    //options是传入表头内容，其样式参考opt; this必须是一个table.
    $.fn.autoThead = function (options) {
        var output = '<th {0} rowspan="{1}" colspan="{2}" {3}>{4}</th>'
        var opt = [{ 'default|jh': [1, 1, 'style="color:red"'] }];
        if (options instanceof Array) opt = options;
        else alert("使用方法：请传一个数组，每个数组元素为一个表头行。行格式如下：{ '列名|id': [1, 1, 'style=color:red'] , '列名|id':[......]}   每一个{}表示一个字段  ");
        //暂时不支持this包含多个对象，仅假设其为一个tabel
        var me = $(this);
        var meid = me.attr('id');
        me.find('thead').remove();
        var thead = $('<thead>');
        $.each(opt, function (idx, row) {
            var tr = $('<tr>');
            for (key in row) {
                var args = [];
                var arr = key.split('|');
                args.push(arr[1] ? 'id="' + meid + '_' + arr[1] + '"' : '');
                args.push(row[key][0] || '1');
                args.push(row[key][1] || '1');
                args.push(row[key][2] || '');
                args.push(arr[0]);
                tr.append(output.replace(/\{(\d+)\}/g, function (m, i) {
                    return args[i];
                }));
            }
            thead.append(tr);
        });
        me.prepend(thead);
        return me;
    }
    //data是传入表头内容， this必须是一个table.
    $.fn.autoTbody = function (data) {
        var output = '<td {0}>{1}</th>'
        if ((data instanceof Array)) null;
        else alert("使用方法：请传一个数组，每个数组元素为一个数据行。行格式如下：{ FIELD1: 1000 , FIELD2:500} ");
        //暂时不支持this包含多个对象，仅假设其为一个tabel
        var me = $(this);
        var meid = me.attr('id');
        me.find('tbody').remove();
        var tbody = $('<tbody>');
        $.each(data, function (idx, row) {
            var tr = $('<tr>');
            for (key in row) {
                var args = [];
                args.push('class="' + meid + '_' + key + '"');
                args.push(row[key]);
                tr.append(output.replace(/\{(\d+)\}/g, function (m, i) {
                    return args[i];
                }));
            }
            tbody.append(tr);
        });
        me.append(tbody);
        return me;
    }
    //柱状图
    //cat是X轴标签，格式为['一月','二月'.....]，
    //data是数据，[{name:'指标名',data:[指标值.......]}      
    //            ,{name:'指标名',data:[指标值.......]}]
    //dataUnit是数值单位，比如 口，吨等
    //clickHandler 点击时的事件，传入当前选择的值。
    $.fn.autoColumn = function (title, cat, yTitle, data, dataUnit, clickHandler) {

        this.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            series: data,
            xAxis: {
                categories: cat
            },
            yAxis: {
                min: 0,
                title: {
                    text: yTitle
                }
            },
            legend: {   //图例
                //enabled: false,
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'

            },
            tooltip: {
                valueSuffix: dataUnit,
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    point: {
                        events: {
                            click: function () {
                                if (clickHandler) clickHandler(this);
                            }
                        }
                    }
                },
                series: {
                    events: {
                        //控制图标的图例legend不允许切换 
                        legendItemClick: function (event) {
                            return false; 
                        }
                    }
                }
            },
            credits: {
                enabled: false,
                text: '胜利软件',
                href: 'http://www.victorysoft.com.cn/'
            }

        });

    }
})(jQuery);