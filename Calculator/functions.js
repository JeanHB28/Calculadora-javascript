class Calculator {
    constructor(currentOperadTextElement, previousOperandTextElement) {
        this.currentOperadTextElement = currentOperadTextElement
        this.previousOperandTextElement = previousOperandTextElement
        this.clear()
    }
    clear() {
        this.operandCurrent = ''
        this.previousOperandTextElement = ''
        this.operation = undefined

    }

    appendNumber(number) {
        if (number === '.' && this.operandCurrent.includes('.')) return

        this.operandCurrent = this.operandCurrent.toString() + number.toString()

    }

    chooseOperation(operation) {
        if(this.operation === undefined ||this.operation === null){
            this.operation = operation;
            this.compute();
        } 

        if(this.operation !== operation && this.previousOperandTextElement !== ""){
            this.compute()
            this.operation = operation;
        }
    
        if(this.operandCurrent ==="") return

    
        this.previousOperandTextElement = this.operandCurrent;
        this.operandCurrent = "";

    }

    compute() {
        let computation
        const prev = this.previousOperandTextElement
        const curret = this.operandCurrent
        if (prev === "" || curret === "") return;
        switch (this.operation) {
            case "+":
                computation = parseFloat(prev) + parseFloat(curret)
                break;
            case "-":
                computation = parseFloat(prev) - parseFloat(curret)
                break;
            case "×":
                computation = parseFloat(prev) * parseFloat(curret)
                break;
            case "÷":
                computation = parseFloat(prev) / parseFloat(curret)
                break;

            default:
                return;
        }
        
        let result = prev + " " + this.operation + " " + this.operandCurrent + " = " + computation;
        let store_string = JSON.stringify({ result });
        localStorage.setItem(((localStorage.length) + 1), store_string);



        this.operandCurrent = computation
        this.operation = undefined

    }
    updateDisplay() {
        if (this.operandCurrent === "" && this.previousOperandTextElement !== "") {
            this.currentOperadTextElement.innerText = this.previousOperandTextElement
        } else {
            this.currentOperadTextElement.innerText = this.operandCurrent
        }

    }
}
const numberButtons = document.querySelectorAll("[data-number]")
const operationButtons = document.querySelectorAll("[data-operation]")
const equalsButton = document.querySelector("[data-equals]")
const allClearButton = document.querySelector("[data-all-clear]")
const currentOperadTextElement = document.querySelector("[data-operand-current]")
var previousOperandTextElement = '';

const calculator = new Calculator(currentOperadTextElement, previousOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()

    })



})

allClearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
});

equalsButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
    showTable()
});
operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay();
        showTable()
    });
});

function showTable() {
    let body = document.createElement('tbody');
    body.id = 'history-body';
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        const value = { result } = JSON.parse(localStorage.getItem(key));

        let keyColummn = document.createElement('td');
        let resultColumn = document.createElement('td');
        let actionColumn = document.createElement('td');
        let deleteColumn = document.createElement('button');

        let row = document.createElement('tr');

        keyColummn.textContent = key;
        resultColumn.textContent = result;
        deleteColumn.textContent = "Delete";
        deleteColumn.onclick = function () {
            localStorage.removeItem(key);
            showTable();
        }

        actionColumn.appendChild(deleteColumn);
        row.appendChild(keyColummn);
        row.appendChild(resultColumn);
        row.appendChild(actionColumn);
        body.appendChild(row);
    }
    document.getElementById('history-body').replaceWith(body);
}
window.onload = showTable();