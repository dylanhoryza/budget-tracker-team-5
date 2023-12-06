document.addEventListener('DOMContentLoaded', async function() {
  await getUserInfo();

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



