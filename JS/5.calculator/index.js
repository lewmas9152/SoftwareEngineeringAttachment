let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");
let equal = document.querySelector(".equals"); // ✅ Fix: Select a single element
const history = document.getElementById("history");
const display = document.getElementById("display");

let firstNum = "";
let secondNum = "";
let operator = "";

// Add event listeners for number buttons
numbers.forEach((button) => {
  button.addEventListener("click", handleNumber);
});

// Add event listeners for operator buttons
operators.forEach((button) => {
  button.addEventListener("click", handleOperator);
});

// Add event listener for equal button
equal.addEventListener("click", calculate);

// Handle number clicks
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

// Handle operator clicks
function handleOperator(event) {
  const clickedOperator = event.target.textContent;
  
  if (clickedOperator === "C") {
    firstNum = "";
    secondNum = "";
    operator = "";
    history.textContent = "";
    display.textContent = "0"; 
    return; 
  }

  if (firstNum !== "") {
    operator = clickedOperator;
    history.textContent = firstNum + " " + operator;
  }
}

// Perform calculation
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
        result = parseFloat(firstNum) * parseFloat(secondNum);
        break;
      case "÷": 
        result = parseFloat(firstNum) / parseFloat(secondNum);
        break;
      default:
        result = "Error";
    }
    display.textContent = result;
    history.textContent = `${firstNum} ${operator} ${secondNum} =`;

    // Reset for next calculation
    firstNum = result.toString();
    secondNum = "";
    operator = "";
  }
}
