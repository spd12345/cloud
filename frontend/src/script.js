const backendUrl = 'https://cloud-dhr2.onrender.com';

async function fetchFiles() {
  const res = await fetch(`${backendUrl}/files`);
  const files = await res.json();
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  files.forEach(file => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `${backendUrl}/uploads/${file}`;
    link.textContent = file;
    link.target = '_blank';
    li.appendChild(link);
    fileList.appendChild(li);
  });
}

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      alert('File uploaded successfully!');
      fileInput.value = '';
      fetchFiles(); // Refresh file list
    } else {
      alert('Upload failed.');
    }
  } catch (err) {
    alert('Error uploading file.');
  }
});

// Fetch files on page load
fetchFiles();