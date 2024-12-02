/*All global variables here Needed!!*/
var Balance = 0;
var Totalamount = 0;
var vip_p;
var norm_p;
var vip_q;
var norm_q;
var EventTitle;
var date;
var reservations = [];
var idCard;

/*Update the cards dropdown */
function updateDropdown(cards) {
  const menuList = document.getElementById("userCardsMenuList");
  menuList
    .querySelectorAll(".card-option")
    .forEach((option) => option.remove());

  cards.forEach((card) => {
    const listItem = document.createElement("li");
    listItem.className = "card-option";
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.href = "#";
    link.textContent = card.CardName;
    link.onclick = () => showCardBalance(card);
    listItem.appendChild(link);
    menuList.insertBefore(listItem, document.getElementById("addCardOption"));
  });
}

/*Show the card Balance */
function showCardBalance(card) {
  const userBalance = document.getElementById("user-balance");
  userBalance.textContent = `${card.Money} €`;
  Balance = card.Money;
  idCard = card.idCard;
}

/*Is called at load and call all the events check if logged in add events in ui calls cards etc */
async function Events() {
  loadReservations();

  /*Check first if only user has logged in!! */
  const res1 = await fetch("http://localhost:3000/check", {
    method: "GET",
  });

  if (res1.status === 201) {
    window.location.href = "http://localhost:3000/Organizer.html";
  } else if (res1.status != 200) {
    window.location.href = "http://localhost:3000/Login.html";
  }

  const res = await fetch("http://localhost:3000/getevents", {
    method: "GET",
  });

  if (res.status != 200) {
    return;
  }
  const data = await res.json();
  const Carousel = document.querySelector(".carousel-inner");
  for (let i = 0; i < data.length; i++) {
    var date2 = new Date(data[i].Date); 
    var day = date2.getDate().toString().padStart(2, '0'); 
    var month = (date2.getMonth() + 1).toString().padStart(2, '0'); 
    var year = date2.getFullYear(); 
    var dateOnly =` ${day}-${month}-${year}`;

    var time_text = data[i].Time.toString();
    var timeOnly = time_text.substring(0, 5);
    const carouselItem = document.createElement("div");
    if (i == 0) {
      carouselItem.classList.add("carousel-item", "active");
    } else {
      carouselItem.classList.add("carousel-item");
    }
    const card = document.createElement("div");
    card.classList.add("card");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = data[i].Name;
    const dateText = document.createElement("p");
    dateText.classList.add("card-text");
    dateText.innerHTML = `<strong>Ημερομηνία:</strong> ${dateOnly}`;
    const timeText = document.createElement("p");
    timeText.classList.add("card-text");
    timeText.innerHTML = `<strong>Ώρα:</strong> ${timeOnly}`;
    const locationText = document.createElement("p");
    locationText.classList.add("card-text");
    locationText.innerHTML = `<strong>Τοποθεσία:</strong> ${data[i].Address}`;
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Κλείστε Εκδήλωση";
    button.setAttribute(
      "onclick",
      `showBookingForm('${data[i].idEvent}', '${data[i].Name}', '${data[i].Address}', '${data[i].Type}', '${dateOnly}', '${timeOnly}', '${data[i].Normal_price}', '${data[i].Vip_price}', '${data[i].Normal_quantity}','${data[i].Vip_quantity}','${data[i].Capacity}')`
    );
    cardBody.appendChild(title);
    cardBody.appendChild(dateText);
    cardBody.appendChild(timeText);
    cardBody.appendChild(locationText);
    cardBody.appendChild(button);
    card.appendChild(cardBody);
    carouselItem.appendChild(card);
    Carousel.appendChild(carouselItem);
  }
  const res2 = await fetch("http://localhost:3000/Popular", {
    method: "GET",
  });
  if (res2.status != 200) {
    return;
  }

  const response = await res2.json();
  const featuredEventDiv = document.getElementById("featuredEvent");
  const featuredEventTitle = document.getElementById("featuredEventTitle");
  const featuredEventDescription = document.getElementById(
    "featuredEventDescription"
  );
  featuredEventDiv.style.display = "block";
  if (response == null || (Array.isArray(response) && response.length === 0)) {
    featuredEventDiv.style.display = "none";
    return;
  }
  featuredEventTitle.textContent = response[0].Name;
  featuredEventDescription.textContent = response[0].Description;
}

/*Call the get request to get te cards */
async function cards() {
  const res = await fetch("http://localhost:3000/getcards", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    return;
  }
  const cards = await res.json();
  updateDropdown(cards);
}

/*Is added then you click the 'κλεισε εκδηλωση' */
async function showBookingForm(
  idEvent,
  eventTitle,
  eventLocation,
  eventType,
  eventDate,
  eventTime,
  Normal_price,
  Vip_price,
  Normal_quantity,
  Vip_quantity,
  Capacity
) {
  const res = await fetch(
    "http://localhost:3000/ticketsforEvent?EventId=" +
    parseInt(idEvent) +
    "&type=VIP",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  var vipq = await res.json();
  vipq = vipq[0].count;

  const res2 = await fetch(
    "http://localhost:3000/ticketsforEvent?EventId=" +
    parseInt(idEvent) +
    "&type=NORMAL",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  var normq = await res2.json();
  normq = normq[0].count;
  vip_q = parseInt(Vip_quantity) - vipq;
  norm_q = parseInt(Normal_quantity) - normq;
  Capacity = vip_q + norm_q;
  document.getElementById("event-normal-capacity-text").textContent = norm_q;
  document.getElementById("event-Vip-capacity-text").textContent = vip_q;
  document.getElementById(
    "event-title"
  ).innerHTML = `Κλείστε εισιτήρια για την εκδήλωση: ${eventTitle}`;
  document.getElementById("bookingForm").style.display = "block";
  EventTitle = eventTitle;
  date = eventDate;
  norm_p = parseInt(Normal_price);
  vip_p = parseInt(Vip_price);
  document.getElementById("ticket-price-text").innerText =
    parseInt(Normal_price);
  document.getElementById("ticket-price").style.display = "block";
  document.getElementById("ticket-quantity-container").style.display = "block";
  const inputElement1 = document.getElementById("ticket-quantity");
  inputElement1.setAttribute("max", norm_q);
  document.getElementById("ticket-price-text").innerText = 0 + "€";
  inputElement1.value = 0;
  document.getElementById("ticket-vip-quantity-container").style.display =
    "block";
  const inputElement = document.getElementById("ticket-vip-quantity");
  inputElement.setAttribute("max", vip_q);
  inputElement.value = 0;
  document.getElementById("normal").textContent =
    "Κανονικο -" + Normal_price + "€";
  document.getElementById("VIPP").textContent = "Vip - " + Vip_price + "€";
  document.getElementById("ticket-price").style.display = "block";
  document.getElementById("info").style.display = "block";
  document.getElementById("info").innerHTML = `
        <div class="mb-3"><strong>Ημερομηνία:</strong> ${eventDate}</div>
        <div class="mb-3"><strong>Ώρα:</strong> ${eventTime}</div>
        <div class="mb-3"><strong>Τοποθεσία:</strong> ${eventLocation}</div>
        <div class="mb-3"><strong>Είδος:</strong> ${eventType}</div>
    `;
}
document
  .getElementById("ticket-quantity")
  .addEventListener("keydown", function (e) {
    e.preventDefault();
  });

document
  .getElementById("ticket-vip-quantity")
  .addEventListener("keydown", function (e) {
    e.preventDefault();
  });

  async function showEvents() {
    if (!validateDates()) return;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const res = await fetch(
      `http://localhost:3000/MostPriceEvent?from=${startDate}&until=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Could not get reservations");
    }
    document.getElementById("output").style.display="block";
    document.getElementById("output").innerHTML="";
    const event = await res.json();
    if(event.length==0)
    {
      document.getElementById("output").innerHTML="Δεν υπαρχουν events που εχουν βγαλει κερδος σε αυτο το ευρος";
      return;
    }
    document.getElementById("output").innerHTML+=`
    <div>
      <h4>${"Event Ονομα : "+event[0].EventName}</h4>
      <p>Συνολικά κέρδοι : ${event[0].TotalRevenue}</p>`
    
}




  async function showReservations() {
    if (!validateDates()) return;
  
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
      const res = await fetch(
        `http://localhost:3000/getReserve?from=${startDate}&until=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!res.ok) {
        throw new Error("Could not get reservations");
      }
      document.getElementById("output").style.display="block";
      document.getElementById("output").innerHTML="";
      const reservations = await res.json();
      if(reservations.length==0)
      {
        document.getElementById("output").innerHTML="Δεν έχεις κάνει κρατήσεις αυτές τις μέρες";
      }
      for(let i=0;i<reservations.length;i++) 
      {
        const res2 = await fetch(
          `http://localhost:3000/eventInfo?idEvent=${reservations[i].idEvent}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        if (!res2.ok) {
          throw new Error("Could not get reservations");
        }
        const event = await res2.json();
        const date = new Date(reservations[i].Date);
        document.getElementById("output").innerHTML+=`
          <div>
            <h4>${"Event Ονομα : "+event[0].Name}</h4>
            <p>Ημερομηνια κρατησης : ${date}</p>
            <p>Εισητηρια που πηρες : ${reservations[i].NumOfTickets}</p>`;
      }
  
}

/*Delete reservation and all its tickets and returns the money back */
async function deleteReservation(reservations, event) {
  var i;
  var res4 = await fetch(
    "http://localhost:3000/getalltickets?idEvent=" + event,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!res4.ok) {
    alert("ERROR could not delete tickets");
    return;
  }
  const tickets = await res4.json();
  for (i = 0; i < reservations.NumOfTickets; i++) {
    const formdata = {
      idTicket: tickets[i].idTicket,
    };
    const res5 = await fetch("http://localhost:3000/SetTickettrue?idEvent=", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(formdata),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res5.ok) {
      alert("ERROR could not delete ticket");
      return;
    }
  }
  var res2 = await fetch(
    "http://localhost:3000/cardMoney?idCard=" + reservations.idCard,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res2.ok) {
    alert("ERROR could not load card money");
    return;
  }
  res2 = await res2.json();
  const cardMoney = res2[0].Money;
  const totalmoney = cardMoney + reservations.Amount;
  var res3 = await fetch(
    "http://localhost:3000/money?idCard=" +
    reservations.idCard +
    "&Money=" +
    totalmoney,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!res3.ok) {
    alert("ERROR could not load card money");
    return;
  }

  const res = await fetch(
    "http://localhost:3000/deleteReservation?idReservation=" +
    reservations.idReservation,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) {
    alert("ERROR could not delete tickets");
    return;
  }

  alert("Deleted reservation successfully and all tickets you bought");
  window.location.reload();
}

/*Load all the reservations */
async function loadReservations() {
  try {
    const response = await fetch("http://localhost:3000/getReserves", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Failed to fetch reservations");
      return;
    }
    const reservations = await response.json();
    const reservationList = document.getElementById("reservationList");
    const noReservations = document.getElementById("noReservations");
    reservationList.innerHTML = "";
    if (reservations.length === 0) {
      noReservations.style.display = "block";
    } else {
      noReservations.style.display = "none";
      for (const reservation of reservations) {
        const eventResponse = await fetch(
          `http://localhost:3000/eventInfo?idEvent=${reservation.idEvent}`,
          {
            method: "GET",
          }
        );
        if (!eventResponse.ok) {
          console.error(
            `Failed to fetch event info for EventId: ${reservation.EventId}`
          );
          continue;
        }
        const eventInfo = await eventResponse.json();
        const eventName = eventInfo[0].Name;
        const li = document.createElement("li");
        li.className =
          "dropdown-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
                    <span>${eventName} - Εισιτήρια: ${reservation.NumOfTickets}</span>
                `;
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm ms-2";
        deleteButton.textContent = "Διαγραφή";
        deleteButton.onclick = () =>
          deleteReservation(reservation, eventInfo[0].idEvent);
        li.appendChild(deleteButton);
        reservationList.appendChild(li);
      }
    }
  } catch (error) {
    console.error("Error loading reservations:", error);
  }
}

function validateDates() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Παρακαλώ συμπληρώστε και τις δύο ημερομηνίες!");
    return false;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert('Η ημερομηνία "Από" πρέπει να είναι πριν ή ίση με την "Μέχρι".');
    return false;
  }

  return true;
}

/*Makes the Reservetations changes tickets to available false and adds the customer */
async function MakeReservation() {
  if (Balance < Totalamount) {
    alert("Μη επαρκες υπολοιπο!");
    return;
  }
  if (
    document.getElementById("ticket-vip-quantity").value == 0 &&
    document.getElementById("ticket-quantity").value == 0
  ) {
    alert("Σας παρακαλω αγοράστε τουλαχιστον ενα εισιτηριο!");
    return;
  }

  const res = await fetch(
    "http://localhost:3000/eventid?EventName=" + EventTitle,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    return;
  }
  var data = await res.json();
  const EventId = data[0].idEvent;
  const vips = parseInt(document.getElementById("ticket-vip-quantity").value);
  const norms = parseInt(document.getElementById("ticket-quantity").value);

  try {
    var Normal = await fetch(
      "http://localhost:3000/AvailableTicket?EventId=" +
      EventId +
      "&Seats=NORMAL",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!Normal.ok) throw new Error("Error fetching normal tickets");
    Normal = await Normal.json();

    var Vip = await fetch(
      "http://localhost:3000/AvailableTicket?EventId=" + EventId + "&Seats=VIP",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!Vip.ok) throw new Error("Error fetching VIP tickets");
    Vip = await Vip.json();

    if (Vip.length < vips) {
      alert("Not enough VIP tickets available!");
      return;
    }
    if (Normal.length < norms) {
      alert("Not enough Normal tickets available!");
      return;
    }

    /*vips in here*/
    for (let i = 0; i < vips; i++) {
      const info = { idTicket: Vip[i].idTicket };
      const ticket = await fetch("http://localhost:3000/SetTicket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      if (!ticket.ok) throw new Error("Error setting VIP ticket");
    }

    /*Norms tickets here */
    for (let i = 0; i < norms; i++) {
      const info = { idTicket: Normal[i].idTicket };
      const ticket2 = await fetch("http://localhost:3000/SetTicket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      if (!ticket2.ok) throw new Error("Error setting Normal ticket");
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }

  const currentDate = new Date();
  const sqlDate = currentDate.toISOString().split("T")[0];
  const Data = {
    Date: sqlDate,
    Amount: Totalamount,
    NumOfTickets: parseInt(vips) + parseInt(norms),
    idEvent: EventId,
    idCard: idCard,
  };
  const res3 = await fetch("http://localhost:3000/addreservation", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Data),
  });
  if (res3.status != 200) {
    return false;
  }
  var money = Balance - Totalamount;
  const response = await fetch(
    "http://localhost:3000/money?idCard=" + idCard + "&Money=" + money,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return;
  }

  alert("Reservation added sucessfully");
  window.location.reload();
}

/*it is called whenever you add a amount */
function TotalAmount() {
  vip_amount = document.getElementById("ticket-vip-quantity").value * vip_p;
  Normal_price = document.getElementById("ticket-quantity").value * norm_p;
  var total = vip_amount + Normal_price;
  Totalamount = total;
  document.getElementById("ticket-price-text").innerText = total + "€";
}

/*For Log Out */
async function LogOut() {
  const res = await fetch("http://localhost:3000/logout", {
    method: "GET",
  });
  window.location.href = "http://localhost:3000/Login.html";
}

function AddCard() {
  window.location.href = "http://localhost:3000/card.html";
}

/*pageshow delete the browser web cache so u need to load these funct everytime */
window.addEventListener("pageshow", function (event) {
  Events();
  cards();
});
