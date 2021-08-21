import React, { useState } from "react";
import Chart from "react-apexcharts";

export function HomeChart({sum_revenue, sum_expense}) {
    const state = {
    options: {
        labels: ['Revenue', 'Expense'],
        chart: {
            width: 380,
            type: 'pie',
        },
        responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
     },
     series: [sum_revenue, sum_expense],
     };

    return (
        <div className="donut">
            <Chart options={state.options} series={state.series} type="pie"/>
        </div>
    )
}