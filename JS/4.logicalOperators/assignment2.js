 // 1. Check if a string is a palindrome

function isPalindrome(str) {
  let string = str
    .split(" ")
    .join("")
    .replaceAll(/[, ? !]/g, "")
    .toLowerCase();
  let result = string.split("").reverse().join("");
  return result === string;
}
console.log(isPalindrome("A man, a plan, a canal, Panama"));
console.log(isPalindrome("Was it a car or a cat I saw ?"));
console.log(isPalindrome("Hello, World!"));

//2 Reverse a string
const reverser = (str) => {
  let result = str.split("").reverse().join("");
  console.log(str);
  return result;
};

console.log(reverser("Kelvin"));

// 3 find the longest palindromic substring
function longestPalindromicSubstring(s) {
  let results = "";
  let palindromes = [];
  let string = s.split("");
  for (let i = 0; i < string.length; i++) {
    for (let j = 0; j < string.length; j++) {
      let temp = string.slice(i, j + 1).join("");
      if (temp.length >= results.length && isPalindrome(temp)) {
        results = temp;
        palindromes.push(temp);
      }
    }
  }
  return results;
}
console.log(longestPalindromicSubstring("babad"));
console.log(longestPalindromicSubstring("cbbd"));

// 4 Check if Strings are Anagrams
function anagrams(str1, str2) {
  if (str1.length !== str2.length) return false;

  let charCount = {};

  for (let char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (let char of str2) {
    if (!charCount[char]) return false;
    charCount[char]--;
  }

  return true;
}

console.log(anagrams("listen", "silent")); // Output: true
console.log(anagrams("hello", "world")); // Output: false

//5 Remove duplicates from string
function removeDuplicates(str) {
  let result = "";
  let string = str.toLowerCase().split("");
  for (let i = 0; i < string.length; i++) {
    if (!result.includes(string[i])) {
      result += string[i];
    }
  }
  return result;
}

console.log(removeDuplicates("programming"));
console.log(removeDuplicates("hello world"));
console.log(removeDuplicates("aaaa"));
console.log(removeDuplicates("abcd"));
console.log(removeDuplicates("aabbcc"));

// 6 Count  Palindromes in a string
function countPalindromes(s) {
  let palindromes = new Set();

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      palindromes.add(s.substring(left, right + 1));
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);
    expandAroundCenter(i, i + 1);
  }

  return palindromes.size;
}

console.log(countPalindromes("ababa"));
console.log(countPalindromes("racecar"));
console.log(countPalindromes("aabb"));
console.log(countPalindromes("a"));
console.log(countPalindromes("abc"));

//7 longest common prefix
const longestCommonPrefix = (array) => {
  let str1 = array[0].split("");
  let str2 = array[1].split("");
  let str3 = array[2].split("");
  let result = "";
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] == str2[i] && str1[i] == str3[i]) {
      result += str1[i];
    }
  }
  return result;
};

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "racecar", "car"]));
console.log(
  longestCommonPrefix(["interspecies", "interstellar", "interstate"])
);
console.log(longestCommonPrefix(["prefixes", "preform", "prefix"]));
console.log(longestCommonPrefix(["apple", "banana", "cherry"]));

//8 case Insensitive Palindrome
function isCaseInsensitivePalindrome(str) {
  str = str.toLowerCase();
  let result = str.split("").reverse().join("");
  return str == result;
}

console.log(isCaseInsensitivePalindrome("Aba"));
console.log(isCaseInsensitivePalindrome("Racecar"));
console.log(isCaseInsensitivePalindrome("Palindrome"));
console.log(isCaseInsensitivePalindrome("Madam"));
console.log(isCaseInsensitivePalindrome("Hello"));


