const backendUrl = 'https://cloud-dhr2.onrender.com';

let allFiles = [];

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'other';
}

function getFileDate(filename) {
  // Assumes filename format: timestamp-originalname.ext
  const ts = filename.split('-')[0];
  const date = new Date(Number(ts));
  return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

async function fetchFiles() {
  const res = await fetch(`${backendUrl}/files`);
  allFiles = await res.json();
  renderFiles();
}

function renderFiles() {
  const type = document.getElementById('typeFilter').value;
  const date = document.getElementById('dateFilter').value;
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  let filtered = allFiles.filter(file => {
    let match = true;
    if (type) {
      match = getFileType(file) === type;
    }
    if (match && date) {
      match = getFileDate(file) === date;
    }
    return match;
  });

  if (filtered.length === 0) {
    fileList.innerHTML = '<li>No files found.</li>';
    return;
  }

  filtered.forEach(file => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `${backendUrl}/uploads/${file}`;
    link.textContent = file.split('-').slice(1).join('-'); // Show original name
    link.target = '_blank';

    const dateSpan = document.createElement('span');
    const dateStr = getFileDate(file);
    dateSpan.textContent = dateStr ? `Uploaded: ${dateStr}` : '';

    li.appendChild(link);
    li.appendChild(dateSpan);
    fileList.appendChild(li);
  });
}

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  await fetch(`${backendUrl}/upload`, {
    method: 'POST',
    body: formData
  });
  fileInput.value = '';
  fetchFiles();
});

document.getElementById('typeFilter').addEventListener('change', renderFiles);
document.getElementById('dateFilter').addEventListener('change', renderFiles);
document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('typeFilter').value = '';
  document.getElementById('dateFilter').value = '';
  renderFiles();
});

// Fetch files on page load
fetchFiles();