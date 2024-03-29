// let monthlyIncome;
// Get the total expense from local storage
// let totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
// document.querySelector(".total-header").textContent =
//   `Total: $${totalExpense.toFixed(2)}`;
  // Initialize variables for chart data
// monthlyIncome = parseFloat(localStorage.getItem("monthlyIncome")) || 0;
// let savingsGoal = parseFloat(localStorage.getItem("savingsGoal")) || 0;
let existingExpenses = [];
let totalExpense;
let monthlyIncome;
let savingsGoal ;
// Update the charts based on initial values
updateCharts();

  // Click event to generate new cloned row with Handlebars features
$(document).ready(function () {
  $("#add-expense-btn").click(function () {
    const originalRow = $(".expense-row").first().clone();

    originalRow.find("select").prop("selectedIndex", 0);
    originalRow.find("input").val("");

    $("#expense-container").append(originalRow);
  });

// Initialize variables for chart data


// Update the charts based on initial values
updateCharts();
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


          // Add the new expense to the existing expenses
          existingExpenses.push({ category_id, cost });
          totalExpense += cost;
          document.querySelector(".total-header").textContent =
            `Total: $${totalExpense.toFixed(2)}`;
          
        } else {
          alert("Unable to save expense");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error occurred while saving expense");
      }
    }
      // Update charts after saving expenses
  updateCharts();

  });
});


// On page load or when initializing the script
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve expenses from the server for the user with :userid
  fetch('/api/budget/userbudget/:userid', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (res.ok) {
        console.info(res);
        const userData = await res.json();

        // Update relevant variables with fetched data
        monthlyIncome = userData.monthlyIncome || 0;
        savingsGoal = userData.savingsGoal || 0;
        totalExpense = userData.totalExpense || 0;
        existingExpenses = userData.expenses || [];

        // Update elements on the page based on the fetched data
        document.querySelector('.total-header').textContent = `Total: $${totalExpense.toFixed(2)}`;

        // Call functions to update charts based on the new data
        updateCharts();
      } else {
        throw new Error('Failed to fetch user budget data');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors here
    });
});

// Event listener for deleting expenses
$(document).ready(function () {
  $(".card-body").on("click", ".delete-btn", async function () {
    const row = $(this).closest(".expense-row");
    const budgetId = row.data("id");
    console.log("Row:", row);
    console.log("Budget ID:", budgetId);
    const cost = parseFloat(row.find(".cost-input").val());

    try {
      const response = await fetch(`/api/budget/${budgetId}`, {
        method: "DELETE",
      });
console.log("Response:", response);

      if (response.ok) {
        row.remove();
        totalExpense -= cost;
        document.querySelector(".total-header").textContent =
          `Total: $${totalExpense.toFixed(2)}`;
          // Remove the expense from local storage
      const existingExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
      const updatedExpenses = existingExpenses.filter(expense => expense.category_id !== budgetId);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

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
      const data = await response.json(); // Assuming the server sends back the saved data
      monthlyIncome = data.monthly_income; // Update global monthly income variable
      savingsGoal = data.savings_goal; 
      // Update input fields with the saved information
      const monthlyIncomeInput = document.querySelector('#monthly-income');
      const savingsGoalInput = document.querySelector('#budget-goal');
    
      monthlyIncomeInput.value = monthlyIncome; // Update monthly income input
      savingsGoalInput.value = savingsGoal;// Update savings goal input
    
      // Save data to cookies after successful API call
      saveUserInfoToCookie(monthly_income, savings_goal);
      updateCharts();
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
        updateCharts();
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
  // Update charts after updating user info
  updateCharts();
  
  // Function to update charts
function updateCharts() {
  // Update monthlyIncome and savingsGoal based on user input or saved data
  monthlyIncome = parseFloat($("#monthly-income").val()) || monthlyIncome;
  savingsGoal = parseFloat($("#budget-goal").val()) || savingsGoal;

  
  // Update or create the donut chart
  createOrUpdateDonutChart();

  // Update or create the bar chart
  createOrUpdateBarChart();
}

// Function to create or update the donut chart
function createOrUpdateDonutChart() {
  let amountSaved = monthlyIncome - totalExpense;
  const donutChartCanvas = document.getElementById("donut-chart");
  const donutChartData = {
    labels: ["Monthly Income", "Amount Saved", "Amount Spent"],
    datasets: [{
      data: [monthlyIncome, amountSaved, totalExpense],
      backgroundColor: ["#36A2EB", "#4CAF50", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#4CAF50", "#FF6384"],
    }],
  };

  if (window.donutChart) {
    // Update existing chart
    window.donutChart.data = donutChartData;
    window.donutChart.update();
  } else {
    //Create new chart
    window.donutChart = new Chart(donutChartCanvas, {
      type: "doughnut",
      data: donutChartData,
    });
  }
}

// Function to create or update the bar chart
function createOrUpdateBarChart() {
  const barChartCanvas = document.getElementById("bar-chart");
  const barChartData = {
    labels: ["Savings Goal", "Total Expense"],
    datasets: [{
      label: "Amount",
      data: [savingsGoal, totalExpense],
      backgroundColor: ["#36A2EB", "#FF6384"],
      borderColor: ["#36A2EB", "#FF6384"],
      borderWidth: 1,
    }],
  };

  if (window.barChart) {
    // Update existing chart
    window.barChart.data = barChartData;
    window.barChart.update();
  } else {
    //Create new chart
    window.barChart = new Chart(barChartCanvas, {
      type: "bar",
      data: barChartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
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
