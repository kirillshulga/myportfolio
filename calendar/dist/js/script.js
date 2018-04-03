let today          = new Date(),
    currentDate    = today.getDate(),
    currentYear    = today.getFullYear(),
    displayedYear  = currentYear,
    currentMonth   = today.getMonth(),
    displayedMonth = currentMonth,
    shiftInTable,
    arrOfMonths    = [ { name:"Январь ", amountOfDays: 31},
                        { name:"Февраль ", amountOfDays: 28},
                        { name:"Март ", amountOfDays: 31},
                        { name:"Апрель ", amountOfDays: 30},
                        { name:"Май ", amountOfDays: 31},
                        { name:"Июнь ", amountOfDays: 30},
                        { name:"Июль ", amountOfDays: 31},
                        { name:"Август ", amountOfDays: 31},
                        { name:"Сентябрь ", amountOfDays: 30},
                        { name:"Октябрь ", amountOfDays: 31},
                        { name:"Ноябрь ", amountOfDays: 30},
                        { name:"Декабрь ", amountOfDays: 31},
                       ];

//Показывает название месяца и год
function displayStrMonthAndYear(month, year) {
    let strMonthAndYear = arrOfMonths[month].name + year,
        navDate = document.getElementsByClassName('nav-date')[0];
    navDate.innerHTML = strMonthAndYear;
}

displayStrMonthAndYear(displayedMonth, displayedYear);

//Располагает числа месяца в таблице относительно дней недели
function arrangeNumbers(month, year) {
    let firstDayOfMonth = new Date(year, month).getDay();
    switch(firstDayOfMonth) {
        case 0:
            firstDayOfMonth = 6;
            break;
        default:
            firstDayOfMonth--;
           };
    
    let arrOfDaysValue = document.getElementsByClassName('day-value'),
        len = arrOfDaysValue.length,
        lastDayOfCurrentMonth = arrOfMonths[month].amountOfDays,
        lastItem;
    
    for(let i = firstDayOfMonth, j = 1; i < len; i++, j++) {
        if(j <= lastDayOfCurrentMonth) {
            arrOfDaysValue[i].innerHTML = j;
            lastItem = i;
        }
    };
    
    if(month > 0) {
        let pointOfStart = firstDayOfMonth - 1,
            lastDayOfMonth = arrOfMonths[month - 1].amountOfDays;
        
        for(let i = pointOfStart, j = lastDayOfMonth; i >= 0; i--, j--){
            arrOfDaysValue[i].innerHTML = j;
        }
    }
    
    if(month < 11) {
        let pointOfStart = lastItem + 1,
            len = arrOfDaysValue.length;
        
        for(let i = pointOfStart, j = 1; i < len; i++, j++) {
            if(arrOfDaysValue[i]) {
                arrOfDaysValue[i].innerHTML = j;  
            }
        }
    }
    
    return firstDayOfMonth;
}

shiftInTable = arrangeNumbers(displayedMonth, displayedYear) - 1;

function setCurrentDate (date, shift) {
    let arrOfDayItems = document.getElementsByClassName('day-item'),
        index = date + shift;
    arrOfDayItems[index].classList.add('current-day');
    return arrOfDayItems[index];    
}

setCurrentDate(currentDate, shiftInTable);


function removeClassOfItems() {
    let arrOfDayItems = document.getElementsByClassName('day-item'),
        len = arrOfDayItems.length;
    for(let i = 0; i < len; i++) {
        arrOfDayItems[i].classList.remove('current-day', 'notice', 'return-to-current-day');
    }
}

function displayLastMonth() {
    if(displayedMonth > 0) {
        displayedMonth--;
        displayStrMonthAndYear(displayedMonth, displayedYear);
        arrangeNumbers(displayedMonth, displayedYear);
        removeClassOfItems();
    }    
}

function displayNextMonth() {
    if(displayedMonth < 11) {
        displayedMonth++;
        displayStrMonthAndYear(displayedMonth, displayedYear);
        arrangeNumbers(displayedMonth, displayedYear);
        removeClassOfItems();
    }
}

function displayCurrentMonth() {
    displayStrMonthAndYear(currentMonth, currentYear);
    arrangeNumbers(currentMonth, currentYear);
    setCurrentDate(currentDate, shiftInTable).classList.add('return-to-current-day');
}

let lastMonthButton = document.getElementsByClassName('last-month-button')[0],
    nextMonthButton = document.getElementsByClassName('next-month-button')[0],
    todayButton = document.getElementsByClassName('today-button')[0];

lastMonthButton.addEventListener('click', displayLastMonth);
nextMonthButton.addEventListener('click', displayNextMonth);
todayButton.addEventListener('click', displayCurrentMonth);






















