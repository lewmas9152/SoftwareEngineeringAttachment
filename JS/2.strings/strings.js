//JavaScript String Practice Questions
// 1 CHECK STRING INPUT

//Write a JavaScript function to check whether an 'input' is a string or not

const is_string = (input) => {
  return typeof input == "string";
};
console.log(is_string("hello"));
console.log(is_string([1, 2, 3, 4]));

// 2 .CHECK BLANK STRING

const is_blank = (string) => {
  return !string || string.trim == "";
};

console.log(is_blank("")); //true
console.log(is_blank("abc")); //false

// 3. STRING TO ARRAY OF WORDS
//Write a JavaScript function to split a string and convert it into an array of words.

const string_to_array = (string) => {
  return string.split(" ");
};

console.log(string_to_array("Robin Singh")); // ['Robin', ''Singh]

//4 . EXTRACT CHARACTERS
// Write a JavaScript function to extract a specified number of characters from astring
const truncate_string = (string, num) => {
  return string.substr(string, num);
};

console.log(truncate_string("Robin Singh", 4));

//5. ABBREVIATE NAME
// Write a JavaScript function to convert a string into abbreviated form

const abbrev_name = (string) => {
  parts = string.trim().split(" ");
  return `"${parts[0]} ${parts[1][0]}."`;
};

console.log(abbrev_name("Robin Singh"));

//6 HIDE EMAIL ADDRESS
// Write a JavaScript function that hides email addresses to prevent unauthorizedaccess.

const protect_email = (email) => {
  start = email.indexOf("_");
  ending = email.indexOf("@");
  subString = email.substring(start, ending);
  return email.replace(subString, "...");
};

console.log(protect_email("robin_singh@example.com"));

// 7 PAREMEARIZE STRING
// Write a JavaScript function to parameterize a string.
const string_parametarize = (string) => {
  lower = string.toLowerCase();
  return lower.replaceAll(" ", "-");
};

console.log(string_parametarize("Robin Singh from USA."));

// 8  cAPITALIZE FIRST LETTER
// Write a JavaScript function to capitalize the first letter of a string.

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

console.log(capitalize("js string exercises"));

//9 CAPITALIZE EACH WORD
// Write a JavaScript function to capitalize the first letter of each word in a string

const capitalize_words = (string) => {
  let upperParts = [];
  parts = string.split(" ");
  parts.forEach((part) => {
    upper = part[0].toUpperCase();
    upperParts += ` ${upper}${part.slice(1)}`;
  });
  return upperParts.trim();
};

console.log(capitalize_words("js string exercises"));

//10 Swap Case
//Write a JavaScript function that converts uppercase letters to lowercase and viceversa.

const swapcase = (string) => {
  let swapped = [];
  letters = string.split("");
  letters.forEach((char) => {
    if (char.toUpperCase() == char) {
      swapped += char.toLowerCase();
    } else {
      swapped += char.toUpperCase();
    }
  });
  return swapped;
};

console.log(swapcase("AaBbc")); // "aAbBC"

//11 CAMELIZE STRING
//Write a JavaScript function to convert a string into camel case.

const camelize = (string) => {
  let camelized = [];
  words = string.split(" ");
  firstWord = words[0].toLowerCase();
  camelized += firstWord;
  len = firstWord.length + 1;
  other = string.slice(len);
  rem = other.split(" ");
  rem.forEach((word) => {
    x = `${word[0].toUpperCase()}${word.slice(1)} `;
    camelized += x;
  });
  return camelized;
};

console.log(camelize("JavaScript Exercises")); //javaScriptExercises

//12 UNCAMELIZE STRING
//Write a JavaScript function to uncamelize a string

const uncamelize = (str, separator = " ") => {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (i > 0 && str[i] == str[i].toUpperCase()) {
      result += separator;
    }
    result += str[i];
  }
  return result.toLowerCase();
};

console.log(uncamelize("helloWorld", "-")); //"hello-world"
console.log(uncamelize("helloWorld")); // hello world

//13 REPEAT STRING
//Write a JavaScript function to concatenate a given string n times.

const repeat = (str, num) => {
  let result = "";
  for (let i = 0; i < num; i++) {
    result += str;
  }
  return result;
};

console.log(repeat("Ha!", 3)); // "Ha!Ha!Ha!"

//14 INSERT IN STRING

//Write a JavaScript function to insert a string within another string at a given position.

const insert = (str, text, num) => {
  firstPart = str.substring(0, num);
  secondPart = str.slice(num);
  return firstPart + text + secondPart;
};

console.log(insert("We are doing some exercises.", "JavaScript ", 18));
// "We are doing some JavaScript exercises."

//15 HUMANIZE FORMAT
// Write a JavaScript function that formats a number with the correct suffix (1st, 2nd, etc.).

const humanize = (num) => {
  number = num.toString();
  lastindex = number.length - 1;
  lastDigit = number[lastindex];

  if (lastDigit == 1) {
    return number + "st";
  } else if (lastDigit == 2) {
    return number + "nd";
  } else if (lastDigit == 3) {
    return number + "rd";
  }
  else return number + "th"
};

console.log(humanize(301)); // "301st"

// 16 TRUNCATE STRING WITH ELLIPSIS
//Write a JavaScript function to truncate a string and append "..."


const text_truncate = (str, pos, punc= "...") => {
   let string = str.substring(0,pos-2)
   return string + punc
}

console.log(text_truncate('We are doing JS string exercises.', 15, '!!'));

// 17 CHOP STRING INTO CHUNKS
//Write a JavaScript function to chop a string into chunks.
function string_chop(str, size) {
  if (size <= 0) return [str]; // Handle invalid chunk sizes
  let result = [];

  for (let i = 0; i < str.length; i += size) {
      result.push(str.slice(i, i + size));
  }

  return result;
}

console.log(string_chop('w3resource', 3)); // ["w3r", "eso", "urc", "e"]

//18 Count Substring Occurrences
//Write a JavaScript function to count occurrences of a substring in a string

function countOccurrences(str, subStr) {
  str = str.toLowerCase();   // Convert both to lowercase for case-insensitive comparison
  subStr = subStr.toLowerCase();

  let count = 0;
  let pos = str.indexOf(subStr);

  while (pos !== -1) {
      count++;
      pos = str.indexOf(subStr, pos + 1); // Find next occurrence
  }

  return count;
}


console.log(countOccurrences("The quick brown fox jumps over the lazy dog", "the")); //  2


//19  Reverse Binary Representation
//Write a JavaScript function that reverses the binary representation of a number and returns its decimal form.

function reverse_binary(num) {
  let binary = num.toString(2);   
  let reversedBinary = binary.split("").reverse().join(""); 
  return parseInt(reversedBinary, 2); 
}

console.log(reverse_binary(100)); // 19

//20  Pad String to Length
//Write a JavaScript function to pad a string to a specified length.


function formatted_string(template, num, align = 'l') {
  let numStr = num.toString();
  let padLength = template.length - numStr.length;

  if (padLength <= 0) return numStr; // No padding needed

  let padding = template.slice(0, padLength); // Take the necessary padding

  return align === 'l' ? padding + numStr : numStr + padding;
}

// Test Cases
console.log(formatted_string('0000', 123, 'l')); // "0123"
console.log(formatted_string('000000', 45, 'r')); // "450000"
