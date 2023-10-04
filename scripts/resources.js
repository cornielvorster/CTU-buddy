// Function to upload and save file details
function uploadFile() {
    const fileInput = document.getElementById('file');
    const fileList = fileInput.files;

    if (fileList.length > 0) {
        const file = fileList[0];

        // Save the file to the "upload-download" folder
        const folderPath = 'upload-download/';
        const filePath = folderPath + file.name;

        // Check if the file already exists
        if (localStorage.getItem(filePath)) {
            alert('File with the same name already exists. Please rename the file.');
        } else {
            // Save the file in local storage
            localStorage.setItem(filePath, JSON.stringify({
                name: file.name,
                size: file.size,
                date: new Date().toLocaleString(),
            }));

            // Display the file details in the table
            const resourceList = document.querySelector('.resource-list');
            const fileTable = resourceList.querySelector('.file-table');
            const tbody = fileTable.querySelector('tbody');

            // Create a new row for the uploaded file
            const fileRow = document.createElement('tr');
            fileRow.innerHTML = `<td><a href="#" class="download-link" data-filepath="${filePath}">${file.name}</a></td><td>${file.size} bytes</td><td>${new Date().toLocaleString()}</td>`;
            tbody.appendChild(fileRow);

            // Add click event listener to the download link
            const downloadLink = fileRow.querySelector('.download-link');
            downloadLink.addEventListener('click', downloadFile);

            // Clear the file input field to allow uploading another file
            fileInput.value = '';
        }
    }
}

// Function to handle file download
function downloadFile(event) {
    event.preventDefault();
    const filePath = event.target.getAttribute('data-filepath');
    const fileInfo = JSON.parse(localStorage.getItem(filePath));

    if (fileInfo) {
        // Create a Blob object from the file data
        const fileData = localStorage.getItem(filePath);
        const blob = new Blob([fileData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        // Create a temporary link and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileInfo.name; // Set the file name
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('File not found. Please refresh the page.');
    }
}

// Function to load and display saved file details from local storage
function loadSavedFiles() {
    const resourceList = document.querySelector('.resource-list');
    const fileTable = resourceList.querySelector('.file-table');
    const tbody = fileTable.querySelector('tbody');

    // Retrieve and display saved file details
    for (let i = 0; i < localStorage.length; i++) {
        const filePath = localStorage.key(i);
        const fileInfo = JSON.parse(localStorage.getItem(filePath));

        // Create a new row for the uploaded file
        const fileRow = document.createElement('tr');
        fileRow.innerHTML = `<td><a href="#" class="download-link" data-filepath="${filePath}">${fileInfo.name}</a></td><td>${fileInfo.size} bytes</td><td>${fileInfo.date}</td>`;
        tbody.appendChild(fileRow);

        // Add click event listener to the download link
        const downloadLink = fileRow.querySelector('.download-link');
        downloadLink.addEventListener('click', downloadFile);
    }
}

// Call loadSavedFiles() to load and display saved file details when the page loads
loadSavedFiles();