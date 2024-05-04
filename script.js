const inputSlider = document.querySelector("[password-length-slider]");
const passwordDisplay = document.querySelector("[password-display]");
const passwordLength = document.querySelector("[password-length]");
const copyMessagePop = document.querySelector("[copy-message]");
const copyMessageBtn = document.querySelector("[copy-message-btn]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");

const passwordStrength = document.querySelector("[strength-indicator]");
const generateBtn = document.querySelector("[password-generate]");

let password = "";
let passwordLen = 10;
let checkCount = 0;
setIndicator("#ccc");

function handleSlider(passwordLen) {
  inputSlider.value = passwordLen;
  passwordLength.textContent = passwordLen;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLen-min)*100/(max-min))+"% 100%";
}
handleSlider(passwordLen);

function setIndicator(color) {
  passwordStrength.style.backgroundColor = color;
  passwordStrength.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function genRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return genRandomInt(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(genRandomInt(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(genRandomInt(65, 91));
}

function generateSymbol() {
  let symbolsString = "~`!@#$%^&*()_-+={[}]|:;'<,>.?/";
  let randomNum = generateRandomNumber(0, symbolsString.length);
  return symbolsString.charAt(randomNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked){} hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  console.log(hasUpper);
  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLen >= 8) {
    setIndicator("#0f0");
  } else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLen >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMessagePop.innerText = "copied";
  } catch (e) {
    copyMessagePop.innerText = "failed";
  }
  copyMessagePop.classList.add("active");
  setTimeout(() => {
    copyMessagePop.classList.remove("active");
  }, 3000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLen = e.target.value;
  handleSlider(passwordLen);
});

copyMessageBtn.addEventListener("click", (e) => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLen < checkCount) {
    passwordLen = checkCount;
    handleSlider(checkCount);
  }
};
allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function shufflePassword(){
    let arr = Array.from(password);

    // Fisher Yates Method
    for (let i = arr.length-1; i > 0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach((element)=>{
        str+=element;
    });
    return str;
}

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;
  if (passwordLen < checkCount) {
    passwordLen = checkCount;
    handleSlider(checkCount);
  }

  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  password = "";
  //   Compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password +=funcArr[i]();
  }
  //   Remaining addition
  for (let i = 0; i <passwordLen-funcArr.length; i++) {
    let randIndex = genRandomInt(0,funcArr.length);
    password += funcArr[randIndex]();
  }

  //  Shuffle password
  password = shufflePassword();

  passwordDisplay.value = password;
  calculateStrength();

});
