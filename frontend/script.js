const API_BASE = "http://localhost:5000/api/orphanages";
// After backend deployment, change to:
// const API_BASE = "https://YOUR-RENDER-BACKEND.onrender.com/api/orphanages";

const resultsDiv = document.getElementById("results");
const citySearch = document.getElementById("citySearch");
const citySuggestions = document.getElementById("citySuggestions");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const statusMessage = document.getElementById("statusMessage");
const formMessage = document.getElementById("formMessage");
const registerForm = document.getElementById("registerForm");
const mapFrame = document.getElementById("mapFrame");
const loginBtn = document.getElementById("loginBtn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const orphanageName = document.getElementById("orphanageName");
const orphanageCity = document.getElementById("orphanageCity");
const orphanagePhone = document.getElementById("orphanagePhone");
const orphanageAddress = document.getElementById("orphanageAddress");

let allOrphanages = [];

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

searchBtn.addEventListener("click", () => {
  const city = citySearch.value.trim().toLowerCase();

  if (!city) {
    statusMessage.textContent = "Please enter a city name.";
    return;
  }

  const filtered = allOrphanages.filter((o) =>
    o.city.toLowerCase().includes(city)
  );

  statusMessage.textContent = `Showing results for "${citySearch.value.trim()}"`;
  renderOrphanages(filtered);

  mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(
    citySearch.value.trim()
  )}&z=12&output=embed`;
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    statusMessage.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  statusMessage.textContent = "Fetching your location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
      statusMessage.textContent = `Your location detected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      // Optional: show all for now. You can later add backend distance filtering.
      renderOrphanages(allOrphanages);
    },
    () => {
      statusMessage.textContent = "Unable to get your location.";
    }
  );
});

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  alert(`Welcome ${username}`);
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: orphanageName.value.trim(),
    city: orphanageCity.value.trim(),
    phone: orphanagePhone.value.trim(),
    address: orphanageAddress.value.trim(),
  };

  if (!data.name || !data.city || !data.phone || !data.address) {
    formMessage.textContent = "Please fill all orphanage details correctly.";
    return;
  }

  if (!/^[0-9]{10}$/.test(data.phone)) {
    formMessage.textContent = "Phone number must be exactly 10 digits.";
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      formMessage.textContent = result.message || "Failed to register orphanage.";
      return;
    }

    formMessage.textContent = "Orphanage registered successfully.";
    registerForm.reset();
    await loadOrphanages();
  } catch (error) {
    formMessage.textContent = "Server error while registering orphanage.";
  }
});

loadOrphanages();