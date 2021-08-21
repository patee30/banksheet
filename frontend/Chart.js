
import React, { useState } from "react";
import Chart from "react-apexcharts";

const access_token_endpoint = 'https://oauth.casso.vn';

export function Charting({access_token, fromDate}) {
    const [data, setData] =  useState([]);

    getAmount(access_token, fromDate, setData);

    const state = {
        options: {
          chart: {
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            },
            toolbar: {
              show: false
            },
          },
          xaxis: {
            categories: data[0]
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        },
        
        stroke: {
          curve: 'smooth'
        },
        series: [
          {
            name: "revenue",
            data: data[1]
          }
        ]
      };

    return (

        <Chart
        
        options={state.options}
        series={state.series}
        type="line"
        height="300"
      />
    )
}

export async function getAmount(access_token, fromDate, setData1, setData2){
  const revenue = [];
  const expense = [];

  const request = {
        method: 'GET',
        headers: {'Authorization': access_token},
  };

    const tmp_response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${formatDate(fromDate)}&sort=DESC`, request);

    const tmp_data_rep = await tmp_response.json();
    
    const pageSize = tmp_data_rep.data.totalRecords;

    const response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${formatDate(fromDate)}&pageSize=${pageSize}&sort=DESC`, request);
    
    const data_rep = await response.json();

    await delayAsync(50);
    
    for (const record of data_rep.data.records) {
        const amount = parseInt(record.amount, 10);
        if (amount > 0) revenue.push([record.when, amount]);
        else expense.push([record.when, -amount]);
    }
  
    
    const revenueMap = getMoney(revenue);
    const days_1 = [];
    const money_1 = [];
    for (const key of revenueMap.keys()) {
      days_1.push(key);
    }
    for (const value of revenueMap.values()) {
      money_1.push(value);
     
    }   

    setData1([days_1, money_1]);
    
    const expenseMap = getMoney(expense);
    const days_2 = [];
    const money_2 = [];
    for (const key of expenseMap.keys()) days_2.push(key);
    for (const value of expenseMap.values()) money_2.push(value);
    
    setData2([days_2, money_2]);
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}


function getMoney(array) {
    const tmp = new Map();
    const count_tmp = new Map();
    for (const i of array) {
      if (!tmp.has(i[0])) {
        tmp.set(i[0], i[1]);
        count_tmp.set(i[0], 1);
      }
      else {
        tmp.set(i[0], tmp.get(i[0]) + i[1]);
        count_tmp.set(i[0], tmp.get(i[0]) + 1);
      }
    }
    return tmp;
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
