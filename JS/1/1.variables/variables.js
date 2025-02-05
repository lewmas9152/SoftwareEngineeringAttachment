// QUESTION 1 (DECLARING VARIABLES)

//1. Declare a variable age using let and assign it the value 25
let age = 25;

//2. Declare a variable schoolName using const and assign it "Greenwood High".
const schoolName = "Greenwood High";

//3. Declare an empty array called studentsList.
let studentsList = [];

// 4. What is the difference between let, const, and var when declaring variables?
    // CONST : Used to declare variables that are not expected to change anywhere else in the program
    // LET: Used to declare variables which can change at any point in the program
    // VAR: A traditional way of declaring a variable which can change at any point in the program


// QUESTION 2( VALID VARIABLE NAMES)

//4 Which of the following variable names is invalid?
let $price = 100; // A variable name can start with dollar sign
let _score = 89; // A variable name can start with an _ sign
let userName = "Alice"; // A variable name can be written in camelCase

// 5) Why is the following variable name incorrect?
// CONST #TAXRATE is incorrect because it starts with # which does not fall in the naming conventions

// 6)Rewrite this variable name to follow best practices:
let myVariableName = "JavaScript";

// QUESTION 3 IDENTIFYING DATATYPES
//7 What will be the output of the following?
console.log(typeof "Hello"); // String
console.log(typeof 99); //number
console.log(typeof true); // boolean
console.log(typeof undefined); //undefined

//8  IDENTIFY THE DATA TYPES IN THIS ARRAY
let data = ["Kenya", 34, false, { country: "USA" }, null];
console.log(typeof data);
console.log(typeof data[0]);
console.log(typeof data[1]);
console.log(typeof data[2]);
console.log(typeof data[3]);
console.log(typeof data[4]);

//9 HOW DO YOU DEFINE A BIGINT IN JAVASCRIPT? PROVIDE AN EXAMPLE

let cost = 1200000000000000000n;

//QUESTION 4 (OBJECTS & ARRAYS)
//11. Create an object person with properties name, age, and city.
let person = {
  name: "sam",
  age: 19,
  city: "Nakuru",
};

//12 Add a new property email to the person object

person.email = "samwel@gmail.com";

//13 Declare an array fruits with three fruit names.
let fruits = ["mangoes", "passion", "Avocado"];

//14 Access the second item in the fruits array.
console.log(fruits[1]);

//QUESTION 5 (TYPE COERCION)

//15 What will be the output of the following?

console.log("5" + 2); // 52
console.log("5" - 2); // 3

//16 Convert the string "100" into a number

console.log(parseInt("100"));

//17 Convert the number 50 into a string.
let num = 50;
console.log(num.toString());

//18 What will be the result of this operation?
console.log(5 + true); // 6
