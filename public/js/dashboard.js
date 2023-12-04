let totalExpense = 0;

$(document).ready(function () {
  // Event listener for adding expense rows
  $("#add-expense-btn").click(function () {
    const originalRow = $(".expense-row").first().clone(); // Clone the first expense row

    // Clear values in the cloned row if needed
    originalRow.find('select').prop('selectedIndex', 0);
    originalRow.find('input').val('');

    $("#expense-container").append(originalRow); // Append the cloned row
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
  });
});

$(document).ready(function () {
  

  // Event listener for deleting expenses
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



// dashboard.js

// $(document).ready(function () {
//   $("#add-expense-btn").click(function () {
//     const originalRow = $("#expense-row");
//     const newExpenseRow = originalRow.clone();

//     // newExpenseRow.find('select').val('');
//     newExpenseRow.find('input[type="text"]').val('');
//     newExpenseRow.find('select').val('');

//     $("#expense-container").append(newExpenseRow);
//   });
// });



// const newBudget = async (event) => {
//   event.preventDefault();

//   const category_id = document.querySelector("#category_id").value;
//   const cost = parseFloat(document.querySelector("#costInput").value);

//   if (category_id && cost) {
//     const response = await fetch(`/api/budget/`, {
//       method: "POST",
//       body: JSON.stringify({ category_id, cost }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.ok) {
//       totalExpense += cost;
//       document.querySelector(".total-header").textContent =
//         `Total: $${totalExpense.toFixed(2)}`;
//       alert("Expense saved!");
//     } else {
//       alert("Unable to save expense");
//     }
//   }
// };

// const newBudget = async (event) => {
//   event.preventDefault();

//   // Select all expense rows
//   const expenseRows = document.querySelectorAll(".expense-row");

//   for (const row of expenseRows) {
//     const category_id = row.querySelector(".category-select").value;
//     const cost = parseFloat(row.querySelector(".cost-input").value);

//     if (category_id && cost) {
//       const response = await fetch(`/api/budget/`, {
//         method: "POST",
//         body: JSON.stringify({ category_id, cost }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         totalExpense += cost;
//         document.querySelector(".total-header").textContent =
//           `Total: $${totalExpense.toFixed(2)}`;
//         alert("Expense saved!");
//       } else {
//         alert("Unable to save expense");
//       }
//     }
//   }
// };




// document.querySelector(".save-btn").addEventListener("click", newBudget);
