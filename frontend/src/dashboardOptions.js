export function currentMonthBenchmarkOptions(cdi, wallet, bovespa) {
    return {
        legend: {
            textStyle: {
                fontSize: 15
            },
            selectedMode: true
        },
        xAxis: {
            type: 'value',
            show: false
        },
        yAxis: {
            type: 'category'
        },
        series: [{
            name: 'CDI',
            type: 'bar',
            data: [cdi],
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    fontSize: 15
                }
            },
            animationDelay: function (idx) {
                return idx * 15;
            }
        }, {
            name: 'Wallet',
            type: 'bar',
            data: [wallet],
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                    fontSize: 15
                }
            },
            animationDelay: function (idx) {
                return idx * 15 + 100;
            }
        }, {
            name: 'Bovespa',
            type: 'bar',
            data: [bovespa],
            label: {
                normal: {
                    show: true,
                    position: 'left',
                    formatter: '{c}%',
                    fontSize: 15
                }
            },
            animationDelay: function (idx) {
                return idx * 15 + 200;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 10;
        }
    };
}

export function recentMonthsBenchmarkOption(cdi, wallet, bovespa) {
    return {
        legend: {
            textStyle: {
                fontSize: 15
            },
            selectedMode: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            name: 'Month',
            nameLocation: 'middle',
            data: ['03', '04', '05', '06', '07', '08']
        },
        yAxis: {
            name: 'Rentability',
            type: 'value'
        },
        series: [{
            name: 'CDI',
            type: 'line',
            data: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12],
            symbolSize: 10,
            smooth: true,
            animationDelay: function (idx) {
                return idx * 15;
            }
        }, {
            name: 'Wallet',
            type: 'line',
            data: [0.041, 0.01, 1.19, 0.5, 3.57, 5.41],
            symbolSize: 10,
            smooth: true,
            animationDelay: function (idx) {
                return idx * 15 + 100;
            }
        }, {
            name: 'Bovespa',
            type: 'line',
            data: [0.12, 1.04, 0.53, -0.01, 0.13, -1.93],
            symbolSize: 10,
            smooth: true,
            animationDelay: function (idx) {
                return idx * 15 + 200;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 10;
        }
    };
}

export function assetDistributionOption(data) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            data: ['BRCR11', 'BCRI11', 'BIDI4', 'SQIA3', 'BIDI11']
        },
        series: [
            {
                name: 'Assets',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        },
                        formatter: '{b}\n{d}%'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    { value: 335, name: 'BRCR11' },
                    { value: 310, name: 'BCRI11' },
                    { value: 234, name: 'BIDI4' },
                    { value: 135, name: 'SQIA3' },
                    { value: 1548, name: 'BIDI11' }
                ]
            }
        ]
    };
}

export function transactionsPareto(data) {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['BIDI11', 'BIDI4', 'SQIA3', 'BCRI11', 'GGRC11'],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Trasanctions',
                type: 'bar',
                barWidth: '60%',
                data: data
            }
        ]
    };
}