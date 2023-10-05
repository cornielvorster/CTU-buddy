// Get the "Edit" button and table cells
const editBtn = document.getElementById('edit-btn');
const tableCells = document.querySelectorAll('td');

// Function to enable/disable editing of table cells
function toggleEdit() {
  tableCells.forEach(cell => {
    cell.contentEditable = !cell.isContentEditable;
  });
}

// Add event listener to the "Edit" button
editBtn.addEventListener('click', toggleEdit);