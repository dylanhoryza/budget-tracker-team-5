document.addEventListener('DOMContentLoaded', async function() {
  await getUserInfo();
  await getUserBudget();

  const saveButton = document.getElementById('goals-btn');
  saveButton.addEventListener('click', async function(event) {
    event.preventDefault();
    await postUserInfo();
    await getUserInfo();
  });

  const updateButton = document.getElementById('update-btn');
  updateButton.addEventListener('click', async function(event) {
    event.preventDefault();
    await updateUserInfo();
    await postUserInfo();
    await getUserInfo();
  });

  const addExpenseButton = document.getElementById('add-expense-btn');
  addExpenseButton.addEventListener('click', async function(event) {
    event.preventDefault();
    await postUserBudget();
    await getUserBudget();
  })
});

// get User id
async function getUserId() {
  try {
    const response = await fetch('/api/info/userinfo/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData);
      return userData.user_id; 
    } else {
      console.error('Failed to fetch user info ID');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}


// Function to store monthly income and savings goal on page
async function postUserInfo() {
  const monthlyIncome = parseFloat(document.querySelector("#monthly-income").value);
  const savingsGoal = parseFloat(document.querySelector("#budget-goal").value);
  
    try {
      const response = await fetch(`/api/info/`, {
        method: "POST",
        body: JSON.stringify({ monthly_income: monthlyIncome, savings_goal: savingsGoal }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        document.getElementById("monthly-income-value").textContent = monthlyIncome;
        document.getElementById("savings-goal-value").textContent = savingsGoal;
        updateCharts();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while saving expense");
      console.error('User ID is null');
    }
  }

// function to retreive monthly income and savings goal
async function getUserInfo() {
  try {
    const response = await fetch("/api/info/userinfo/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();

      document.getElementById("monthly-income-value").textContent =
        userData.monthly_income;
      document.getElementById("savings-goal-value").textContent =
        userData.savings_goal;
    }
  } catch (error) {
    console.error("Error:", error);
    
  }
}
// get userInfo id
async function getUserInfoId() {
  try {
    const response = await fetch('/api/info/userinfo/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData);
      return userData.id; 
    } else {
      console.error('Failed to fetch user info ID');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Update monthly income and savings goal
async function updateUserInfo() {
  const updatedMonthlyIncome = parseFloat(document.querySelector('#monthly-income').value);
  const updatedSavingsGoal = parseFloat(document.querySelector('#budget-goal').value);
  const userInfoId = await getUserInfoId(); 
  
  if (userInfoId !== null) {
    try {
      const response = await fetch(`/api/info/${userInfoId}`, {
        method: 'PUT',
        body: JSON.stringify({ monthly_income: updatedMonthlyIncome, savings_goal: updatedSavingsGoal }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        document.getElementById('monthly-income-value').textContent = userData.monthly_income;
        document.getElementById('savings-goal-value').textContent = userData.savings_goal;
        console.log('success');
        updateCharts();
      } else {
        console.error('Failed to update user info');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.error('User info ID is null');
  }
}

// Get user budget 
async function getUserBudget() {
  try {
    const response = await fetch("/api/budget/userbudget/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData);
      return userData.budgets || [0];
    }
  } catch (error) {
    console.error("Error:", error);
    
  }
  return [];
}


// post new User budget
async function postUserBudget() {
  const categorySelect = document.querySelector('.category-select2');
  const selectedOption = categorySelect.options[categorySelect.selectedIndex];
  const category_id = selectedOption.dataset.categoryId;
  const cost = parseFloat(document.querySelector('.cost-input').value);

  try {
    const response = await fetch(`/api/budget/`, {
      method: "POST",
      body: JSON.stringify({ category_id, cost }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
       
      console.log('Expense added successfully');
      
      await getUserBudget();
      updateCharts();

    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error occurred while saving expense");
  }
}
// Get individual budget ids
async function getBudgetId() {
  try {
    const response = await fetch('/api/budget/userbudget/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userBudget = await response.json();
      const budgets = userBudget.budgets || []; 

      
      const budgetIds = budgets.map((budget) => budget.id);
      console.log(budgetIds);
      return budgetIds;
    } else {
      console.error('Failed to fetch user info ID');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

getBudgetId();

// delete route and click event to remove budget
document.addEventListener('DOMContentLoaded', async () => {
  const deleteButtons = document.querySelectorAll('.delete-budget');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      try {
        const budgetIds = await getBudgetId();
        
        if (budgetIds && budgetIds.length > 0) {
          const budgetId = budgetIds[0]; 

          const response = await fetch(`/api/budget/${budgetId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Remove the deleted budget item from the UI
            event.target.closest('.budget-item').remove();
            
          } else {
            console.error('Failed to delete the budget item');
          }
        } else {
          console.error('No budget IDs found');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error occurred while deleting the budget item');
      }
    });
  });
});

  // Update charts after updating user info
  updateCharts();
  
  // Function to update charts
async function updateCharts() {
  // Update monthlyIncome and savingsGoal based on user input or saved data
  await getUserInfo();
  const userBudgetData = await getUserBudget();
  let monthlyIncome = parseFloat(document.getElementById("monthly-income-value").textContent);
  let savingsGoal = parseFloat(document.getElementById("savings-goal-value").textContent);
  let totalExpense = 0;

  // Calculate total expense based on fetched budget data
  if (userBudgetData && userBudgetData.length > 0) {
    totalExpense = userBudgetData.reduce((total, budget) => total + parseFloat(budget.cost), 0);
  }
  
  // Update or create the donut chart
  createOrUpdateDonutChart(monthlyIncome, totalExpense);

  // Update or create the bar chart
  createOrUpdateBarChart(savingsGoal, totalExpense);


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
      label: "Savings Goal", 
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
}

