import React, { useState } from "react";
import Chart from "react-apexcharts";

export function HomeChart({sum_revenue, sum_expense}) {
    const state = {
    options: {   
      chart: {
        type: 'bar',
      },
        xaxis: {
          labels: {
            show: false
          },
          categories: ['Revenue', 'Expense'],
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '20px',

        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
     },
     series: [{
      data: [sum_revenue, sum_expense]
    }],
     };

    return (
        <div className="donut">
            <Chart options={state.options} series={state.series} type="bar" weight= "800"/>
        </div>
    )
}