const API_BASE = "http://localhost:5000/api/orphanages";
// UPDATE AFTER DEPLOY:
// const API_BASE = "https://your-render-backend.onrender.com/api/orphanages";

const resultsDiv = document.getElementById("results");
const pendingList = document.getElementById("pendingList");
const citySearch = document.getElementById("citySearch");
const citySuggestions = document.getElementById("citySuggestions");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const statusMessage = document.getElementById("statusMessage");
const formMessage = document.getElementById("formMessage");
const registerForm = document.getElementById("registerForm");
const mapFrame = document.getElementById("mapFrame");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const orphanageName = document.getElementById("orphanageName");
const orphanageCity = document.getElementById("orphanageCity");
const orphanagePhone = document.getElementById("orphanagePhone");
const orphanageAddress = document.getElementById("orphanageAddress");
const orphanageMessage = document.getElementById("orphanageMessage");

let allOrphanages = [];
let token = localStorage.getItem('adminToken') || null;
let pendingOrphanages = [];

if (token) {
  adminPanel.style.display = 'block';
  loadPending();
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function renderOrphanages(data) {
  resultsDiv.innerHTML = "";

  if (!data.length) {
    resultsDiv.innerHTML = "<p>No orphanages found for this city.</p>";
    return;
  }

  data.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${o.name}</h3>
      <p><strong>City:</strong> ${o.city}</p>
      <p><strong>Address:</strong> ${o.address}</p>
      <p><strong>Phone:</strong> ${o.phone}</p>
      <a href="tel:${o.phone}">
        <button>Call Now</button>
      </a>
    `;
    resultsDiv.appendChild(card);
  });
}

function renderPending(data) {
  pendingList.innerHTML = "";
  const badge = data.length > 0 ? `<span style="background: #ff4444; color: white; padding: 4px 8px; border-radius: 20px; font-size: 12px;">${data.length} new</span>` : '';
  pendingList.innerHTML = badge ? `<h3>Pending ${badge}</h3>` : '<h3>No pending</h3>';

  if (!data.length) return;

  data.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.marginBottom = "15px";
    card.innerHTML = `
      <h4>${o.name} (${o.city})</h4>
      <p><strong>Address:</strong> ${o.address}</p>
      <p><strong>Phone:</strong> ${o.phone}</p>
      <p><strong>Message:</strong> ${o.message || 'No message'}</p>
      <div style="margin-top: 10px;">
        <button onclick="approveOrphanage('${o._id}')" style="background: #28a745; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Approve</button>
        <button onclick="rejectOrphanage('${o._id}')" style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Reject</button>
      </div>
    `;
    pendingList.appendChild(card);
  });
}

function updateCitySuggestions(data) {
  const uniqueCities = [...new Set(data.map((o) => o.city).filter(Boolean))];
  citySuggestions.innerHTML = "";
  uniqueCities.sort().forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    citySuggestions.appendChild(option);
  });
}

async function loadOrphanages() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    allOrphanages = data;
    updateCitySuggestions(data);
    renderOrphanages(data);
  } catch (error) {
    statusMessage.textContent = "Could not load orphanages. Check backend connection.";
  }
}

async function loadPending() {
  try {
    const res = await fetch(`${API_BASE}/pending`, { headers: getAuthHeaders() });
    const data = await res.json();
    pendingOrphanages = data;
    renderPending(data);
  } catch (error) {
    console.error('Load pending error:', error);
    pendingList.innerHTML = "<p>Error loading pending list.</p>";
  }
}

window.approveOrphanage = async (id) => {
  if (!token) return alert('Login required');
  try {
    const res = await fetch(`${API_BASE}/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadPending();
      loadOrphanages();
      showToast('Approved!');
    } else {
      alert('Approve failed');
    }
  } catch (error) {
    console.error('Approve error:', error);
  }
};

window.rejectOrphanage = async (id) => {
  if (!token) return alert('Login required');
  try {
    const res = await fetch(`${API_BASE}/${id}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadPending();
      loadOrphanages();
      showToast('Rejected!');
    } else {
      alert('Reject failed');
    }
  } catch (error) {
    console.error('Reject error:', error);
  }
};

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed; top:20px; right:20px; background:#28a745; color:white; padding:15px 20px; border-radius:8px; z-index:10000; animation:slideIn 0.3s;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

searchBtn.addEventListener("click", () => {
  const query = citySearch.value.trim().toLowerCase();
  if (!query) return statusMessage.textContent = "Enter city/name/phone.";
  const filtered = allOrphanages.filter(o => 
    o.city.toLowerCase().includes(query) || 
    o.name.toLowerCase().includes(query) || 
    o.phone.includes(query)
  );
  statusMessage.textContent = `Results for "${citySearch.value.trim()}"`;
  renderOrphanages(filtered);
  mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return statusMessage.textContent = "Geolocation not supported.";
  statusMessage.textContent = "Fetching location...";
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
    statusMessage.textContent = `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    renderOrphanages(allOrphanages);
  }, () => statusMessage.textContent = "Location access denied.");
});

loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) return alert("Enter credentials.");
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    const result = await res.json();
    if (!res.ok) return alert(result.message);
    token = result.token;
    localStorage.setItem('adminToken', token);
    adminPanel.style.display = 'block';
    loadPending();
    usernameInput.value = passwordInput.value = '';
    showToast('Admin login OK!');
  } catch (e) {
    alert('Login error');
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem('adminToken');
  token = null;
  adminPanel.style.display = 'none';
  showToast('Logged out');
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: orphanageName.value.trim(),
    city: orphanageCity.value.trim(),
    phone: orphanagePhone.value.trim(),
    address: orphanageAddress.value.trim(),
    message: orphanageMessage.value.trim()
  };
  if (!data.name || !data.city || !data.phone || !data.address) return formMessage.textContent = "Fill required fields.";
  if (!/^[0-9]{10}$/.test(data.phone)) return formMessage.textContent = "Phone 10 digits.";
  formMessage.textContent = 'Submitting...';
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) return formMessage.textContent = result.message;
    formMessage.textContent = result.message;
    registerForm.reset();
    if (token) loadPending();
    loadOrphanages();
    showToast('Submitted for approval!');
  } catch (e) {
    formMessage.textContent = 'Server error.';
  }
});

loadOrphanages();
setInterval(() => token && loadPending(), 30000); // Auto refresh pending every 30s
