// JavaScript for form validation and JSON output
function checkPassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const messageElement = document.getElementById("message");

  if (password !== confirmPassword) {
    messageElement.textContent = "Passwords do not match";
    messageElement.style.color = "red";
    return false;
  } else {
    messageElement.textContent = "Passwords match";
    messageElement.style.color = "green";
    return true;
  }
}

function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  if (password.length < 6) {
    messageElement.textContent = "Password is too weak";
    messageElement.style.color = "red";
    return false;
  } else if (password.length < 10) {
    messageElement.textContent = "Password strength is medium";
    messageElement.style.color = "orange";
    return true;
  } else {
    messageElement.textContent = "Password is strong";
    messageElement.style.color = "green";
    return true;
  }
}

function password_view(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const eyeIcon = document.getElementById(eyeId);

  if (input.type === "password") {
    input.type = "text";
    eyeIcon.src = "./fotos/eye.png";
  } else {
    input.type = "password";
    eyeIcon.src = "./fotos/eye-slash.png";
  }
}

async function checkuser() {

  PhoneNumber = document.getElementById("telephone").value;
  Email = document.getElementById("email").value;

  const res = await fetch("http://localhost:3000/checkuser?PhoneNumber=" + PhoneNumber + "&Email=" + Email, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (res.status === 200) {
    return false;
  }
  else {
    return true;
  }

}

async function register() {
  const formData = {
    FirstName: document.getElementById("firstname").value,
    LastName: document.getElementById("lastname").value,
    PhoneNumber: document.getElementById("telephone").value,
    Email: document.getElementById("email").value,
    Password: document.getElementById("password").value,
  };

  const res = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  if (res.status !== 200) {
    return false;
  }
  return true;
}

async function validateForm() {
  const formData = {
    FirstName: document.getElementById("firstname").value,
    LastName: document.getElementById("lastname").value,
    PhoneNumber: document.getElementById("telephone").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  for (const field in formData) {
    if (!formData[field] && field !== "agree") {
      alert(`${field} is required`);
      return false;
    }
  }

  if (!checkPassword()) {
    return false;
  }

  if (!checkPasswordStrength()) {
    return false;
  }
  if ((await checkuser()) === false) {
    alert("User Already Exists");
    return false;
  }

  if ((await register()) === false) {
    alert("Failed to Register email or phone number exists");
    return false;
  }
  // Αν φτάσουμε εδώ, η φόρμα είναι έγκυρη
  alert("Welcome to our page.");
  window.location.href = "http://localhost:3000/Home.html";
  return true;
}

async function CheckLoggedIn() {
  const res = await fetch("http://localhost:3000/check", {
    method: "GET",
  });

  if (res.status === 200) {
    window.location.href = "http://localhost:3000/Home.html";
  } else if (res.status === 201) {
    window.location.href = "http://localhost:3000/Organizer.html";
  }
}

window.addEventListener("pageshow", function (event) {
  CheckLoggedIn();
});
