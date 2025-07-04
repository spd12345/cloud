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

// Render files with filters
function renderFiles() {
  const type = document.getElementById('typeFilter').value;
  const date = document.getElementById('dateFilter').value;
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  let filtered = allFiles.filter(file => {
    let match = true;
    if (type) {
      match = getFileType(file.name) === type;
    }
    if (match && date) {
      match = getFileDate(file.name) === date;
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
    link.href = file.url;
    link.textContent = file.name.split('-').slice(1).join('-');
    link.target = '_blank';

    const dateSpan = document.createElement('span');
    const dateStr = getFileDate(file.name);
    dateSpan.textContent = dateStr ? `Uploaded: ${dateStr}` : '';

    const typeBadge = document.createElement('span');
    typeBadge.className = 'file-type';
    typeBadge.textContent = getFileType(file.name).toUpperCase();

    li.appendChild(link);
    li.appendChild(dateSpan);
    li.appendChild(typeBadge);
    fileList.appendChild(li);
  });
}

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
    .catch(err => alert('Login failed: ' + err.message));
};

document.getElementById('logoutBtn').onclick = function() {
  auth.signOut();
};

auth.onAuthStateChanged(user => {
  const uploadForm = document.getElementById('uploadForm');
  const filters = document.querySelector('.filters');
  const userInfo = document.getElementById('userInfo');
  if (user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = '';
    document.getElementById('email').style.display = 'none';
    document.getElementById('password').style.display = 'none';
    userInfo.textContent = `Logged in as: ${user.email}`;
    uploadForm.style.display = '';
    filters.style.display = '';
    fetchFiles();
  } else {
    document.getElementById('loginBtn').style.display = '';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('email').style.display = '';
    document.getElementById('password').style.display = '';
    userInfo.textContent = '';
    uploadForm.style.display = 'none';
    filters.style.display = 'none';
    document.getElementById('fileList').innerHTML = '<li>Please log in to view files.</li>';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  fetchFiles();
});