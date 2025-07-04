// const backendUrl = 'https://cloud-dhr2.onrender.com';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeU7MrJPQzF8nmDERSl2vEFt4i-tfkzgE",
  authDomain: "student-id-27a57.firebaseapp.com",
  databaseURL: "https://student-id-27a57.firebaseio.com",
  projectId: "student-id-27a57",
  storageBucket: "student-id-27a57.appspot.com",
  messagingSenderId: "433391875124",
  appId: "1:433391875124:web:3a6819c4bc85d677efc661"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

let allFiles = [];

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'other';
}

function getFileDate(filename) {
  const ts = filename.split('-')[0];
  const date = new Date(Number(ts));
  return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

// Upload file to Firebase Storage
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return;
  const filename = Date.now() + '-' + file.name;
  const storageRef = firebase.storage().ref('uploads/' + filename);
  await storageRef.put(file);
  fileInput.value = '';
  fetchFiles();
});

// List files from Firebase Storage
function fetchFiles() {
  const listRef = storage.ref('uploads/');
  listRef.listAll().then(async res => {
    allFiles = await Promise.all(res.items.map(async itemRef => {
      const url = await itemRef.getDownloadURL();
      return {
        name: itemRef.name,
        url: url
      };
    }));
    renderFiles();
  }).catch(err => {
    alert('Failed to list files: ' + err.message);
    console.error(err);
  });
}

// Store selected files for deletion
let selectedFiles = new Set();

function renderFiles() {
  const type = document.getElementById('typeFilter').value;
  const date = document.getElementById('dateFilter').value;
  const fileGrid = document.getElementById('fileGrid');
  fileGrid.innerHTML = '';

  let filtered = allFiles.filter(file => {
    let match = true;
    if (type) match = getFileType(file.name) === type;
    if (match && date) match = getFileDate(file.name) === date;
    return match;
  });

  if (filtered.length === 0) {
    fileGrid.innerHTML = '<div class="text-center text-muted">No files found.</div>';
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    return;
  }

  filtered.forEach(file => {
    const card = document.createElement('div');
    card.className = 'drive-file-card' + (selectedFiles.has(file.name) ? ' selected' : '');

    // Checkbox for multi-delete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'file-checkbox';
    checkbox.checked = selectedFiles.has(file.name);
    checkbox.onclick = function(e) {
      e.stopPropagation();
      if (checkbox.checked) selectedFiles.add(file.name);
      else selectedFiles.delete(file.name);
      card.classList.toggle('selected', checkbox.checked);
      document.getElementById('deleteSelectedBtn').style.display = selectedFiles.size > 0 ? '' : 'none';
    };

    // Delete button (top right)
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '&times;';
    delBtn.title = 'Delete file';
    delBtn.onclick = async function(e) {
      e.stopPropagation();
      if (confirm('Delete this file?')) {
        await firebase.storage().ref('uploads/' + file.name).delete();
        fetchFiles();
      }
    };

    // File name
    const nameDiv = document.createElement('div');
    nameDiv.className = 'file-name';
    nameDiv.textContent = file.name.split('-').slice(1).join('-');

    // Date
    const dateDiv = document.createElement('div');
    const dateStr = getFileDate(file.name);
    dateDiv.className = 'file-date';
    dateDiv.textContent = dateStr ? `Uploaded: ${dateStr}` : '';

    // File type badge (bottom right)
    const typeBadge = document.createElement('span');
    typeBadge.className = 'file-type-badge';
    typeBadge.textContent = getFileType(file.name).toUpperCase();

    // Single click: select/deselect
    card.onclick = function(e) {
      if (selectedFiles.has(file.name)) {
        selectedFiles.delete(file.name);
        checkbox.checked = false;
        card.classList.remove('selected');
      } else {
        selectedFiles.add(file.name);
        checkbox.checked = true;
        card.classList.add('selected');
      }
      document.getElementById('deleteSelectedBtn').style.display = selectedFiles.size > 0 ? '' : 'none';
    };

    // Double click: open file
    card.ondblclick = function(e) {
      window.open(file.url, '_blank');
    };

    card.appendChild(checkbox);
    card.appendChild(delBtn);
    card.appendChild(nameDiv);
    card.appendChild(dateDiv);
    card.appendChild(typeBadge);
    fileGrid.appendChild(card);
  });

  document.getElementById('deleteSelectedBtn').style.display = selectedFiles.size > 0 ? '' : 'none';
}

// Multi-delete handler
document.getElementById('deleteSelectedBtn').onclick = async function() {
  if (selectedFiles.size === 0) return;
  if (!confirm('Delete selected files?')) return;
  for (const name of selectedFiles) {
    await firebase.storage().ref('uploads/' + name).delete();
  }
  selectedFiles.clear();
  fetchFiles();
};

document.getElementById('typeFilter').addEventListener('change', renderFiles);
document.getElementById('dateFilter').addEventListener('change', renderFiles);
document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('typeFilter').value = '';
  document.getElementById('dateFilter').value = '';
  renderFiles();
});

// Auth logic
const auth = firebase.auth();

document.getElementById('loginBtn').onclick = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      document.getElementById('loginError').textContent = err.message;
    });
};

document.getElementById('logoutBtn').onclick = function() {
  auth.signOut();
  // Clear login fields on logout
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('loginError').textContent = '';
};

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = '';
    document.getElementById('userInfo').textContent = `Logged in as: ${user.email}`;
    fetchFiles(); // Only fetch files after login
  } else {
    document.getElementById('loginPage').style.display = '';
    document.getElementById('mainApp').style.display = 'none';
  }
});

// --- Upload progress animation ---
const uploadProgressContainer = document.createElement('div');
uploadProgressContainer.className = 'upload-progress-container';
uploadProgressContainer.innerHTML = `
  <div class="upload-progress-bar" id="uploadProgressBar"></div>
  <div class="upload-progress-text" id="uploadProgressText"></div>
`;
document.getElementById('uploadForm').insertAdjacentElement('afterend', uploadProgressContainer);

document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return;
  const filename = Date.now() + '-' + file.name;
  const storageRef = firebase.storage().ref('uploads/' + filename);

  // Show progress bar
  uploadProgressContainer.style.display = 'block';
  const progressBar = document.getElementById('uploadProgressBar');
  const progressText = document.getElementById('uploadProgressText');
  progressBar.style.width = '0%';
  progressText.textContent = 'Uploading... 0%';

  const uploadTask = storageRef.put(file);
  uploadTask.on('state_changed',
    function progress(snapshot) {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = `Uploading... ${percent}%`;
    },
    function error(err) {
      progressText.textContent = 'Upload failed: ' + err.message;
      setTimeout(() => uploadProgressContainer.style.display = 'none', 3000);
    },
    function complete() {
      progressBar.style.width = '100%';
      progressText.textContent = 'Upload complete!';
      setTimeout(() => uploadProgressContainer.style.display = 'none', 1000);
      fileInput.value = '';
      fetchFiles();
    }
  );
});