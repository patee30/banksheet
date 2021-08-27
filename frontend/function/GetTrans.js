const access_token_endpoint = 'https://oauth.casso.vn';
export async function GetTrans(access_token, fromDate, revenue_data, expense_data) {
  
    const revenue = [];
    const expense = [];

    const request = {
        method: 'GET',
        headers: {'Authorization': access_token},
    };
    
    const tmp_response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${formatDate(fromDate)}&sort=ASC`, request);

    const tmp_data_rep = await tmp_response.json();
    
    if (tmp_data_rep.data == null) getAmount(access_token, fromDate, setData1, setData2);
    const pageSize = tmp_data_rep.data.totalRecords;

    const response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${formatDate(fromDate)}&pageSize=${pageSize}&sort=ASC`, request);
    
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
    revenue_data.current = [days_1, money_1];
    
    
    const expenseMap = getMoney(expense);
    const days_2 = [];
    const money_2 = [];
    for (const key of expenseMap.keys()) days_2.push(key);
    for (const value of expenseMap.values()) money_2.push(value);
    
    expense_data.current = [days_2, money_2];

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
  