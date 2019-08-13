import React from "react";
import EchartsGraph from "./echartsGraph";

const DashboardCard = props => {
    return (
        <div
            className="card border-primary m-3"
            style={{ minHeight: props.minHeight, minWidth: props.minWidth }}
        >
            <div className="card-header bg-primary text-white">
                {props.header}
            </div>
            <EchartsGraph
                className="card-body"
                id={props.id}
                chartOption={props.chartOption}
            />
        </div>
    );
};

export default DashboardCard;
