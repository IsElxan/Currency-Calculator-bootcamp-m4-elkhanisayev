//  LITERALS
// Add libs
const dayjs = require('dayjs');
import Chart from 'chart.js';
//  FIRST
const FIRST_RATE_WRAPPER                = document.querySelector('#first-rate-wrapper');
const FIRST_CURRENCY_SELECTOR           = document.querySelector('#firstCurrencySelector');
const FIRST_CURRENCY_SELECT_BUTTON      = document.querySelector('#firstCurrencySelector div:first-child');
const FIRST_CURRENCY_SELECTOR_BUTTONS   = document.querySelectorAll('#firstCurrencySelector div:not(.currency-list-button)');
const FIRST_CURRENCY_LIST_BUTTON        = document.querySelector('#firstCurrencyListButton');
const FIRST_CALCULATOR_INPUT            = document.querySelector('#firstCalculatorInput');
const FIRST_CANVAS                      = document.querySelector('#firstChart');
//  SECOND
const SECOND_RATE_WRAPPER               = document.querySelector('#second-rate-wrapper');
const SECOND_CURRENCY_SELECTOR          = document.querySelector('#secondCurrencySelector');
const SECOND_CURRENCY_SELECT_BUTTON     = document.querySelector('#secondCurrencySelector div:first-child');
const SECOND_CURRENCY_SELECTOR_BUTTONS  = document.querySelectorAll('#secondCurrencySelector div:not(.currency-list-button)');
const SECOND_CURRENCY_LIST_BUTTON       = document.querySelector('#secondCurrencyListButton');
const SECOND_CALCULATOR_INPUT           = document.querySelector('#secondCalculatorInput');
const SECOND_CANVAS                     = document.querySelector('#secondChart');
//  OTHER GLOBAL LITERALS
const GLOBAL_RATIO                      = {};
const WEEK_STATS                        = [];
const CASTLING_ICON                     = document.querySelector('#castlingIcon');
const CURRENCY_SELECTOR_BUTTONS         = document.querySelectorAll('.currency-selector-button');
const MODAL_BOX                         = document.querySelector('#modalBox');
const LOADER                            = document.querySelector('.loading-wrapper');
const CURRENCY_DESCRIPTION = {
    AUD: 'Австралийский доллар',
    BGN: 'Болгарский лев',
    BRL: 'Бразильский реал',
    CAD: 'Канадский доллар',
    CHF: 'Швейцарский франк',
    CNY: 'Китайский юань',
    CZK: 'Чешская крона',
    DKK: 'Датская крона',
    EUR: 'ЕВРО',
    GBP: 'Фунт стерлингов',
    HKD: 'Гонконгский доллар',
    HRK: 'Хорватская куна',
    HUF: 'Венгерский форинт',
    IDR: 'Индонезийская рупия',
    ILS: 'Израильский шекель',
    INR: 'Индийская рупия',
    ISK: 'Исландская крона',
    JPY: 'Японская иена',
    KRW: 'Вон Республики Корея',
    MXN: 'Мексиканское песо',
    MYR: 'Малайзийский ринггит',
    NOK: 'Норвежская крона',
    NZD: 'Новозеландский доллар',
    PHP: 'Филиппинское песо',
    PLN: 'Польский злотый',
    RON: 'Новый румынский лей',
    RUB: 'Российский рубль',
    SEK: 'Шведская крона',
    SGD: 'Сингапурский доллар',
    THB: 'Тайский бат',
    TRY: 'Турецкая лира',
    USD: 'Доллар США',   
    ZAR: 'Южноафриканский рэнд'
}



class Requester {
    constructor() {
        this.extractor  = new Extractor();
        this.artisan    = new Artisan();
        this.calculator = new Calculator();
    }

    getRate(selectedBtns) {
        LOADER.style.display = 'flex';
        const first = selectedBtns.first;
        const second = selectedBtns.second;
        const from = selectedBtns.from;
        if(first == second) {
            GLOBAL_RATIO.first = 1;
            GLOBAL_RATIO.second = 1; 
            WEEK_STATS.firstStats = [1,1,1,1,1,1,1];
            WEEK_STATS.secondStats = [1,1,1,1,1,1,1];
            this.artisan.fillRateWrappers(first, second, 1);
            this.calculator.calculate(from);
            LOADER.style.display = 'none';
            this.artisan.drawCharts();
        }
        else {
            const urls = [`https://api.ratesapi.io/api/latest?base=${first}&symbols=${second}`,`https://api.ratesapi.io/api/latest?base=${second}&symbols=${first}`];
            Promise.all(urls.map(u => fetch(u)))
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(objArray => {
                if(objArray[0].rates == undefined || objArray[1].rates == undefined) {
                    throw 'Что-то пошло не так';
                }
                GLOBAL_RATIO.first = objArray[0].rates[second];
                GLOBAL_RATIO.second = objArray[1].rates[first];
                this.artisan.fillRateWrappers(first, second, 1);
                this.calculator.calculate(from);
                LOADER.style.display = 'none';
                this.getWeekStats(first, second); 
            })
            .catch(error => {
                alert(error);
                LOADER.style.display = 'none';
            });
        }
    }

    getCurrenciesList() {
        const url = `https://api.ratesapi.io/api/latest`;
        fetch(url)
        .then(data => {
            return data.json();
        })
        .then(result => {
            if(result.rates == undefined) {
                throw 'Что-то пошло не так';
            }
            this.extractor.extractCurrenciesList(result);
            LOADER.style.display = 'none';
        })
        .catch(error => {
            alert(error);
            LOADER.style.display = 'none';
        });
    }

    getWeekStats(first, second) {
        const seventhDay    = dayjs().format('YYYY-MM-DD');
        const sixthDay      = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        const fifthDay      = dayjs().subtract(2, 'day').format('YYYY-MM-DD');;
        const fourthDay     = dayjs().subtract(3, 'day').format('YYYY-MM-DD');;
        const thirdDay      = dayjs().subtract(4, 'day').format('YYYY-MM-DD');;
        const secondDay     = dayjs().subtract(5, 'day').format('YYYY-MM-DD');;
        const firstDay      = dayjs().subtract(6, 'day').format('YYYY-MM-DD');;
        const urls = [
            `https://api.ratesapi.io/api/${seventhDay}?base=${first}&symbols=${second}`,    
            `https://api.ratesapi.io/api/${sixthDay}?base=${first}&symbols=${second}`,      
            `https://api.ratesapi.io/api/${fifthDay}?base=${first}&symbols=${second}`,      
            `https://api.ratesapi.io/api/${fourthDay}?base=${first}&symbols=${second}`,     
            `https://api.ratesapi.io/api/${thirdDay}?base=${first}&symbols=${second}`,      
            `https://api.ratesapi.io/api/${secondDay}?base=${first}&symbols=${second}`,     
            `https://api.ratesapi.io/api/${firstDay}?base=${first}&symbols=${second}`,      
            /*########################################################################*/
            `https://api.ratesapi.io/api/${seventhDay}?base=${second}&symbols=${first}`,    
            `https://api.ratesapi.io/api/${sixthDay}?base=${second}&symbols=${first}`,      
            `https://api.ratesapi.io/api/${fifthDay}?base=${second}&symbols=${first}`,      
            `https://api.ratesapi.io/api/${fourthDay}?base=${second}&symbols=${first}`,     
            `https://api.ratesapi.io/api/${thirdDay}?base=${second}&symbols=${first}`,      
            `https://api.ratesapi.io/api/${secondDay}?base=${second}&symbols=${first}`,     
            `https://api.ratesapi.io/api/${firstDay}?base=${second}&symbols=${first}`,      
        ]
        Promise.all(urls.map(u => fetch(u)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(objArray => {
            if(objArray.length == 0) {
                throw 'Что-то пошло не так';
            }
            this.extractor.extractStatsForGraphs({ f: first, s: second, d: objArray });
        })
        .catch(error => {
            alert(error);
        });
    }
}

class Extractor {
    constructor() {
        this.artisan = new Artisan();
    }

    extractCurrenciesList(data) {
        const artisan = new Artisan();
        const currencyList = [];
        for(let currencyName in data.rates) {
            currencyList.push(currencyName);    
        }
        currencyList.push('EUR');
        const subList = [];                                                     
        for (let i = 0; i <Math.ceil(currencyList.length/11); i++){            
            subList[i] = currencyList.slice((i*11), (i*11) + 11);               
        }  
        artisan.fillModalCurrencyList(subList);
    }

    extractStatsForGraphs(data) {
        
        const firstCurrency     = data.f;
        const secondCurrency    = data.s;
        const array             = data.d;
        const firstResultArray  = [];
        const secondResultArray = [];
        if(array.length == 0) {
            console.error('Что-то пошло не так');
            return;
        }
        for(let i = 0; i < array.length; i++) {
            if(array[i].base == firstCurrency) {
                firstResultArray.push(array[i].rates[secondCurrency]);
            }
            else {
                secondResultArray.push(array[i].rates[firstCurrency]);
            }
        }
        WEEK_STATS.firstStats   = firstResultArray.reverse();
        WEEK_STATS.secondStats  = secondResultArray.reverse();
        this.artisan.drawCharts();
    }
}

class Artisan {
    constructor() {}
    fillRateWrappers(first, second, mode) {
        switch(mode) {
            case 1:
                FIRST_RATE_WRAPPER.innerText = `1 ${first} = ${GLOBAL_RATIO.first} ${second}`; 
                SECOND_RATE_WRAPPER.innerHTML = `1 ${second} = ${GLOBAL_RATIO.second} ${first}`;            
            break;
            case 2:
                FIRST_RATE_WRAPPER.innerText = `1 ${first} = ${GLOBAL_RATIO.second} ${second}`; 
                SECOND_RATE_WRAPPER.innerHTML = `1 ${second} = ${GLOBAL_RATIO.first} ${first}`;  
            break;
        }
    }
    
    fillModalCurrencyList(subList) {
        for(let i = 0; i < 3; i++) {
            let curr = MODAL_BOX.querySelector(`.column:nth-child(${i+1})`);
            for(let j = 0; j < 11; j++) {
                let row = document.createElement('div');
                row.classList.add('row');
                row.innerHTML = `<div class="desc">${CURRENCY_DESCRIPTION[subList[i][j]]}</div><div class="symbol">${subList[i][j]}</div>`;
                row.addEventListener('click', this.changeFirstSelectButtonContent);
                curr.appendChild(row);
            }          
        }
        LOADER.style.display = 'none';
    }

    changeFirstSelectButtonContent(event) {   
        const selectedCurrency = event.currentTarget.lastChild.innerText;
        const activeListButton = document.querySelector('.currency-list-button-activated');
        let flaq;
        let currentActiveButton;
        if(activeListButton == FIRST_CURRENCY_LIST_BUTTON) {    // First calc
            currentActiveButton = FIRST_CURRENCY_SELECTOR.querySelector('.active-button');
            if(currentActiveButton) {
                currentActiveButton.classList.remove('active-button');
            }
            flaq = false;
            FIRST_CURRENCY_SELECTOR_BUTTONS.forEach(element => {
                if(element.innerText == selectedCurrency) {
                    flaq = true;
                    element.classList.add('active-button');
                }
            });
            if(flaq == false) {
                FIRST_CURRENCY_SELECT_BUTTON.innerText = selectedCurrency;
                FIRST_CURRENCY_SELECT_BUTTON.classList.add('active-button');
            }
            MODAL_BOX.style.display = 'none';
            FIRST_CURRENCY_LIST_BUTTON.classList.remove('currency-list-button-activated');     
            FIRST_CURRENCY_LIST_BUTTON.lastElementChild.innerHTML = '&#8250;';
        }
        else {                                                  // Second calc
            currentActiveButton = SECOND_CURRENCY_SELECTOR.querySelector('.active-button');
            if(currentActiveButton) {
                currentActiveButton.classList.remove('active-button');
            }
            flaq = false;
            SECOND_CURRENCY_SELECTOR_BUTTONS.forEach(element => {
                if(element.innerText == selectedCurrency) {
                    flaq = true;
                    element.classList.add('active-button');
                }
            });
            if(flaq == false) {
                SECOND_CURRENCY_SELECT_BUTTON.innerText = selectedCurrency;
                SECOND_CURRENCY_SELECT_BUTTON.classList.add('active-button');
            }
            MODAL_BOX.style.display = 'none';
            SECOND_CURRENCY_LIST_BUTTON.classList.remove('currency-list-button-activated');
            SECOND_CURRENCY_LIST_BUTTON.lastElementChild.innerHTML = '&#8250;';
        }
        const selectedBtnsValue = {
            first:  FIRST_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
            second: SECOND_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
            from: 1
        };
        const requester = new Requester();
        requester.getRate(selectedBtnsValue);
        return;
    }

    drawCharts() {
        var firstLineChart = new Chart(FIRST_CANVAS, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [{
                    label: 'Weekly trend',
                    borderColor: 'rgb(67, 99, 132)',
                    fill: false,
                    data: WEEK_STATS.firstStats
                }]
            },
            options: {}
        });
 
        console.log(SECOND_CANVAS);
        var secondLineChart = new Chart(SECOND_CANVAS, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [{
                    label: 'Weekly trend',
                    borderColor: 'rgb(67, 99, 132)',
                    fill: false,
                    data: WEEK_STATS.secondStats
                }]
            },
            options: {}
        });
    }
}

class Calculator {
    constructor() {}
    calculate(operatingMode) {
        switch(operatingMode) {
            case 1:
                SECOND_CALCULATOR_INPUT.value = Number(FIRST_CALCULATOR_INPUT.value) * GLOBAL_RATIO.first;
            break;
            case 2:
                FIRST_CALCULATOR_INPUT.value = Number(SECOND_CALCULATOR_INPUT.value) * GLOBAL_RATIO.second;
            break;
        }
    }
}


const handleCurrencyListButtonClick = (event) => {
    const currencyListButton = event.currentTarget;
    if((FIRST_CURRENCY_LIST_BUTTON.classList.contains('currency-list-button-activated') ||      // Check if open from other button
    SECOND_CURRENCY_LIST_BUTTON.classList.contains('currency-list-button-activated')) && 
    (!currencyListButton.classList.contains('currency-list-button-activated'))) {
        return;
    }
    if(currencyListButton.classList.contains('currency-list-button-activated')) {               // Close modal box
        currencyListButton.classList.remove('currency-list-button-activated');
        currencyListButton.lastElementChild.innerHTML = '&#8250;';
        MODAL_BOX.style.display = 'none';
        return;
    }
    currencyListButton.classList.add('currency-list-button-activated');                         // Add active class
    currencyListButton.lastElementChild.innerHTML   = '&#8249;';                                 
    MODAL_BOX.style.display = 'block';
    LOADER.style.display = 'flex';
    const requester = new Requester();
    requester.getCurrenciesList();    
}

const handleSelectorButtonClick = (event) => {
    console.log(event);
    const selectedBtn = event.currentTarget;
    let currentActiveButton;
    if(selectedBtn.parentElement == FIRST_CURRENCY_SELECTOR) {
        currentActiveButton = FIRST_CURRENCY_SELECTOR.querySelector('.active-button');
        if(currentActiveButton) {
            currentActiveButton.classList.remove('active-button');
        }
    }
    else {
        currentActiveButton = SECOND_CURRENCY_SELECTOR.querySelector('.active-button');
        if(currentActiveButton) {
            currentActiveButton.classList.remove('active-button');
        }
    }
    selectedBtn.classList.add('active-button');
    const selectedBtnsValue = {
        first:  FIRST_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
        second: SECOND_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
        from: 1
    };
    const requester = new Requester();
    requester.getRate(selectedBtnsValue);
}

const handleInputTyping = (event) => {
    const symbol = event.key;
    const input = event.target;
    const calculator = new Calculator();
    if(symbol == '0' || symbol == '1' || symbol == '2' || symbol == '3' || symbol == '4' || symbol == '5' || symbol == '6' || symbol == '7' || symbol == '8' || symbol == '9' || symbol == '.' || symbol == ',') {
        if(symbol == ',') {
            input.value = input.value.replace(',', '.');
        }
        if(input.value[input.value.length - 1] == '.' && input.value[input.value.length - 2] == '.') {
            input.value = '0';
        }
        if(input == FIRST_CALCULATOR_INPUT) {               // Typing in first input
            calculator.calculate(1);
        }
        else {                                              // Typing in second input
            calculator.calculate(2);
        }
    }
    else if(symbol == 'Delete' || symbol == 'Backspace' || symbol == 'ArrowRight' || symbol == 'ArrowLeft' || symbol == 'ArrowUp' || symbol == 'ArrowDown' || symbol == 'Control' || symbol == 'a') {
        if(input == FIRST_CALCULATOR_INPUT) {               // Typing in first input
            if(FIRST_CALCULATOR_INPUT.value.search('a')) {
                FIRST_CALCULATOR_INPUT.value = FIRST_CALCULATOR_INPUT.value.replace(symbol, '');
            }
            calculator.calculate(1);
        }
        else {                                              // Typing in second input
            if(SECOND_CALCULATOR_INPUT.value.search('a')) {
                SECOND_CALCULATOR_INPUT.value = SECOND_CALCULATOR_INPUT.value.replace(symbol, '');
            }
            calculator.calculate(2);
        }
    }
    else {
        let position;
        if(input == FIRST_CALCULATOR_INPUT) {
            FIRST_CALCULATOR_INPUT.value = FIRST_CALCULATOR_INPUT.value.replace(symbol, '');
        }
        else {
            SECOND_CALCULATOR_INPUT.value = SECOND_CALCULATOR_INPUT.value.replace(symbol, '');
        }
    }
    return;
}

const handleCastling = (event) => {
    let firstFlaq, secondFlaq;
    const firstCurrentActiveButton    = FIRST_CURRENCY_SELECTOR.querySelector('.active-button');
    const secondCurrentActiveButton   = SECOND_CURRENCY_SELECTOR.querySelector('.active-button');
    firstCurrentActiveButton.classList.remove('active-button');
    secondCurrentActiveButton.classList.remove('active-button');

    const firstValue = firstCurrentActiveButton.innerText;
    const secondValue = secondCurrentActiveButton.innerText;
    
    firstFlaq = false;
    FIRST_CURRENCY_SELECTOR_BUTTONS.forEach(element => {
        if(element.innerText == secondValue) {
            firstFlaq = true;
            element.classList.add('active-button');
        }
    });
    if(firstFlaq == false) {
        FIRST_CURRENCY_SELECT_BUTTON.innerText = secondValue;
        FIRST_CURRENCY_SELECT_BUTTON.classList.add('active-button');
    }
    secondFlaq = false;
    SECOND_CURRENCY_SELECTOR_BUTTONS.forEach(element => {
        if(element.innerText == firstValue) {
            secondFlaq = true;
            element.classList.add('active-button');
        }
    });
    if(secondFlaq == false) {
        SECOND_CURRENCY_SELECT_BUTTON.innerText = firstValue;
        SECOND_CURRENCY_SELECT_BUTTON.classList.add('active-button');
    }
    const artisan = new Artisan();
    artisan.fillRateWrappers(secondValue, firstValue, 2);
    const temporaryVariable = GLOBAL_RATIO.first;
    GLOBAL_RATIO.first = GLOBAL_RATIO.second;
    GLOBAL_RATIO.second = temporaryVariable;
    const calculator = new Calculator();
    calculator.calculate(1);
    const secondTemporaryVariable = WEEK_STATS.firstStats;
    WEEK_STATS.firstStats = WEEK_STATS.secondStats;
    WEEK_STATS.secondStats = secondTemporaryVariable;
    artisan.drawCharts();
}

FIRST_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
SECOND_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
FIRST_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping); 
SECOND_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping);
CURRENCY_SELECTOR_BUTTONS.forEach((element) => element.addEventListener('click', handleSelectorButtonClick));
CASTLING_ICON.addEventListener('click', handleCastling);
new Requester().getRate({ first: 'RUB', second: 'USD', from: 2 });