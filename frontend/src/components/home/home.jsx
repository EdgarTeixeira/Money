import React from "react";
import DashboardCard from "./dashboardCard";
import * as Graphs from "../../dashboardOptions";

function max(a, b) {
    return a > b ? a : b;
}

const Home = () => {
    return (
        <div className="card-deck">
            <DashboardCard
                minHeight="400px"
                minWidth={max(window.innerWidth / 4, 350) + "px"}
                header="Current Month"
                id="test"
                chartOption={Graphs.currentMonthBenchmarkOptions(
                    0.41,
                    5.41,
                    -1.93
                )}
            />

            <DashboardCard
                minHeight="400px"
                minWidth={max(window.innerWidth / 3, 350) + "px"}
                header="Previous 6 Months"
                id="test2"
                chartOption={Graphs.recentMonthsBenchmarkOption(
                    [0.02, 0.04, 0.06, 0.08, 0.1, 0.12],
                    [0.041, 0.01, 1.19, 0.5, 3.57, 5.41],
                    [0.12, 1.04, 0.53, -0.01, 0.13, -1.93]
                )}
            />

            <DashboardCard
                minHeight="400px"
                minWidth={max(window.innerWidth / 4, 350) + "px"}
                header='Asset Distribution'
                id="test3"
                chartOption={Graphs.assetDistributionOption()}
            />

            <DashboardCard
                minHeight="400px"
                minWidth="400px"
                header="Best Trasactions"
                id="test4"
                chartOption={Graphs.transactionsPareto([
                    110.38,
                    100.1,
                    37.32,
                    16.0,
                    10.78
                ])}
            />

            <DashboardCard
                minHeight="400px"
                minWidth="400px"
                header="Worst Transactions"
                id="test5"
                chartOption={Graphs.transactionsPareto([
                    10.78,
                    16.0,
                    37.32,
                    100.1,
                    110.38
                ])}
            />
        </div>
    );
};

export default Home;
