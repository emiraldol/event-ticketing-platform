async function confirmTransaction(pid1, pid2, pid3) {
  const name = document.getElementById(pid1).value;
  const number = document.getElementById(pid2).value;
  const CVC = document.getElementById(pid3).value;

  if (
    check_card_name(name) &&
    check_card_number(number) &&
    check_card_CVC(CVC)
  ) {
    const formData = {
      CardName: document.getElementById(pid1).value,
      CardNumber: document.getElementById(pid2).value,
      Date: document.getElementById("date").value,
      Money: document.getElementById("Money").value,
      CVC: document.getElementById(pid3).value,
    };
    const res = await fetch("http://localhost:3000/cardadd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.status != 200) {
      alert("Card Number already in use or money is negative");
      return false;
    }
    alert("Card Added Successfully!");
    window.location.href = "Home.html";
  }
}

function check_card_name(name) {
  return name.length >= 3;
}

function check_card_number(number) {
  return number.length === 16 && /^[0-9]+$/.test(number);
}

function check_card_CVC(cvc) {
  return cvc.length === 3 && /^[0-9]+$/.test(cvc);
}

async function CheckLoggedIn() {
  const res = await fetch("http://localhost:3000/check", {
    method: "GET",
    credentials: "include",
  });
  if (res.status === 201) {
    window.location.href = "http://localhost:3000/Organizer.html";
  } else if (res.status !== 200) {
    window.location.href = "http://localhost:3000/LogIn.html";
  }
}

function CurrentDate() {
  var today = new Date();
  today.setDate(today.getDate() + 1);
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }

  document.getElementById("date").min = year + "-" + month + "-" + date;
}

window.addEventListener("pageshow", function (event) {
  CheckLoggedIn();
});