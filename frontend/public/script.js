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
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  let filtered = allFiles.filter(file => {
    let match = true;
    if (type) match = getFileType(file.name) === type;
    if (match && date) match = getFileDate(file.name) === date;
    return match;
  });

  if (filtered.length === 0) {
    fileList.innerHTML = '<li class="list-group-item text-center">No files found.</li>';
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    return;
  }

  filtered.forEach(file => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center justify-content-between flex-wrap';
    li.style.cursor = 'pointer';

    // Checkbox for multi-delete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mr-3';
    checkbox.checked = selectedFiles.has(file.name);
    checkbox.onclick = function(e) {
      // Prevent li click event
      e.stopPropagation();
      if (checkbox.checked) selectedFiles.add(file.name);
      else selectedFiles.delete(file.name);
      document.getElementById('deleteSelectedBtn').style.display = selectedFiles.size > 0 ? '' : 'none';
      li.classList.toggle('active', checkbox.checked);
    };

    // File link (for display only)
    const link = document.createElement('span');
    link.textContent = file.name.split('-').slice(1).join('-');
    link.className = 'mr-2 text-primary';

    // Date/type badges
    const dateSpan = document.createElement('span');
    const dateStr = getFileDate(file.name);
    dateSpan.textContent = dateStr ? `Uploaded: ${dateStr}` : '';
    dateSpan.className = 'text-muted small mr-2';

    const typeBadge = document.createElement('span');
    typeBadge.className = 'badge badge-info mr-2';
    typeBadge.textContent = getFileType(file.name).toUpperCase();

    // Single delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-outline-danger ml-2';
    delBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
    delBtn.title = 'Delete file';
    delBtn.onclick = async function(e) {
      e.stopPropagation();
      if (confirm('Delete this file?')) {
        await firebase.storage().ref('uploads/' + file.name).delete();
        fetchFiles();
      }
    };

    // Single click: select/deselect
    li.onclick = function(e) {
      if (selectedFiles.has(file.name)) {
        selectedFiles.delete(file.name);
        checkbox.checked = false;
        li.classList.remove('active');
      } else {
        selectedFiles.add(file.name);
        checkbox.checked = true;
        li.classList.add('active');
      }
      document.getElementById('deleteSelectedBtn').style.display = selectedFiles.size > 0 ? '' : 'none';
    };

    // Double click: open file
    li.ondblclick = function(e) {
      window.open(file.url, '_blank');
    };

    // Highlight if selected
    if (selectedFiles.has(file.name)) li.classList.add('active');

    li.appendChild(checkbox);
    li.appendChild(link);
    li.appendChild(typeBadge);
    li.appendChild(dateSpan);
    li.appendChild(delBtn);
    fileList.appendChild(li);
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