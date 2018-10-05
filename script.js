// ================= Selected nodes =================
const availableBalance = document.querySelector('.current-balance');
const description = document.querySelector('.description');
const amount = document.querySelector('.amount');
const typeOfTransaction = document.querySelector('#type');
const addBtn = document.querySelector('.add-btn');
const tableBody = document.querySelector('tbody');
const tableFoot = document.querySelector('tfoot');


// ================= Date and time function =================
const displayDateTime = () => {    
    var now = new Date();
    //document.write(now);
    var year = now.getFullYear();
    var month = now.getMonth()+ 1; //as a zero-based value, 0 corresponds to January, 1 to February, and so on
    var date = now.getDate(); 
    var hours = now.getHours();
    var mins = now.getMinutes();
    var seconds = now.getSeconds();
    return date + '/' + month + '/' + year + ' ' +hours + ':' + mins + ':' + seconds;

    //document.write(hour + ':' + mins + ':' + seconds + '<br>');
    //var day = now.getDay(); // 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on
}

// ================= Putting commas to the amount of transaction =================
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

// ================= Putting data into the array of objects(each transaction) =================

  // Get data from the localStorage and convert from JSON to Object
function getTransactions() {
    var transactions = localStorage.getItem('data');
    if (transactions) {                   // if 'transactions' exists
      return JSON.parse(transactions);    //return it after turning it into a valid JSON object for using in JS
    } else {
      return [];                      // otherwise return an empty array
    }                            
}

let arrayOfTransaction = [];
const grabingData = () => {
    let transactions = getTransactions();

    let dateTime = displayDateTime();
    let descTrans = description.value;
    const incomeAmount = () => {
        if (typeOfTransaction.options[typeOfTransaction.selectedIndex].value == 'income') {
            return parseInt(amount.value);     
        } else {
            return 0;
        }
    } 
    const expenseAmount = () => {
        if (typeOfTransaction.options[typeOfTransaction.selectedIndex].value == 'expense') {
            return  parseInt(amount.value);     
        } else {
            return 0;
        }
    }
    let typeTrans = typeOfTransaction.options[typeOfTransaction.selectedIndex].value;
    let accumBalance = Object.keys(transactions).reduce(function (previous, key) {
                    previous.net += transactions[key].net;
                        return previous;
                    }, { net: 0 });
            //arrayOfTransaction.reduce((a,b,i) => { return cumulativeBalanceArr[i] = a.net + b.net; },0);
    let balance = accumBalance.net + incomeAmount() - expenseAmount();

    transactions.push({
        date: dateTime,
        description: descTrans,
        type: typeTrans,
        income: incomeAmount(),
        expense: expenseAmount(),
        net: incomeAmount() - expenseAmount(),
        balance: balance
    });
    localStorage.setItem('data', JSON.stringify(transactions));
    //localStorage.setItem('data', JSON.stringify(arrayOfTransaction)); 
    displayingData();
    description.value = '';
    amount.value = '';
        //typeOfTransaction.options[0];   ---- Fix!! set the option to the default 

    return transactions;
}

// ================= Putting data into the bank book(each transaction) =================
const displayingData = () => {
    tableBody.innerHTML = '';
    tableFoot.innerHTML = '';
    let dataJSONObj =  getTransactions();

    let eachTrans;
    dataJSONObj.forEach(transaction => {
        eachTrans = document.createElement('tr');

        if (transaction.type == 'income') {
            eachTrans.style.backgroundColor = 'rgba(86, 194, 122, 0.4)';
        } else if (transaction.type == 'expense') {
            eachTrans.style.backgroundColor = 'rgba(241, 72, 72, 0.3)';
        }

        let checkZeroAmount = (value) => {
            if ( value == '0' ) {
                return '-';
            } else {
                return value;
            }
        }

        const transDetail = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${checkZeroAmount(transaction.income)}</td>
            <td>${checkZeroAmount(transaction.expense)}</td>
            <td>${transaction.balance}</td>
        `;
        eachTrans.innerHTML = transDetail;
        tableBody.appendChild(eachTrans);
    });

    // Show the total amount of incomes, expenses, and balance
    let lastBalance = dataJSONObj[dataJSONObj.length-1].balance;
    let sumIncomes = Object.keys(dataJSONObj).reduce(function (previous, key) {
        previous.income += dataJSONObj[key].income;
            return previous;
        }, { income: 0 });
        
    let sumExpenses = Object.keys(dataJSONObj).reduce(function (previous, key) {
        previous.expense += dataJSONObj[key].expense;
            return previous;
        }, { expense: 0 });
    
    let footRow = document.createElement('tr');
    let footDetail = `
        <td colspan="2">Totals</td>
        <td>${sumIncomes.income}</td>
        <td>${sumExpenses.expense}</td>
        <td>${lastBalance}</td>
    `;
    footRow.innerHTML = footDetail;
    tableFoot.appendChild(footRow);

    // ** Add the current balance to the top corner**==================
    let currentBal = dataJSONObj[dataJSONObj.length-1].balance;
    let currentBalWithCommas = numberWithCommas(currentBal);
    availableBalance.innerHTML = currentBalWithCommas;
}

// =================** Add eventlisteners**==================
setTimeout(displayingData, 200);                    // Self-invoking
addBtn.addEventListener('click', grabingData);


// *Note: Self-Invoking Anonymous Function
/* (function(){
    // some code…
  })();

! function(){
    // some code…
}();

setInterval(doStuff, 10000);  -->  doStuff function will get called every 10 seconds. That is the normal approach most developers seem to go with. However, there is a huge problem with that. The setInterval will call doStuff function exactly at specified time of 10 seconds again and again irrespective of whether doStuff function actually finished doing what it is supposed to do. That is bad and will certainly get you into unexpected results.

! function foo(){
    // your other code here
setTimeout(foo, 10000);
}();
This is exactly where self-executing functions come in handy. We can do the same task with the help of self-executing function along with setTimeout like this:
This code will also repeat itself again and again with one difference. setTimeout will never get triggered unless doStuff is finished. A much better approach than using setInterval in this situation.
 */
