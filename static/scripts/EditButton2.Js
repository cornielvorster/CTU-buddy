// -----------------------------------------------------------Get the "Edit" button and table cells-----------------------
const editBtn = document.getElementById('edit-btn');
const tableCells = document.querySelectorAll('td');

// Function to enable/disable editing of table cells
function toggleEdit() {
  tableCells.forEach((cell, index) => {
    // Check if the cell is in a time column (index % 6 === 0)
    if (index % 6 === 0) {
      cell.contentEditable = !cell.isContentEditable;
    } else {
      cell.contentEditable = false; // Disable editing for other columns
    }
  });

  // Change the button color on click
  editBtn.style.backgroundColor = editBtn.style.backgroundColor === 'rgb(15, 209, 247)' ? 'rgb(80, 202, 118)' : 'rgb(15, 209, 247)';
}

// Add event listener to the "Edit" button
editBtn.addEventListener('click', toggleEdit);


// --------------------------------------------------------Function to create and return a dropdown element--------------------------------------
function createDropdown() {
  const dropdown = document.createElement('select');
  dropdown.classList.add('custom-dropdown'); // Add a class to the dropdown element

  const options = ["...","ENA412", "RD412", "CWD412", "CF412", "BREAK","(Day Over)","GA","Tests/Exams","Events"];
  options.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    dropdown.appendChild(option);
  });

  return dropdown;
}

// Get the table cells where you want to add the dropdowns
const table = document.querySelectorAll('td');

// Add the dropdown to each table cell
table.forEach(cell => {
  if (cell.cellIndex > 0) { // Skip the first cell in each row (Time column)
    const dropdown = createDropdown();
    cell.appendChild(dropdown);
  }
});

//-----------------------------------------------------Function to display Time/Date/Day------------------------------------------------------
function updateDateTime() {
  const dayDisplay = document.getElementById('day-display');
  const dateDisplay = document.getElementById('date-display');
  const timeDisplay = document.getElementById('time-display');
  const now = new Date();

  const day = now.toLocaleDateString('en-US', { weekday: 'long' });

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  dayDisplay.textContent = day;
  dateDisplay.textContent = formattedDate;
  timeDisplay.textContent = time;
}

// Call the function initially and set an interval to update it every second
updateDateTime();
setInterval(updateDateTime, 1000);