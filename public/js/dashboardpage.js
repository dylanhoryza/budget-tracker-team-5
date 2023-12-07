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
      return userData.user_id; // Assuming 'id' is the user info ID in the response
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
  
  // const userId = await getUserId(); // Get the user info ID
  
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
    // Handle errors here
  }
}

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
      return userData.id; // Assuming 'id' is the user info ID in the response
    } else {
      console.error('Failed to fetch user info ID');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Usage:
async function updateUserInfo() {
  const updatedMonthlyIncome = parseFloat(document.querySelector('#monthly-income').value);
  const updatedSavingsGoal = parseFloat(document.querySelector('#budget-goal').value);
  const userInfoId = await getUserInfoId(); // Get the user info ID
  
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
      

  

      
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here
  }
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
       // Add single expense item to the display
      console.log('Expense added successfully');
      await getUserBudget();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error occurred while saving expense");
  }
}



// post new User budget
// async function postUserBudget() {
//   const category_id = document.querySelector('.category-select').value;
//   const cost = parseFloat(document.querySelector('.cost-input').value);
  
//   // const userId = await getUserId(); // Get the user info ID
  
//     try {
//       const response = await fetch(`/api/budget/`, {
//         method: "POST",
//         body: JSON.stringify({ category_id, cost }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         // document.querySelector('.category-display').textContent = category_id;
//         // document.querySelector('.cost-display').textContent = cost;
//         console.log('all good')
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Error occurred while saving expense");
//       console.error('User ID is null');
//     }
//   }

// document.addEventListener('DOMContentLoaded', function() {
//   const addExpenseButton = document.getElementById('add-expense-btn');
//   const expenseDetailsContainer = document.getElementById('expense-details');

//   addExpenseButton.addEventListener('click', async function() {
//     const categorySelect = document.querySelector('.category-select2');
//     const costInput = parseFloat(document.querySelector('.cost-input').value);

//     const selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
//     const enteredCost = costInput;

//     if (selectedCategory && enteredCost) {
//       // Create a div element to display the category and cost
//       const expenseDetails = document.createElement('div');
//       expenseDetails.innerHTML = `<p>${selectedCategory}</p><p>$${enteredCost}</p>`;

//       // Append the expense details to the container
//       expenseDetailsContainer.appendChild(expenseDetails);

//       // Clear inputs after displaying expense details
//       // categorySelect.selectedIndex = 0;
//       // costInput = '';

//       // Send expense data to the backend
//       try {
//         const response = await fetch('/api/budget/', {
//           method: 'POST',
//           body: JSON.stringify({ category_id: selectedCategory, cost: enteredCost }),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const responseData = await response.json();
//           console.log(responseData);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         // Handle error
//       }
//     } else {
//       alert('Please select a category and enter cost.');
//     }
//   });
// });





