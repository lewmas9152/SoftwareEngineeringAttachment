let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");
let equal = document.querySelector(".equals");
const history = document.getElementById("history");
const display = document.getElementById("display");

let firstNum = "";
let secondNum = "";
let operator = "";

numbers.forEach((button) => {
  button.addEventListener("click", handleNumber);
});

operators.forEach((button) => {
  button.addEventListener("click", handleOperator);
});

equal.addEventListener("click", calculate);

function handleNumber(event) {
  const clickedValue = event.target.textContent;
  if (operator === "") {
    firstNum += clickedValue;
    display.textContent = firstNum;
  } else {
    secondNum += clickedValue;
    display.textContent = secondNum;
  }
}

function handleOperator(event) {
  const clickedOperator = event.target.textContent;

  if (clickedOperator === "C" || clickedOperator === "CE") {
    firstNum = "";
    secondNum = "";
    operator = "";
    history.textContent = "";
    display.textContent = "0";
    return;
  }

  if (firstNum !== "") {
    operator = clickedOperator;
    if (
      operator == "+" ||
      operator == "-" ||
      operator == "x" ||
      operator == "÷"
    ) {
      history.textContent = firstNum + " " + operator;
    }
  }
}

function calculate() {
  if (firstNum !== "" && secondNum !== "") {
    let result = 0;
    switch (operator) {
      case "+":
        result = parseFloat(firstNum) + parseFloat(secondNum);
        break;
      case "-":
        result = parseFloat(firstNum) - parseFloat(secondNum);
        break;
      case "x":
        const multResult = parseFloat(firstNum) * parseFloat(secondNum);
        result = Math.round(multResult * 1000) / 1000;
        break;
      case "÷":
        const divisionResult = parseFloat(firstNum) / parseFloat(secondNum);
        result = Math.round(divisionResult * 1000) / 1000;
        break;
      default:
        result = "Error";
    }
    display.textContent = result;
    if (
      operator == "+" ||
      operator == "-" ||
      operator == "x" ||
      operator == "÷"
    ) {
      history.textContent = `${firstNum} ${operator} ${secondNum} =`;
    }
    firstNum = result.toString();
    secondNum = "";
    operator = "";
  }
}
