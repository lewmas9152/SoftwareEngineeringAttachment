import bcrypt from "bcrypt";

const saltRounds = 10;
const password = "password123";

async function createUser() {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return {
        "hashedPassword": hashedPassword,
        "correctMfaCode": "123sam",
        "balance": 40000,
        "dailyLimit": 10000
    };
}

const verifyPassword = async (inputPassword, storedHashedPassword) => {
    return await bcrypt.compare(inputPassword, storedHashedPassword);
};

const verifyMFA = (inputMfaCode, correctMfaCode) => {
    return inputMfaCode === correctMfaCode;
};

const checkBalance = (balance, withdrawalAmount) => {
    return balance >= withdrawalAmount;
};

const checkDailyLimit = (withdrawalAmount, dailyLimit) => {
    return withdrawalAmount <= dailyLimit;
};

async function processWithdrawal(user, inputPassword, inputMfaCode, withdrawalAmount) {
    if (!(await verifyPassword(inputPassword, user.hashedPassword))) {
        return "Transaction Failed: Incorrect Password";
    }

    if (!verifyMFA(inputMfaCode, user.correctMfaCode)) {
        return "Transaction Failed: MFA failed";
    }

    if (!checkBalance(user.balance, withdrawalAmount)) {
        return "Transaction Failed: Insufficient balance";
    }

    if (!checkDailyLimit(withdrawalAmount, user.dailyLimit)) {
        return "Transaction Failed: Amount exceeds daily limit.";
    }

    user.balance -= withdrawalAmount;
    return `Transaction Successful! New Balance: ${user.balance}`;
}

// Execute everything
(async () => {
    let user = await createUser();

    let result = await processWithdrawal(user, "password123", "123sam", 10000);
    console.log(result);
})();
