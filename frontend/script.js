const API_BASE = "https://foodshare-app-5l58.onrender.com/api/orphanages";

// Fallback orphanages for demo/offline (your data)
const fallbackOrphanages = [
  {
    _id: "demo1",
    name: "Sunrise Children Home",
    city: "Tirupati",
    phone: "9123456780",
    address: "Leela Mahal Circle, Tirupati"
  },
  {
    _id: "demo2",
    name: "Sai Ananda Orphanage",
    city: "Tirupati",
    phone: "9345678901",
    address: "KT Road, Tirupati"
  },
  {
    _id: "demo3",
    name: "Little Hearts Shelter",
    city: "Puttur",
    phone: "9012345678",
    address: "Railway Station Road, Puttur"
  },
  {
    _id: "demo4",
    name: "Grace Children Care",
    city: "Puttur",
    phone: "9876543210",
    address: "Bazaar Street, Puttur"
  },
  {
    _id: "demo5",
    name: "Hope Nest Home",
    city: "Vijayawada",
    phone: "9988776655",
    address: "Benz Circle, Vijayawada"
  },
  {
    _id: "demo6",
    name: "Bright Future Home",
    city: "Guntur",
    phone: "9445566778",
    address: "Arundelpet, Guntur"
  },
  {
    _id: "demo7",
    name: "Mother Care Shelter",
    city: "Guntur",
    phone: "9001122334",
    address: "Brodipet, Guntur"
  },
  {
    _id: "demo8",
    name: "Helping Angels Home",
    city: "Nellore",
    phone: "9334455667",
    address: "Magunta Layout, Nellore"
  },
  {
    _id: "demo9",
    name: "Mercy Children Trust",
    city: "Nellore",
    phone: "9112233445",
    address: "Stonehousepet, Nellore"
  },
  {
    _id: "demo10",
    name: "New Life Kids Home",
    city: "Kurnool",
    phone: "9223344556",
    address: "Nandyal Road, Kurnool"
  }
];
// Deploy: const API_BASE = "https://your-render-backend.onrender.com/api/orphanages";

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
const fab = document.getElementById("fab");

const orphanageName = document.getElementById("orphanageName");
const orphanageCity = document.getElementById("orphanageCity");
const orphanagePhone = document.getElementById("orphanagePhone");
const orphanageAddress = document.getElementById("orphanageAddress");
const orphanageMessage = document.getElementById("orphanageMessage");
const submitBtn = document.getElementById("submitBtn");

const donorName = document.getElementById("donorName");
const donorEmail = document.getElementById("donorEmail");
const donorPhone = document.getElementById("donorPhone");
const donorAddress = document.getElementById("donorAddress");
const donorMessage = document.getElementById("donorMessage");
const donorSubmitBtn = document.getElementById("donorSubmitBtn");

let allOrphanages = [];
let token = localStorage.getItem('adminToken') || null;
let pendingOrphanages = [];

// Hide skeletons on load
hideSkeletons();

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

function showSkeleton() {
  resultsDiv.innerHTML = `
    <div class="card" style="display:flex;align-items:center;justify-content:center;padding:40px;color:rgba(255,255,255,0.7);">
      <div style="width:30px;height:30px;border:3px solid rgba(255,255,255,0.3);border-top:3px solid white;border-radius:50%;animation:spin 1s linear infinite;"></div>
      <span style="margin-left:15px;">Loading...</span>
    </div>
  `;
}

function hideSkeletons() {
  const skeletons = document.querySelectorAll('.skeleton');
  skeletons.forEach(s => s.style.display = 'none');
}

function validateOrphanageForm() {
  let valid = true;
  [orphanageName, orphanageCity, orphanagePhone, orphanageAddress].forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
    } else {
      input.classList.remove('error');
    }
  });
  if (orphanagePhone.value && !/^[0-9]{10}$/.test(orphanagePhone.value)) {
    orphanagePhone.classList.add('error');
    valid = false;
  }
  return valid;
}

function validateDonorForm() {
  let valid = true;
  [donorName, donorEmail, donorPhone, donorAddress].forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
    } else {
      input.classList.remove('error');
    }
  });
  if (donorPhone.value && !/^[0-9]{10}$/.test(donorPhone.value)) {
    donorPhone.classList.add('error');
    valid = false;
  }
  return valid;
}

function renderOrphanages(data) {
  hideSkeletons();
  resultsDiv.innerHTML = "";

  if (!data.length) {
    resultsDiv.innerHTML = '<div style="text-align:center;padding:60px;color:rgba(255,255,255,0.8);"><p style="font-size:18px;">🥺 No orphanages found nearby<br><small>Try different city or register new one</small></p></div>';
    return;
  }

  data.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-content">
        <h3>${o.name} 🏛️</h3>
        <p><strong>📍 City:</strong> ${o.city}</p>
        <p><strong>📏 Address:</strong> ${o.address}</p>
        <p><strong>📞 Phone:</strong> ${o.phone}</p>
        <div class="card-buttons">
          <a href="tel:${o.phone}" aria-label="Call ${o.name}">
            <button class="call">📞 Call</button>
          </a>
          <button onclick="shareOrphanage('${o._id}', '${o.name}', '${o.phone}')" aria-label="Share ${o.name}">↗️ Share</button>
        </div>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

async function shareOrphanage(id, name, phone) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Donate to ${name}`,
        text: `Orphanage: ${name}\nPhone: ${phone}\nFoodShare App`,
        url: window.location.href
      });
    } catch (err) {
      copyToClipboard(`FoodShare - ${name} (${phone})`);
    }
  } else {
    copyToClipboard(`FoodShare Orphanage: ${name}\nPhone: ${phone}`);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! 📋'));
}

function renderPending(data) {
  const container = pendingList;
  container.innerHTML = "";
  const badge = data.length > 0 ? `<span style="background:linear-gradient(135deg,#FF6B35,#F7931E);color:white;padding:8px 16px;border-radius:25px;font-size:14px;font-weight:600;">${data.length} Pending</span>` : '<span style="color:rgba(255,255,255,0.7);">No pending approvals</span>';
  container.innerHTML = `<h3>Pending Orphanages ${badge}</h3>`;

  if (!data.length) return;

  data.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${o.name} (${o.city}) 🏠</h4>
      <p><strong>📞</strong> ${o.phone}</p>
      <p><strong>📍</strong> ${o.address}</p>
      <p><strong>💬</strong> ${o.message || 'No additional message'}</p>
      <div style="margin-top:20px;">
        <button onclick="approveOrphanage('${o._id}')" style="background:linear-gradient(135deg,#4ECDC4,#44A08D);margin-right:10px;">✅ Approve</button>
        <button onclick="rejectOrphanage('${o._id}')" style="background:linear-gradient(135deg,#6C757D,#495057);">❌ Reject</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateCitySuggestions(data) {
  const uniqueCities = [...new Set(data.map((o) => o.city).filter(Boolean))].sort();
  citySuggestions.innerHTML = "";
  uniqueCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    citySuggestions.appendChild(option);
  });
}

async function loadOrphanages() {
  showSkeleton();
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (data.length === 0) {
      statusMessage.textContent = 'No orphanages in DB yet. Using demo data. Register new ones!';
      statusMessage.className = 'status-message warning';
      allOrphanages = fallbackOrphanages;
    } else {
      allOrphanages = data;
      statusMessage.textContent = `${data.length} orphanages ready to receive food donations! 🍚`;
      statusMessage.className = 'status-message success';
    }
    updateCitySuggestions(allOrphanages);
    renderOrphanages(allOrphanages);
  } catch (error) {
    console.log('API unavailable, using fallback data');
    allOrphanages = fallbackOrphanages;
    statusMessage.textContent = `${fallbackOrphanages.length} demo orphanages loaded (backend offline). Start server for real data!`;
    statusMessage.className = 'status-message warning';
    updateCitySuggestions(allOrphanages);
    renderOrphanages(allOrphanages);
  }
}

async function loadPending() {
  try {
    const res = await fetch(`${API_BASE}/pending`, { headers: getAuthHeaders() });
    const data = await res.json();
    pendingOrphanages = data;
    renderPending(data);
  } catch (error) {
    pendingList.innerHTML = "<p style='color:#FF6B35;'>Error loading pending (check token)</p>";
  }
}

window.approveOrphanage = async (id) => {
  if (!token) return showToast('Login required', 'error');
  try {
    const res = await fetch(`${API_BASE}/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadPending();
      loadOrphanages();
      showToast('✅ Approved! Orphanage now live');
    }
  } catch (error) {
    showToast('Approve failed', 'error');
  }
};

window.rejectOrphanage = async (id) => {
  if (!token) return showToast('Login required', 'error');
  try {
    const res = await fetch(`${API_BASE}/${id}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadPending();
      showToast('❌ Rejected');
    }
  } catch (error) {
    showToast('Reject failed', 'error');
  }
};

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `status-message ${type}`;
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;top:100px;right:20px;z-index:10001;max-width:350px;transform:translateX(400px);';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'transform 0.4s ease';
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

searchBtn.addEventListener("click", () => {
  const query = citySearch.value.trim().toLowerCase();
  if (!query) {
    statusMessage.textContent = 'Enter city, name or phone number';
    statusMessage.className = 'status-message error';
    return;
  }
  const filtered = allOrphanages.filter(o => 
    o.city?.toLowerCase().includes(query) || 
    o.name?.toLowerCase().includes(query) || 
    o.phone?.includes(query)
  );
  statusMessage.textContent = `Found ${filtered.length} results for "${citySearch.value}"`;
  statusMessage.className = 'status-message success';
  renderOrphanages(filtered);
  mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=78.0%2C13.0%2C80.5%2C15.0&layer=mapnik&marker=13.6%2C79.4&q=${encodeURIComponent(citySearch.value)}`;
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by browser', 'error');
    return;
  }
  statusMessage.textContent = 'Detecting location... 📍';
  statusMessage.className = 'status-message';
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const {latitude, longitude} = pos.coords;
mapFrame.src = `https://www.google.com/maps/embed/v1/view?center=${latitude},${longitude}&zoom=13&maptype=satellite`;
      statusMessage.textContent = `Your location set! Found ${allOrphanages.length} nearby`;
      statusMessage.className = 'status-message success';
      renderOrphanages(allOrphanages);
    },
    (err) => {
      showToast('Location access denied. Use manual search.', 'error');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) return showToast('Enter username & password', 'error');
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    const result = await res.json();
    if (!res.ok) return showToast(result.message || 'Login failed', 'error');
    token = result.token;
    localStorage.setItem('adminToken', token);
    adminPanel.style.display = 'block';
    usernameInput.value = passwordInput.value = '';
    loadPending();
    showToast('Admin login successful! 👨‍💼');
  } catch (e) {
    showToast('Login service unavailable', 'error');
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem('adminToken');
  token = null;
  adminPanel.style.display = 'none';
  showToast('Logged out successfully');
});

registerForm.addEventListener("input", validateOrphanageForm);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateOrphanageForm()) {
    formMessage.textContent = 'Please fill all required fields correctly';
    formMessage.className = 'form-message error';
    return;
  }
  
  const data = {
    name: orphanageName.value.trim(),
    city: orphanageCity.value.trim(),
    phone: orphanagePhone.value.trim(),
    address: orphanageAddress.value.trim(),
    message: orphanageMessage.value.trim()
  };
  
  submitBtn.classList.add('loading');
  formMessage.textContent = 'Submitting for admin approval...';
  formMessage.className = 'form-message';
  
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      formMessage.textContent = result.message || 'Submission failed';
      formMessage.className = 'form-message error';
    } else {
      formMessage.textContent = '✅ Submitted! Admin will approve soon';
      formMessage.className = 'form-message success';
      registerForm.reset();
      if (token) loadOrphanagePending();
      loadOrphanages();
      showToast('Registration sent for approval! 🎉');
    }
  } catch (e) {
    formMessage.textContent = 'Server not available. Try later.';
    formMessage.className = 'form-message error';
  } finally {
    submitBtn.classList.remove('loading');
  }
});

donorForm.addEventListener("input", validateDonorForm);

donorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateDonorForm()) {
    donorFormMessage.textContent = 'Please fill all required fields correctly';
    donorFormMessage.className = 'form-message error';
    return;
  }
  
  const data = {
    name: donorName.value.trim(),
    email: donorEmail.value.trim(),
    phone: donorPhone.value.trim(),
    address: donorAddress.value.trim(),
    message: donorMessage.value.trim()
  };
  
  donorSubmitBtn.classList.add('loading');
  donorFormMessage.textContent = 'Submitting for admin approval...';
  donorFormMessage.className = 'form-message';
  
  try {
    const res = await fetch(`${API_BASE.replace('/api/orphanages', '/api/users')}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      donorFormMessage.textContent = result.message || 'Submission failed';
      donorFormMessage.className = 'form-message error';
    } else {
      donorFormMessage.textContent = '✅ Submitted! Admin will approve soon';
      donorFormMessage.className = 'form-message success';
      donorForm.reset();
      if (token) loadUserPending();
      showToast('Donor registration sent for approval! 👤');
    }
  } catch (e) {
    donorFormMessage.textContent = 'Server not available. Try later.';
    donorFormMessage.className = 'form-message error';
  } finally {
    donorSubmitBtn.classList.remove('loading');
  }
});

fab.addEventListener('click', () => {
  document.querySelector('.register-section').scrollIntoView({ behavior: 'smooth' });
  showToast('Scroll to register form 📝');
});

function hideAdminPanel() {
  adminPanel.style.display = 'none';
}

function showTab(tabName) {
  // Tab buttons
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Content tabs
  document.getElementById('orphanageTab').style.display = tabName === 'orphanages' ? 'block' : 'none';
  document.getElementById('userTab').style.display = tabName === 'users' ? 'block' : 'none';
  
  document.getElementById('adminTitle').textContent = tabName === 'orphanages' ? 'Pending Orphanages 🔔' : 'Pending Users 👥';
  
  if (tabName === 'orphanages') {
    loadOrphanagePending();
  } else {
    loadUserPending();
  }
}

async function loadOrphanagePending() {
  try {
    const res = await fetch(`${API_BASE}/pending`, { headers: getAuthHeaders() });
    const data = await res.json();
    renderOrphanagePending(data);
  } catch (error) {
    document.getElementById('orphanagePendingList').innerHTML = "<p style='color:#FF6B35;'>Error loading orphanages (check token)</p>";
  }
}

async function loadUserPending() {
  try {
const res = await fetch(`${API_BASE.replace('/api/orphanages', '/api/admin/users/pending')}`, { headers: getAuthHeaders() });
    const data = await res.json();
    renderUserPending(data);
  } catch (error) {
    document.getElementById('userPendingList').innerHTML = "<p style='color:#FF6B35;'>Error loading users (check token)</p>";
  }
}

function renderOrphanagePending(data) {
  const container = document.getElementById('orphanagePendingList');
  container.innerHTML = "";
  const badge = data.length > 0 ? `<span style="background:linear-gradient(135deg,#FF6B35,#F7931E);color:white;padding:8px 16px;border-radius:25px;font-size:14px;font-weight:600;">${data.length} Pending</span>` : '<span style="color:rgba(255,255,255,0.7);">No pending</span>';
  container.innerHTML = `<h4>Orphanages ${badge}</h4>`;

  data.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${o.name} (${o.city}) 🏠</h4>
      <p><strong>📞</strong> ${o.phone}</p>
      <p><strong>📍</strong> ${o.address}</p>
      <p><strong>💬</strong> ${o.message || 'No message'}</p>
      <div style="margin-top:20px;">
        <button onclick="approveOrphanage('${o._id}')" style="background:linear-gradient(135deg,#4ECDC4,#44A08D);margin-right:10px;">✅ Approve</button>
        <button onclick="rejectOrphanage('${o._id}')" style="background:linear-gradient(135deg,#6C757D,#495057);">❌ Reject</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderUserPending(data) {
  const container = document.getElementById('userPendingList');
  container.innerHTML = "";
  const badge = data.length > 0 ? `<span style="background:linear-gradient(135deg,#FF6B35,#F7931E);color:white;padding:8px 16px;border-radius:25px;font-size:14px;font-weight:600;">${data.length} Pending</span>` : '<span style="color:rgba(255,255,255,0.7);">No pending</span>';
  container.innerHTML = `<h4>Users ${badge}</h4>`;

  data.forEach((u) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${u.name} 👤</h4>
      <p><strong>📧</strong> ${u.email}</p>
      <p><strong>📞</strong> ${u.phone}</p>
      <p><strong>📍</strong> ${u.address}</p>
      <p><strong>💬</strong> ${u.message || 'No message'}</p>
      <div style="margin-top:20px;">
        <button onclick="approveUser('${u._id}')" style="background:linear-gradient(135deg,#4ECDC4,#44A08D);margin-right:10px;">✅ Approve</button>
        <button onclick="rejectUser('${u._id}')" style="background:linear-gradient(135deg,#6C757D,#495057);">❌ Reject</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.approveUser = async (id) => {
  if (!token) return showToast('Login required', 'error');
  try {
const res = await fetch(`${API_BASE.replace('/api/orphanages', '/api/admin/users/${id}/approve')}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadUserPending();
      showToast('✅ User approved');
    }
  } catch (error) {
    showToast('Approve failed', 'error');
  }
};

window.rejectUser = async (id) => {
  if (!token) return showToast('Login required', 'error');
  try {
const res = await fetch(`${API_BASE.replace('/api/orphanages', '/api/admin/users/${id}/reject')}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      loadUserPending();
      showToast('❌ User rejected');
    }
  } catch (error) {
    showToast('Reject failed', 'error');
  }
};

// Init
loadOrphanages();
setInterval(() => token && loadOrphanagePending(), 30000);

// PWA-ish offline handling
window.addEventListener('online', loadOrphanages);
window.addEventListener('offline', () => showToast('Offline - cached data used', 'error'));

