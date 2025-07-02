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

    const typeBadge = document.createElement('span');
    typeBadge.className = 'file-type';
    typeBadge.textContent = getFileType(file).toUpperCase();

    li.appendChild(link);
    li.appendChild(dateSpan);
    li.appendChild(typeBadge);
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

// --- AI Chat Assistant ---
function aiAnswer(question) {
  question = question.toLowerCase();
  // Simple search intent
  if (question.includes('search') || question.includes('find') || question.includes('show')) {
    // Try to extract file name or type
    let found = [];
    // Search by file type
    if (question.includes('image')) found = allFiles.filter(f => getFileType(f) === 'image');
    else if (question.includes('pdf')) found = allFiles.filter(f => getFileType(f) === 'pdf');
    else if (question.includes('doc')) found = allFiles.filter(f => getFileType(f) === 'doc');
    else if (question.includes('other')) found = allFiles.filter(f => getFileType(f) === 'other');
    // Search by file name
    else {
      // Try to extract a keyword after "search" or "find"
      const match = question.match(/(?:search|find|show)\s+(.*)/);
      if (match && match[1]) {
        const keyword = match[1].trim();
        found = allFiles.filter(f => f.toLowerCase().includes(keyword));
      }
    }
    if (found.length === 0) return "No matching files found.";
    // Return links to found files
    return found.map(f =>
      `<a href="${backendUrl}/uploads/${f}" target="_blank">${f.split('-').slice(1).join('-')}</a>`
    ).join('<br>');
  }
  // General info
  if (question.includes('how many')) {
    return `You have ${allFiles.length} files in your drive.`;
  }
  if (question.includes('types')) {
    const types = new Set(allFiles.map(getFileType));
    return `File types present: ${Array.from(types).join(', ')}`;
  }
  return "I can help you search files by name or type. Try: 'Search report', 'Show images', or 'How many files?'.";
}

// Chat UI logic
const chatLog = document.getElementById('chatLog');
document.getElementById('chatForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;
  // Show user message
  chatLog.innerHTML += `<div class="chat-message user">You: ${question}</div>`;
  // Get AI answer
  const answer = aiAnswer(question);
  chatLog.innerHTML += `<div class="chat-message ai">AI: ${answer}</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;
  input.value = '';
});

// Fetch files on page load
fetchFiles();