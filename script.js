// Selecting elements
const logContainerEl = document.querySelector(".log__container");
const inputLogin = document.querySelector(".input--log");
const inputPIN = document.querySelector(".input--password");
const navTitle = document.querySelector(".nav__title");
const logBtn = document.querySelector(".log__btn");
const wrapper = document.querySelector(".wrapper");
const balanceEl = document.querySelector(".balance__value");
const historyEl = document.querySelector(".history__container");
const transferBtn = document.querySelector(".btn--transfer");
const inputTransferTo = document.querySelector(".input__transfer--to");
const inputTransferAmount = document.querySelector(".input__transfer--amount");
const inputLoanAmount = document.querySelector(".input__loan--amount");
const loanBtn = document.querySelector(".btn--loan");
const inputCloseUser = document.querySelector(".input__close--user");
const inputClosePIN = document.querySelector(".input__close--PIN");
const closeBtn = document.querySelector(".btn--close");
// Variables
let loginStatus = false;
let currentAccount;
let balance;
// Data

const user1 = {
  fName: "Artur",
  sName: "Spunei",
  login: "js",
  password: 1111,
  movements: [1300, -2500, 4500, 7850, -5555, 450, 133, -985, -2950, 15],
  movementsDate: [
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
  ],
  locales: "md-MD",
};

const user2 = {
  fName: "Sebastian",
  sName: "Spunei",
  login: "jd",
  password: 2222,
  movements: [
    999, -1500, 1300, -5555, 450, 133, -985, -2500, 4500, 7850, -2950, 15,
  ],
  movementsDate: [
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
    "11/16/2022",
  ],
  locales: "en-US",
};
const users = [user1, user2];

const optionsForNumberFormating = {
  style: "currency",
  currency: "EUR",
};
// Functions        ===================================================

// Implementing log in function
const loginFunction = function (user) {
  currentAccount = user;
  loginStatus = true;
  inputLogin.value = "";
  inputPIN.value = "";
  wrapper.classList.remove("class__display");
  navTitle.textContent = `Welcome, ${currentAccount.fName}!`;
  // Update UI
  updateUI();
};

// Function Update UI
const updateUI = function () {
  balance = 0;
  historyEl.innerHTML = "";
  currentAccount.movements.forEach((mov, i) => {
    // Formating every movement
    const formatedMov = new Intl.NumberFormat(
      currentAccount.locales,
      optionsForNumberFormating
    ).format(mov);
    // Computing the balance
    balance += mov;
    // Inserting each movement into history section
    historyEl.insertAdjacentHTML(
      "afterbegin",
      `<div class="payments__container">
    <div class="payment__type payment__type--${
      mov > 0 ? "deposit" : "withdrawal"
    }">${i + 1} ${mov > 0 ? "deposit" : "withdrawal"}</div>
    <div class="payment__date">${currentAccount.movementsDate[i]}</div>
    <div class="payment__value">${formatedMov}</div>
  </div>`
    );
  });
  balanceEl.textContent = new Intl.NumberFormat(
    currentAccount.locales,
    optionsForNumberFormating
  ).format(balance);
};
loginFunction(user1); // always logged in ------------------------------

// Function add movement
const addMovement = function (user, value) {
  const date = new Date();
  // Change in movements in current acc
  user.movements.push(value);
  user.movementsDate.push(new Intl.DateTimeFormat("en-US").format(date));
};
// Function Transfer Mechanics

const transferMoney = function (currentAccount) {
  let receiverAcc;
  const trasnferValue = Number(inputTransferAmount.value);
  users.forEach(function (user) {
    if (user.login === inputTransferTo.value && currentAccount !== user)
      receiverAcc = user;
    return;
  });

  if (receiverAcc) {
    // Change in movements in current acc
    addMovement(currentAccount, -trasnferValue);
    // Change in movements in receiver acc
    addMovement(receiverAcc, trasnferValue);

    inputTransferAmount.value = "";
    inputTransferTo.value = "";
  }
};

// Function Loan Mechanics
const loanFunction = function (loanValue) {
  const maxMovement = currentAccount.movements.reduce((acc, mov) =>
    acc > mov || acc === undefined ? acc : mov
  );
  if (loanValue <= (maxMovement * 25) / 100) {
    addMovement(currentAccount, loanValue);
  }
};

// Events           ===================================================

logBtn.addEventListener("click", function (e) {
  users.forEach((user) => {
    if (
      user.login === inputLogin.value &&
      user.password === Number(inputPIN.value)
    ) {
      loginFunction(user);
      return;
    }
  });
});

// Log btn pressed using Enter key
const pressingLogBtn = function (e) {
  console.log(e.target);
  if (e.key === "Enter") {
    logBtn.click();
  }
  if (loginStatus) {
    window.removeEventListener("keypress", pressingLogBtn);
  }
};
inputLogin.addEventListener("focus", function (e) {
  window.addEventListener("keypress", pressingLogBtn);
});

// Transfer mechanics
transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputTransferAmount.value > 0 &&
    inputTransferAmount.value < 25000 &&
    inputTransferAmount.value <= balance
  ) {
    transferMoney(currentAccount);
    updateUI();
  }
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const loanValue = Number(inputLoanAmount.value);
  if (loanValue > 0) {
    loanFunction(loanValue);
    inputLoanAmount.value = "";
    updateUI();
  }
});

//
