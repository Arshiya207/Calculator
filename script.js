// variables
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const percentageButton = document.querySelector("[data-percentage]");
const deleteButton = document.querySelector("[data-delete]");
const clearButton = document.querySelector("[data-clear-all]");
const previousOperandElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandElement = document.querySelector("[data-current-operand]");
const equalButton = document.querySelector("[data-equal]");
// functions

//classes
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.currentOperandElement = currentOperandElement;
    this.previousOperandElment = previousOperandElement;
    this.operator = undefined;
    this.previousOperand = "";
    this.currentOperand = "";
  }
  clear() {
    this.operator = undefined;
    this.previousOperand = "";
    this.currentOperand = "";
  }
  del() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (this.currentOperand.length === 16) {
      return;
    }
    if (isNaN(this.currentOperand) && this.currentOperand !== ".") {
      this.clear();
      return;
    }
    if (this.currentOperand.toString().includes(".") && number === ".") return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand.toString() === "" || isNaN(this.currentOperand))
      return;
    if (
      this.previousOperand / this.currentOperand === Infinity &&
      Number(this.currentOperand) === 0
    ) {
      this.currentOperand = "don't divide by zero";
      this.operator = undefined;
      this.previousOperand = "";
      return;
    }
    if (this.operator !== "") {
      this.compute();
    }
    this.operator = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }
  displayDigit(number) {
    let stringNumber = number.toString();
    let integerDigit = parseFloat(stringNumber.split(".")[0]);
    let floatDigit = stringNumber.split(".")[1];
    let intDisplay;

    if (isNaN(integerDigit)) {
      intDisplay = "";
    } else {
      intDisplay = integerDigit.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (floatDigit !== undefined) {
      return `${intDisplay}.${floatDigit}`;
    } else {
      return intDisplay;
    }
  }
  percentage() {
    if (this.currentOperand.toString() === "" || isNaN(this.currentOperand))
      return;
    if (isNaN(this.currentOperand) && this.currentOperand !== ".") {
      this.clear();
      return;
    }
    this.currentOperand = this.currentOperand / 100;
  }
  compute() {
    let computationResult;
    if (this.currentOperand.toString() === "" || isNaN(this.currentOperand))
      return;
    if (
      this.previousOperand / this.currentOperand === Infinity &&
      Number(this.currentOperand) === 0
    ) {
      this.currentOperand = "don't divide by zero";
      this.operator = undefined;
      this.previousOperand = "";
      return;
    }

    switch (this.operator) {
      case "-":
        computationResult =
          Number(this.previousOperand) - Number(this.currentOperand);
        break;
      case "+":
        computationResult =
          Number(this.previousOperand) + Number(this.currentOperand);
        break;
      case "÷":
        computationResult =
          Number(this.previousOperand) / Number(this.currentOperand);
        break;
      case "×":
        computationResult =
          Number(this.previousOperand) * Number(this.currentOperand);
        break;
      default:
        return;
    }

    this.currentOperand = computationResult;
    this.operator = undefined;
    this.previousOperand = "";
  }
  updateScreen() {
    if (this.currentOperand.toString().includes(",")) {
      this.currentOperandElement.innerText = this.displayDigit(
        this.currentOperand
      );
    } else {
      this.currentOperandElement.innerText = this.currentOperand;
    }

    if (!isNaN(this.currentOperand)) {
      this.currentOperandElement.innerText = this.displayDigit(
        this.currentOperand
      );
    } else {
      this.currentOperandElement.innerText = this.currentOperand;
    }

    if (this.operator !== undefined) {
      this.previousOperandElment.innerText =
        this.displayDigit(this.previousOperand) + " " + this.operator;
    } else {
      this.previousOperandElment.innerText = this.previousOperand;
    }
  }
}
let calc = new Calculator(previousOperandElement, currentOperandElement);
// add event listeners
numberButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.appendNumber(btn.innerText);
    calc.updateScreen();
  });
});
clearButton.addEventListener("click", () => {
  calc.clear();
  calc.updateScreen();
});
deleteButton.addEventListener("click", () => {
  calc.del();
  calc.updateScreen();
});
operatorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.chooseOperation(btn.innerText);
    calc.updateScreen();
  });
});

equalButton.addEventListener("click", () => {
  calc.compute();
  calc.updateScreen();
});

percentageButton.addEventListener("click", () => {
  calc.percentage();
  calc.updateScreen();
});
