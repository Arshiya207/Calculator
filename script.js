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
const historyClearbutton = document.querySelector(".clear-history");
const calculatorHistoryElement = document.querySelector(".calculator-history");
const nightModeButton = document.querySelector(".night-mode-icon-container");
const htm = document.querySelector("html");
const darkModeOverlay = document.querySelector(".dark-mode-overlay ");
const imgColorMode = nightModeButton.querySelector(".night-mode-icon");
// functions
function updateHistory() {
  const historyMessage = document.querySelector(".history-message");
  const historyClearbutton = document.querySelector(".clear-history");
  const cardHistoryArr =
    JSON.parse(localStorage.getItem("calculateHistory")) ?? [];
  const colorMode = localStorage.getItem("colorMode") ?? "dark";

  if (cardHistoryArr.length !== 0) {
    historyMessage.classList.add("d-none");
    historyClearbutton.classList.remove("d-none");
    cardHistoryArr.forEach((card) => {
      calculatorHistoryElement.innerHTML += card;
    });
  } else {
    historyMessage.classList.remove("d-none");
    historyClearbutton.classList.add("d-none");
  }
  if (colorMode === "dark") {
    htm.dataset.colorMode = "dark";
    imgColorMode.src = "icons/night.png";
  } else {
    htm.dataset.colorMode = "light";
    imgColorMode.src = "icons/sun.png";
    darkModeOverlay.classList.add("d-none");
    darkModeOverlay.classList.add("remove-overlay");

    setTimeout(() => {
      darkModeOverlay.classList.remove("d-none");
    }, 100);
  }
}

//classes
class History {
  constructor(calculatorHistoryElement) {
    this.calculatorHistoryElement = calculatorHistoryElement;
    this.calcHistoryCard = "";
  }
  clearAll() {
    let cards = this.calculatorHistoryElement.querySelectorAll(".history-card");

    cards.forEach((card) => {
      card.remove();
    });
    localStorage.setItem("calculateHistory", "[]");
    this.showHistoryMessageOrNot();
  }
  convertTo12Format(hours, minutes) {
    let hourToNum = parseInt(hours);
    let minutesToNum = parseInt(minutes);
    let hourIndentifier = hourToNum >= 12 ? "PM" : "AM";

    let hour12 = hourToNum % 12;
    hour12 = hour12 ? hour12 : 12;

    const completetime = `${hour12}:${minutesToNum} ${hourIndentifier}`;
    return completetime;
  }
  showHistoryMessageOrNot() {
    const historyMessage = document.querySelector(".history-message");
    const historyClearbutton = document.querySelector(".clear-history");
    const cardHistoryArr =
      JSON.parse(localStorage.getItem("calculateHistory")) ?? [];
    if (cardHistoryArr.length !== 0) {
      historyMessage.classList.add("d-none");
      historyClearbutton.classList.remove("d-none");
    } else {
      historyMessage.classList.remove("d-none");
      historyClearbutton.classList.add("d-none");
    }
  }
  appendHistory(
    previousOperand,
    currentOperand,
    hours,
    minutes,
    operator,
    result
  ) {
    const date = this.convertTo12Format(hours, minutes);
    this.calcHistoryCard = `   <div class="history-card ">
    <div class="right-side">
        <div class="statement">${previousOperand} ${operator} ${currentOperand}</div>
        <div class="statement-result">${result}</div>
    </div>
    <div class="left-side">
        <div class="history-time-of-commit">${date}</div>
        <button class="delete-history"><i class="bi bi-trash"></i></button>
    </div>
    </div>`;

    if (localStorage.getItem("calculateHistory") === null) {
      const calculateCardsArr = [];
      calculateCardsArr.push(this.calcHistoryCard);
      localStorage.setItem(
        "calculateHistory",
        JSON.stringify(calculateCardsArr)
      );
    } else {
      const calculateCardsArrParse = JSON.parse(
        localStorage.getItem("calculateHistory")
      );
      calculateCardsArrParse.push(this.calcHistoryCard);
      localStorage.setItem(
        "calculateHistory",
        JSON.stringify(calculateCardsArrParse)
      );
    }

    this.calcHistoryCard = `   <div class="history-card slide-in">
    <div class="right-side">
        <div class="statement">${previousOperand} ${operator} ${currentOperand}</div>
        <div class="statement-result">${result}</div>
    </div>
    <div class="left-side">
        <div class="history-time-of-commit">${date}</div>
        <button class="delete-history"><i class="bi bi-trash"></i></button>
    </div>
    </div>`;
  }
  removeAnimation() {
    let cards = this.calculatorHistoryElement.querySelectorAll(".history-card");
    cards.forEach((card) => {
      card.addEventListener("animationend", () => {
        card.classList.remove("slide-in");
      });
    });
  }
  deleteHistory(cardElement) {
    cardElement.classList.add("slide-out");
    cardElement.addEventListener("animationend", () => {
      cardElement.remove();
      const cardElementsOld =
        this.calculatorHistoryElement.querySelectorAll(".history-card");
      const cardElementsNew = [];
      cardElementsOld.forEach((oldCard) => {
        let structured = `<div class="history-card">${oldCard.innerHTML} </div>`;
        cardElementsNew.push(structured);
      });
      console.log(cardElementsNew);
      localStorage.setItem("calculateHistory", JSON.stringify(cardElementsNew));
      this.showHistoryMessageOrNot();
    });
  }
  updateScreen() {
    this.calculatorHistoryElement.innerHTML += this.calcHistoryCard;
    this.removeAnimation();
    this.showHistoryMessageOrNot();
  }
}

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

    const date = new Date();
    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    history.appendHistory(
      this.previousOperand,
      this.currentOperand,
      hours24,
      minutes,
      this.operator,
      computationResult
    );
    history.updateScreen();

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
let history = new History(calculatorHistoryElement);
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
  btn.addEventListener("click", (e) => {
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

historyClearbutton.addEventListener("click", () => {
  history.clearAll();
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("clear-history")) {
    history.clearAll();
  }
});
calculatorHistoryElement.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-history")) {
    history.deleteHistory(e.target.parentNode.parentNode);
  }
});

window.addEventListener("load", updateHistory);
nightModeButton.addEventListener("click", () => {
  const colorMode = htm.dataset.colorMode;

  //const darkMode=localStorage.getItem("colorMode") ?? "dark"
  if (colorMode === "dark") {
    imgColorMode.classList.remove("swirl-in");
    imgColorMode.classList.add("swirl-out");

    imgColorMode.addEventListener("animationend", () => {
      imgColorMode.src = "icons/sun.png";
      imgColorMode.classList.remove("swirl-out");
      imgColorMode.classList.add("swirl-in");
      darkModeOverlay.classList.add("remove-overlay");
      htm.dataset.colorMode = "light";
      localStorage.setItem("colorMode", "light");
    });
  } else {
    imgColorMode.classList.remove("swirl-in");
    imgColorMode.classList.add("swirl-out");
    imgColorMode.addEventListener("animationend", () => {
      imgColorMode.src = "icons/night.png";
      imgColorMode.classList.remove("swirl-out");
      imgColorMode.classList.add("swirl-in");
      darkModeOverlay.classList.remove("remove-overlay");
      htm.dataset.colorMode = "dark";
      localStorage.setItem("colorMode", "dark");
    });
  }
});
