import React, { Component } from "react";
import * as echarts from "echarts";
import * as Resizer from "css-element-queries";

class EchartsGraph extends Component {
    render() {
        return <div id={this.props.id} className={this.props.className} />;
    }

    componentDidMount() {
        let element = document.getElementById(this.props.id);

        this.chart = echarts.init(element);
        this.chart.setOption(this.props.chartOption);

        this.chart.on("finished", () => {
            this.resizeObserver = new Resizer.ResizeSensor(element, () => {
                if (this.chart !== null && this.chart !== undefined) {
                    this.chart.resize();
                }
            });
        });
    }

    componentWillUnmount() {
        this.chart.dispose();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // the component never updates and instead uses
        // willreceiveprops in order to reset the data on the chart
        return false;
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(nextProps) {
        // Update chart
    }
}

export default EchartsGraph;
