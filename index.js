//  LITERALS
//  FIRST
const FIRST_RATE_WRAPPER                = document.querySelector('#first-rate-wrapper');
const FIRST_CURRENCY_SELECTOR           = document.querySelector('#firstCurrencySelector');
const FIRST_CURRENCY_SELECT_BUTTON      = document.querySelector('#firstCurrencySelector div:first-child');
const FIRST_CURRENCY_SELECTOR_BUTTONS   = document.querySelectorAll('#firstCurrencySelector div:not(.currency-list-button)');
const FIRST_CURRENCY_LIST_BUTTON        = document.querySelector('#firstCurrencyListButton');
const FIRST_CALCULATOR_INPUT            = document.querySelector('#firstCalculatorInput');
//  SECOND
const SECOND_RATE_WRAPPER               = document.querySelector('#second-rate-wrapper');
const SECOND_CURRENCY_SELECTOR          = document.querySelector('#secondCurrencySelector');
const SECOND_CURRENCY_SELECT_BUTTON     = document.querySelector('#secondCurrencySelector div:first-child');
const SECOND_CURRENCY_SELECTOR_BUTTONS  = document.querySelectorAll('#secondCurrencySelector div:not(.currency-list-button)');
const SECOND_CURRENCY_LIST_BUTTON       = document.querySelector('#secondCurrencyListButton');
const SECOND_CALCULATOR_INPUT           = document.querySelector('#secondCalculatorInput');
//  OTHER GLOBAL LITERALS
const GLOBAL_RATIO                      = {};
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

    getRate = async (selectedBtns) => {
        LOADER.style.display = 'flex';
        const first = selectedBtns.first;
        const second = selectedBtns.second;
        const from = selectedBtns.from;
        
        // console.log(first, second);
        if(first == second) {
            GLOBAL_RATIO.first = 1;
            GLOBAL_RATIO.second = 1; 
            this.artisan.fillRateWrappers(first, second);
            this.calculator.calculate(from);
            LOADER.style.display = 'none';
        }
        else {
            try {
                const responseFirstToSecond = await fetch(`https://api.ratesapi.io/api/latest?base=${first}&symbols=${second}`);
                const firstData = await responseFirstToSecond.json();
                // console.log(firstData);
                const responseSecondToFirst = await fetch(`https://api.ratesapi.io/api/latest?base=${second}&symbols=${first}`);
                const secondData = await responseSecondToFirst.json();
                // console.log(secondData);
                // this.extractor.extractRates(firstData, secondData);
                if(firstData.rates == undefined) {
                    throw 'Что-то пошло не так';
                }
                GLOBAL_RATIO.first = firstData.rates[second];
                GLOBAL_RATIO.second = secondData.rates[first];
                this.artisan.fillRateWrappers(first, second);
                this.calculator.calculate(from);
                LOADER.style.display = 'none';
            }
            catch(error) {
                // console.error('critical error' + error);
                alert(error);
                LOADER.style.display = 'none';
            }
        }
    }

    getCurrenciesList = async () => {
        try {
            const response  = await fetch(`https://api.ratesapi.io/api/latest`); 
            const data      = await response.json();
            if(data == undefined) {
                throw 'Что-то пошло не так';
            }
            this.extractor.extractCurrenciesList(data);
            LOADER.style.display = 'none';
        }
        catch(error) {
            // console.error('critical error' + error);
            alert(error);
            LOADER.style.display = 'none';
        }
    }
}

class Extractor {
    constructor() {}
    extractCurrenciesList = (data) => {
        const artisan = new Artisan();
        const currencyList = [];
        for(let currencyName in data.rates) {
            currencyList.push(currencyName);    
        }
        currencyList.push('EUR');
        const subList = [];                                                     // this part musr be in extractor
        for (let i = 0; i <Math.ceil(currencyList.length/11); i++){             // // this part musr be in extractor
            subList[i] = currencyList.slice((i*11), (i*11) + 11);               // this part musr be in extractor
        }  
        artisan.fillModalCurrencyList(subList);
    }
}

class Artisan {
    constructor() {}

    fillRateWrappers = (first, second) => {
        FIRST_RATE_WRAPPER.innerText = `1 ${first} = ${GLOBAL_RATIO.first} ${second}`; 
        SECOND_RATE_WRAPPER.innerHTML = `1 ${second} = ${GLOBAL_RATIO.second} ${first}`;
    }
    
    fillModalCurrencyList = (subList) => {
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

    changeFirstSelectButtonContent = (event) => {   
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
            // from: activeListButton == FIRST_CURRENCY_LIST_BUTTON ? 1 : 2
            from: 1
        };
        const requester = new Requester();
        requester.getRate(selectedBtnsValue);
        return;
    }
}

class Calculator {
    constructor() {}
    calculate = (operatingMode) => {
        switch(operatingMode) {
            case 1:
                SECOND_CALCULATOR_INPUT.value = Number(FIRST_CALCULATOR_INPUT.value) * GLOBAL_RATIO.first;
            break;
            case 2:
                FIRST_CALCULATOR_INPUT.value = Number(SECOND_CALCULATOR_INPUT.value) * GLOBAL_RATIO.second;
            break;
            case 3:
                console.log('third');
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
    currencyListButton.lastElementChild.innerHTML   = '&#8249;';                                // 
    MODAL_BOX.style.display = 'block';
    LOADER.style.display = 'flex';
    const requester = new Requester();
    requester.getCurrenciesList();    
}

const handleSelectorButtonClick = (event) => {
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
    // LOADER.style.display = 'flex';
    const selectedBtnsValue = {
        first:  FIRST_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
        second: SECOND_CURRENCY_SELECTOR.querySelector('.active-button').innerText,
        // from: selectedBtn.parentElement == FIRST_CURRENCY_SELECTOR ? 1 : 2
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
        return;
    }
    else if(symbol == 'Delete' || symbol == 'Backspace' || symbol == 'ArrowRight' || symbol == 'ArrowLeft' || symbol == 'ArrowUp' || symbol == 'ArrowDown') {
        if(input == FIRST_CALCULATOR_INPUT) {               // Typing in first input
            calculator.calculate(1);
        }
        else {                                              // Typing in second input
            calculator.calculate(2);
        }
        return;
    }
    else {
        if(input == FIRST_CALCULATOR_INPUT) {
            FIRST_CALCULATOR_INPUT.value = FIRST_CALCULATOR_INPUT.value.slice(0, -1);
        }
        else {
            SECOND_CALCULATOR_INPUT.value = SECOND_CALCULATOR_INPUT.value.slice(0, -1);
        }
        return;
    }
}

const handleCastling = (event) => {
    console.log(event);







}

FIRST_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
SECOND_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
FIRST_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping); 
SECOND_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping);
CURRENCY_SELECTOR_BUTTONS.forEach((element) => element.addEventListener('click', handleSelectorButtonClick));
CASTLING_ICON.addEventListener('click', handleCastling);
new Requester().getRate({ first: 'RUB', second: 'USD', from: 2 });