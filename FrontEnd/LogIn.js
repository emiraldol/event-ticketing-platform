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

/*Login In for user */
async function getUserLogIn() {
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  console.log(formData);
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (res.status != 200) {
    return false;
  }
  return true;
}

/*Log in for organizer */
async function getOrganizerLogIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const queryParams = new URLSearchParams({
    email: email,
    password: password,
  });

  const res = await fetch(
    `http://localhost:3000/loginOrganizer?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (res.status !== 200) {
    return false;
  }
  return true;
}

/*Submit to Login */
async function submit_form() {
  const userType = document.querySelector(
    'input[name="type_of_user"]:checked'
  ).id;
  console.log(userType);
  if (userType === "Simple-user") {
    if ((await getUserLogIn()) === false) {
      alert(`Fail Log In by User`);
    } else {
      alert(`Success Log In by User`);
      window.location.href = "http://localhost:3000/Home.html";
      return true;
    }
  } else if (userType === "Organizer") {
    if ((await getOrganizerLogIn()) === false) {
      alert(`Fail Log In by Organizer`);
    } else {
      alert(`Success Log In by Organizer`);
      window.location.href = "http://localhost:3000/Organizer.html";
      return true;
    }
  }
  return false;
}

/*Check for logged in already */
async function CheckLoggedIn() {
  const res = await fetch("http://localhost:3000/check", {
    method: "GET",
    credentials: "include",
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
