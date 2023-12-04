// Get the total expense from local storage
let totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
document.querySelector(".total-header").textContent =
  `Total: $${totalExpense.toFixed(2)}`;

// Click event to generate new cloned row with Handlebars features
$(document).ready(function () {
  $("#add-expense-btn").click(function () {
    const originalRow = $(".expense-row").first().clone();

    originalRow.find("select").prop("selectedIndex", 0);
    originalRow.find("input").val("");

    $("#expense-container").append(originalRow);
  });

  // Event listener for saving expenses
  $(".card-body").on("click", ".save-btn", async function () {
    const row = $(this).closest(".expense-row");
    const category_id = row.find(".category-select2").val();
    const cost = parseFloat(row.find(".cost-input").val());

    if (category_id && !isNaN(cost)) {
      try {
        const response = await fetch(`/api/budget/`, {
          method: "POST",
          body: JSON.stringify({ category_id, cost }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const existingExpenses =
            JSON.parse(localStorage.getItem("expenses")) || [];

          // Add the new expense to the existing expenses
          existingExpenses.push({ category_id, cost });

          // Save updated expenses to local storage
          localStorage.setItem("expenses", JSON.stringify(existingExpenses));
          totalExpense += cost;
          document.querySelector(".total-header").textContent =
            `Total: $${totalExpense.toFixed(2)}`;
          localStorage.setItem("totalExpense", totalExpense);
        } else {
          alert("Unable to save expense");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error occurred while saving expense");
      }
    }
  });
});

// On page load or when initializing the script
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve expenses from local storage
  const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const expenseContainer = $("#expense-container");

  storedExpenses.forEach((expense) => {
    const newRow = $(".expense-row").first().clone();

    newRow.find(".category-select2").val(expense.category_id);
    newRow.find(".cost-input").val(expense.cost);

    expenseContainer.append(newRow);
  });

  const totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
  document.querySelector(".total-header").textContent =
    `Total: $${totalExpense.toFixed(2)}`;

// Calculate remaining budget based on budget goal and total income
const userInfo = getSavedUserInfoFromCookie();
const monthlyIncome = parseFloat(userInfo.monthlyIncome) || 0;
const savingsGoal = parseFloat(userInfo.savingsGoal) || 0;
const remainingBudget = monthlyIncome - totalExpense;

// Display a message if the user is over budget
if (remainingBudget < 0) {
  alert('Warning: You have exceeded your budget!');
}

// Create data for Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Monthly Income', 'Total Expense', 'Remaining Budget'],
    datasets: [{
      label: 'Budget Overview',
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 205, 86, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)'],
      borderWidth: 1,
      data: [monthlyIncome, totalExpense, remainingBudget]
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
});

// Event listener for deleting expenses
$(document).ready(function () {
  $(".card-body").on("click", ".delete-btn", async function () {
    const row = $(this).closest(".expense-row");
    const budgetId = row.data("id");
    const cost = parseFloat(row.find(".cost-input").val());

    try {
      const response = await fetch(`/api/budget/${budgetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        row.remove();
        totalExpense -= cost;
        document.querySelector(".total-header").textContent =
          `Total: $${totalExpense.toFixed(2)}`;
      } else {
        alert("Unable to delete expense");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while deleting expense");
    }
  });
});


// Function to save user Info as cookies
const saveUserInfoToCookie = (monthlyIncome, savingsGoal) => {
  document.cookie = `monthlyIncome=${monthlyIncome}`;
  document.cookie = `savingsGoal=${savingsGoal}`;
};
// retrieve userInfo
const getSavedUserInfoFromCookie = () => {
  const cookies = document.cookie.split(';');
  let userInfo = {};

  cookies.forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    userInfo[key] = value;
  });

  return userInfo;
};
// Event listener to save userInfo on click 
const saveUserInfo = async (event) => {
  event.preventDefault();

  const monthly_income = parseFloat(document.querySelector('#monthly-income').value);
  const savings_goal = parseFloat(document.querySelector('#budget-goal').value);

  if (!isNaN(monthly_income) && !isNaN(savings_goal)) {
    const response = await fetch('/api/info', {
      method: "POST",
      body: JSON.stringify({ monthly_income, savings_goal }),
      headers: { "Content-Type": "application/json" },
    });


    if (response.ok) {
      // Save data to cookies after successful API call
      saveUserInfoToCookie(monthly_income, savings_goal);
    }
  }
};

document.querySelector('#goals-form').addEventListener('submit', saveUserInfo);

// event listener to update the userInfo
const updateUserInfo = async () => {
  const monthly_income = parseFloat(document.querySelector('#monthly-income').value);
  const savings_goal = parseFloat(document.querySelector('#budget-goal').value);

  if (!isNaN(monthly_income) && !isNaN(savings_goal)) {
    try {
      const response = await fetch('/api/info/', {
        method: "PUT",
        body: JSON.stringify({ monthly_income, savings_goal }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update data in cookies after successful API call
        saveUserInfoToCookie(monthly_income, savings_goal);
        const monthlyIncomeInput = document.querySelector('#monthly-income');
        const savingsGoalInput = document.querySelector('#budget-goal');

        monthlyIncomeInput.value = monthly_income;
        savingsGoalInput.value = savings_goal; // Update cookies here
      } else {
        // Handle error response
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
document.querySelector('#update-btn').addEventListener('click', updateUserInfo);

// event listener to load saved userInput 
document.addEventListener('DOMContentLoaded', () => {
  const userInfo = getSavedUserInfoFromCookie();

  const monthlyIncomeInput = document.querySelector('#monthly-income');
  const savingsGoalInput = document.querySelector('#budget-goal');

  if (userInfo.monthlyIncome) {
    monthlyIncomeInput.value = userInfo.monthlyIncome;
  }

  if (userInfo.savingsGoal) {
    savingsGoalInput.value = userInfo.savingsGoal;
  }
  //variables to use for chart.js
  //compare savingsGoalInput.value, monthlyIncomeInput.value, and totalExpense
  console.log(savingsGoalInput.value)
});
