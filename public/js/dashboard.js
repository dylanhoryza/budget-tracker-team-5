const addExpenseBtn = document.getElementById("#add-expense-btn");
const expenseContainer = document.getElementById("#expense-container");

// dashboard.js

$(document).ready(function() {
  $('#add-expense-btn').click(function() {
    const originalRow = $('#expense-row');
    const newExpenseRow = originalRow.clone();
    
    
    // newExpenseRow.find('select').val('');
    
    
    $('#expense-container').append(newExpenseRow);
  });
});


