// Χειριστής υπολογισμού της συνολικής τιμής
function calculateTotalQuantity() {
  const regularQuantity = parseInt(
    document.getElementById("regular-ticket-quantity").value
  );
  const vipQuantity = parseInt(
    document.getElementById("vip-ticket-quantity").value
  );

  const totalQuantity = regularQuantity + vipQuantity;
  document.getElementById("total-quantity").value = `${totalQuantity}`;
}

// Προσθήκη ακροατών για να ενημερώνεται η τιμή σε πραγματικό χρόνο
document
  .getElementById("regular-ticket-quantity")
  .addEventListener("input", calculateTotalQuantity);
document
  .getElementById("vip-ticket-quantity")
  .addEventListener("input", calculateTotalQuantity);

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

  document.getElementById("event-date").min = year + "-" + month + "-" + date;
}

async function postEvent() {
  const formData = {
    name: document.getElementById("event-title").value,
    address: document.getElementById("event-address").value,
    type: document.getElementById("type").value,
    date: document.getElementById("event-date").value,
    time: document.getElementById("event-time").value,
    normal_price: document.getElementById("regular-ticket-price").value,
    normal_quantity: document.getElementById("regular-ticket-quantity").value,
    vip_price: document.getElementById("vip-ticket-price").value,
    vip_quantity: document.getElementById("vip-ticket-quantity").value,
    capacity: document.getElementById("total-quantity").value,
  };

  const res = await fetch("http://localhost:3000/addevent", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (res.status != 200) {
    alert("Αυτο το event υπαρχει ηδη στην βαση");
    return false;
  }
  return true;
}

async function check_All() {
  const normal_p = document.getElementById("regular-ticket-price").value;
  const vip_p = document.getElementById("vip-ticket-price").value;
  if (parseInt(vip_p) > parseInt(normal_p)) {
    if ((await postEvent()) === false) {
      alert(`Λαθος στην δημιουργια`);
      return false;
    }

    var name = document.getElementById("event-title").value;
    const res = await fetch("http://localhost:3000/eventid?EventName=" + name, {
      method: "GET",
      credentials: "include",
    });
    if (res.status != 200) {
      alert("Something went wrong");
      return false;
    }
    const data = await res.json();
    const EventId = data[0].idEvent;
    var norm = document.getElementById("regular-ticket-quantity").value;
    var vip = document.getElementById("vip-ticket-quantity").value;
    for (let i = 0; i < norm; i++) {
      const formdata = {
        Seats: "NORMAL",
        Price: normal_p,
        Availability: true,
        idEvent: EventId,
      };
      await fetch("http://localhost:3000/addticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
    }

    for (let i = 0; i < vip; i++) {
      const formdata = {
        Seats: "VIP",
        Price: vip_p,
        Availability: true,
        idEvent: EventId,
      };
      await fetch("http://localhost:3000/addticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
    }

    alert("Το event δημιουργηθηκε επιτυχως");
    window.location.href = "Organizer.html";
    return true;
  }

  alert("Η τιμή του Vip πρέπει να είναι μεγαλύτερη από την κανονική τιμή");
  return false;
}

async function LogOut() {
  const res = await fetch("http://localhost:3000/logout", {
    method: "GET",
  });
  window.location.href = "http://localhost:3000/Login.html";
}

async function CheckLoggedIn() {
  const res = await fetch("http://localhost:3000/check", {
    method: "GET",
  });

  if (res.status === 200) {
    window.location.href = "http://localhost:3000/Home.html";
  } else if (res.status !== 201) {
    window.location.href = "http://localhost:3000/Login.html";
  }
}

//////////////////////////Nea apo edw kai katw 12/12 Antonis
async function OrganizerCountEvents() {
  const response = await fetch('http://localhost:3000/geteventscount', {
      method: 'GET',
      credentials: 'include'
  });

  if (!response.ok) {
      console.error("Failed to fetch count events");
      return;
  }
  const countevent = await response.json();
  const EventList = document.getElementById("EventList");
  const EventOption = document.getElementById("EventOption");
  EventList.innerHTML = "";
  if (countevent[0].totalEvents === 0) {
      EventOption.style.display = "block";
      document.getElementById("organizerEventMenu").disabled = true;
  } else {
      EventOption.style.display = "none";
      document.getElementById("organizerEventMenu").disabled = false;
      const res = await fetch('http://localhost:3000/getOrganizerevents', {
          method: 'GET',
          credentials: 'include'
      });
      if (!res.ok) {
          console.error("Failed to fetch events");
          return;
      }
      const eventInfo = await res.json();
      updateDropdown(countevent[0].totalEvents, eventInfo);
  }
}


var totalBalance = 0;
var totalVipBalance = 0;
var totalNormalBalance = 0;
var totalVipSeats = 0;
var totalNormalSeats = 0;

async function updateDropdown(totalEvents, eventInfo) {
  const organizerEvents = document.getElementById("organizer-events");
  organizerEvents.textContent = `${totalEvents} `;

  const menuList = document.getElementById("EventList");
  menuList.querySelectorAll(".event-option").forEach(option => option.remove());

  for (const event of eventInfo) {
      const listItem = document.createElement("li");
      listItem.className = "event-option d-flex justify-content-between align-items-center";
      const eventNameAndAmount = document.createElement("span");

      const res = await fetch(`http://localhost:3000/getVipBalance?idEvent=${event.idEvent}`, {
          method: 'GET',
      });
      if (!res.ok) {
          console.error(`Failed to fetch VipBalance: ${event.idEvent}`);
          return;
      }
      const VipBalance = await res.json();

      if (VipBalance[0].TotalVipBalance === null) {
        VipBalance[0].TotalVipBalance = 0;
      }
      totalVipBalance = totalVipBalance + parseFloat(VipBalance[0].TotalVipBalance); 


      const res2 = await fetch(`http://localhost:3000/getNormalBalance?idEvent=${event.idEvent}`, {
        method: 'GET',
      });
      if (!res2.ok) {
          console.error(`Failed to fetch NormalBalance: ${event.idEvent}`);
          return;
      }
      const NormalBalance = await res2.json();

      if (NormalBalance[0].TotalNormalBalance === null) {
        NormalBalance[0].TotalNormalBalance = 0;
      }
      totalNormalBalance = totalNormalBalance + parseFloat(NormalBalance[0].TotalNormalBalance); 

      const res3 = await fetch(`http://localhost:3000/getVipSeats?idEvent=${event.idEvent}`, {
        method: 'GET',
      });
      if (!res3.ok) {
          console.error(`Failed to fetch VipBalance: ${event.idEvent}`);
          return;
      }
      const VipSeats = await res3.json();

      if (VipSeats[0].TotalVipSeats === null) {
        VipSeats[0].TotalVipSeats = 0;
      }
      totalVipSeats = totalVipSeats + parseFloat(VipSeats[0].TotalVipSeats); 


      const res4 = await fetch(`http://localhost:3000/getNormalSeats?idEvent=${event.idEvent}`, {
        method: 'GET',
      });
      if (!res4.ok) {
          console.error(`Failed to fetch NormalBalance: ${event.idEvent}`);
          return;
      }
      const NormalSeats = await res4.json();

      if (NormalSeats[0].TotalNormalSeats === null) {
        NormalSeats[0].TotalNormalSeats = 0;
      }
      totalNormalSeats = totalNormalSeats + parseFloat(NormalSeats[0].TotalNormalSeats);

      const response2 = await fetch(`http://localhost:3000/getAmountForMenu?idEvent=${event.idEvent}`, {
          method: 'GET'
      });
      if (!response2.ok) {
          console.error(`Failed to fetch amount: ${event.idEvent}`);
          return;
      }
      const amount = await response2.json();

      if (amount[0].totalAmount === null) {
          amount[0].totalAmount = 0;
      }

      eventNameAndAmount.textContent = `${event.Name} ${amount[0].totalAmount}€`;
      totalBalance = totalBalance + parseFloat(amount[0].totalAmount); 
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.textContent = "Διαγραφή";
      deleteButton.onclick = () => deleteEvent(event.idEvent);

      listItem.appendChild(eventNameAndAmount);
      listItem.appendChild(deleteButton);
      menuList.insertBefore(listItem, document.getElementById("EventOption"));
  }
  console.log(totalBalance);
  document.getElementById("Allbalance").textContent = totalBalance + "€";
  document.getElementById("VipBalance").textContent = totalVipBalance + "€";
  document.getElementById("NormalBalance").textContent = totalNormalBalance + "€";

  /*pita*/
  if (totalVipSeats > 0 || totalNormalSeats > 0) {
    document.getElementById('cycle').style.display = 'block';
    
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['VIP Θέσεις', 'Κανονικές Θέσεις'],
            datasets: [{
                data: [totalVipSeats, totalNormalSeats], 
                backgroundColor: ['#007bff', '#6c757d'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
  }
}

/* Delete reservation and all its tickets and returns the money back and delete event */
async function deleteEvent(idEvent) {
  console.log("event.idEvent", idEvent);
  var response4 = await fetch(`http://localhost:3000/deletealltickets?idEvent=${idEvent}`, {
      method: "DELETE",
  });
  if (!response4.ok) {
      alert("ERROR could not delete tickets");
      return;
  }

  var response5 = await fetch(`http://localhost:3000/getReservations?idEvent=${idEvent}`, {
      method: "GET",
  });
  if (!response5.ok) {
      alert("ERROR could not get reservations");
      return;
  }
  const reservations = await response5.json();

  var response8 = await fetch(`http://localhost:3000/getCountReservations?idEvent=${idEvent}`, {
      method: "GET",
  });
  if (!response8.ok) {
      alert("ERROR could not get count reservations");
      return;
  }
  const CountReservations = await response8.json();
  console.log("Δεν μπήκα");
  console.log(CountReservations[0].totalReservations);

  for (let i = 0; i < CountReservations[0].totalReservations; i++) {
      console.log("Καθόλου");
      var response6 = await fetch(`http://localhost:3000/cardMoney?idCard=${reservations[i].idCard}`, {
          method: "GET",
      });
      if (!response6.ok) {
          alert("ERROR could not load card money");
          return;
      }
      const card = await response6.json();
      //console.log("card", card);
      const cardMoney = card[0].Money;
      //console.log("card[0].Money", card[0].Money);
      const totalmoney = cardMoney + reservations[i].Amount;
      //console.log("reservations[i].Amount", reservations[i].Amount);
      console.log(totalmoney);

      var response7 = await fetch(`http://localhost:3000/money?idCard=${reservations[i].idCard}&Money=${totalmoney}`, {
          method: "PUT",
      });
      if (!response7.ok) {
          alert("ERROR could not load card money");
          return;
      }

      console.log("reservations[i].idReservation", reservations[i].idReservation);

      const res = await fetch(`http://localhost:3000/deleteReservation?idReservation=${reservations[i].idReservation}`, {
          method: "DELETE",
      });
      if (!res.ok) {
          alert("ERROR could not delete reservation");
          return;
      }
  }

  const res2 = await fetch(`http://localhost:3000/deleteEvent?idEvent=${idEvent}`, {
  method: "DELETE",
  });
  if (!res2.ok) {
      alert("ERROR could not delete reservation");
      return;
  }

  alert("Event, reservations, and all tickets deleted successfully. All clients have received their money back !!!");
  window.location.reload();
}

window.addEventListener("pageshow", function (event) {
  CheckLoggedIn();
  OrganizerCountEvents();
});