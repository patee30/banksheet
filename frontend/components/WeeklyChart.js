
import { weeklyData } from "../utils/WeeklyData";
import Chart from "react-apexcharts";
import React from 'react';
import { fShortenNumber } from '../utils/fShortenNum';
import { Box, CardHeader, Card } from '@material-ui/core';
//--------------------------------------------------------------------------------------------
export function WeeklyChart({revenue, expense}) {
    
    const weekly_data = weeklyData(revenue, expense);
    const days = [];
    const revenue_data = [];
    const expense_data = [];
    for (const key of weekly_data.keys()) {
      days.push(key);
    }
    
    for (const value of weekly_data.values()) {
      revenue_data.push(value[0]);
      expense_data.push(value[1]);
    }

    const state =  {
        options: {
        series: [
            {
                name: 'Revenue',
                type: 'bar',
                data: revenue_data.reverse()
            },
            {
                name: 'Expense',
                type: 'bar',
                data: expense_data.reverse()
            }
        ],           
            chart: {
            type: 'bar',
            height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            yaxis: {
                title: {
                  text: 'vnd'
                }
            },

            xaxis: {
                categories: days.reverse()
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                    return `${fShortenNumber(y)}`;
                    }
                    return y;
                }
                }
            }
    }
    };

    return (
                <div>
                <Chart
                    options={state.options}
                    series={state.options.series}
                    type="bar"
                    width="500"
                    />
                </div>

    )
}

