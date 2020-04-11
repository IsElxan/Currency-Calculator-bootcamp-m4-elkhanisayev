// Literals
const LOADER                            = document.querySelector('.loading-wrapper');
// const CURRENCY_LIST_BUTTONS             = document.querySelectorAll('currency-list-button');
const CURRENCY_SELECTOR_BUTTONS         = document.querySelectorAll('.currency-selector-button');
const FIRST_CURRENCY_SELECTOR_BUTTONS   = document.querySelectorAll('#firstCurrencySelector div:not(.currency-list-button)');
const FIRST_CURRENCY_LIST_BUTTON        = document.querySelector('#firstCurrencyListButton');
const FIRST_CALCULATOR_INPUT            = document.querySelector('#firstCalculatorInput');
const SECOND_CURRENCY_SELECTOR_BUTTONS  = document.querySelectorAll('#secondCurrencySelector div:not(.currency-list-button)');
const SECOND_CURRENCY_LIST_BUTTON       = document.querySelector('#secondCurrencyListButton');
const SECOND_CALCULATOR_INPUT           = document.querySelector('#secondCalculatorInput');
const MODAL_BOX                         = document.querySelector('#modalBox');
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
    constructor() {}

    getRate = async (firstCurrency, secondCurrency) => {
        const extractor = new Extractor();
        // const data = 1;
        if(this.firstCurrency == this.secondCurrency) {
            extractor.extractRate(1);
        }
        else {
            const response  = await fetch(`https://api.ratesapi.io/api/latest?base=${firstCurrency}&symbols=${secondCurrency}`);
            const data      = await response.json();
            extractor.extractRate(data);
        }
    }

    getCurrenciesList = async () => {
        try {
            
            
            const extractor = new Extractor();
            const response  = await fetch(`https://api.ratesapi.io/api/latest`); 
            const data      = await response.json();
            extractor.extractCurrenciesList(data);
            LOADER.style.display = 'none';
        }
        catch (error) {
            alert(error);
            console.error(error);
        }
    }
}

class Extractor {
    constructor() {}

    extractRate = (data) => {
        console.log(data);
    }

    extractCurrenciesList = (data) => {
        const artisan = new Artisan();
        const currencyList = [];
        for(let currencyName in data.rates) {
            currencyList.push(currencyName);    
        }
        currencyList.push('EUR');
        artisan.fillModalCurrencyList(currencyList);
    }
}

class Calculator {
    constructor() {}
}

class Artisan {
    constructor() {}
    
    fillModalCurrencyList = (currencyList) => {
        let data;
        const subList = [];
        for (let i = 0; i <Math.ceil(currencyList.length/11); i++){
            subList[i] = currencyList.slice((i*11), (i*11) + 11);
        }

        for(let i = 0; i < 3; i++) {
            data = ``;
            for(let j = 0; j < 11; j++) {
                data += `<div class="row"><div>${CURRENCY_DESCRIPTION[subList[i][j]]}</div><div>${subList[i][j]}</div></div>`;
            }
            let curr = MODAL_BOX.querySelector(`.column:nth-child(${i+1})`);
            curr.innerHTML = data;            
        }
        const rows = MODAL_BOX.querySelectorAll('.row')
        rows.forEach(element => { element.addEventListener('click', this.changeFirstSelectButtonContent)});
        LOADER.style.display = 'none';
    }

    changeFirstSelectButtonContent = (event) => {   // ALARM close modal box
        console.log(event.currentTarget);
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

    // if(currencyListButton == FIRST_CURRENCY_LIST_BUTTON) {
    //     // console.log('first');
    // }
    // if(currencyListButton == SECOND_CURRENCY_LIST_BUTTON) {
    //     // console.log('second');
    // }
    
}

const handleInputTyping = (event) => {
    // if(event.originalTarget == FIRST_CALCULATOR_INPUT) {
    //     console.log('firstInput!');
    // }
    // else {
    //     console.log('secondInput');
        
    // }
}

const handleSelectorButtonClick = (event) => {
    console.log(event.originalTarget);
}


FIRST_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
SECOND_CURRENCY_LIST_BUTTON.addEventListener('click', handleCurrencyListButtonClick);
FIRST_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping); 
SECOND_CALCULATOR_INPUT.addEventListener('keyup', handleInputTyping);


CURRENCY_SELECTOR_BUTTONS.forEach((element) => element.addEventListener('click', handleSelectorButtonClick));