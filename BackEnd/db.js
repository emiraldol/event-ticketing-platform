const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const port = 3000;
const path = require("path");
const fs = require("fs");

app.use(express.static(path.join(__dirname, "..", "FrontEnd")));
const setupSQLPath = path.join(__dirname, "..", "Project.session.sql");

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "FrontEnd", "SignIn.html"));
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser(cookieParser));
// Middleware για JSON requests
app.use(express.json());

// Δημιουργία σύνδεσης στη βάση δεδομένων
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Έλεγχος σύνδεσης κατά την εκκίνηση
db.connect((err) => {
  if (err) {
    console.error("Error Can't connect to database:", err.message);
  } else {
    console.log("Connected to database!");
    /*Run the sql file from Project.session.sql */

    const setupSQL = fs.readFileSync(setupSQLPath, 'utf-8');
    const queries = setupSQL.split(";");
    queries.forEach((query, index) => {
      query = query.trim();
      if (query == "")
        return;
      console.log(`Query ${index + 1}:`, query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing setup SQL:', err);
        } else {
          console.log('Query set up successfully');
        }
      });
    });
  }
});

app.get("/eventInfo", (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT * FROM project360.event WHERE idEvent= ?",
    [idEvent],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.delete("/deleteReservation", (req, res) => {
  const idReservation = req.query.idReservation;
  db.query(
    "DELETE FROM project360.reservation WHERE idReservation= ?",
    [idReservation],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).send("Reservation deleted successfully");
      }
    }
  );
});

app.get("/getalltickets", (req, res) => {
  const CustomerId = req.cookies.userId;
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT * FROM project360.ticket where idEvent= ? and  idCustomer= ? ",
    [idEvent, CustomerId],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.get("/getReserves", (req, res) => {
  const CustomerId = req.cookies.userId;
  db.query(
    "select * from project360.reservation where idCustomer= ?", [CustomerId],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});


app.get("/getReserve", (req, res) => {
  const CustomerId = req.cookies.userId;
  const { from, until } = req.query;
  db.query(
    "select * from project360.reservation where idCustomer= ? and Date >= ? and Date <= ?", [CustomerId, from, until],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Check user email here */

/*Get events*/
app.get("/getevents", (req, res) => {
  db.query("SELECT * FROM event", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error connecting to the database");
    } else {
      return res.status(200).json(results);
    }
  });
});



app.get("/MostPriceEvent", (req, res) => {
  const { from, until } = req.query;
  db.query("SELECT e.Name AS EventName,SUM(r.Amount) AS TotalRevenue FROM project360.event e JOIN project360.reservation r ON e.idEvent = r.idEvent WHERE r.Date BETWEEN ? AND ? GROUP BY e.Name ORDER BY TotalRevenue DESC LIMIT 1",
    [from, until], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      }
      else {
        return res.status(200).json(result);
      }
    });
});
/*SignUp user  */
app.post("/signup", (req, res) => {
  const { FirstName, LastName, PhoneNumber, Email, Password } = req.body;
  db.query(
    "INSERT INTO  project360.customer (FirstName, LastName, PhoneNumber, Email, Password) VALUES(?, ?, ?, ?, ?)",
    [FirstName, LastName, PhoneNumber, Email, Password],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      } else {
        const userId = results.insertId;
        res.cookie("userId", userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({
          status: "success",
          message: "User registered successfully",
          userId: userId,
        });
      }
    }
  );
});

app.get("/checkuser", (req, res) => {
  const { PhoneNumber, Email } = req.query;
  db.query(
    "SELECT * FROM project360.customer WHERE phoneNumber = ? or email = ?",
    [PhoneNumber, Email],
    (err, results) => {
      if (err) {
        console.error("Error querying data:", err);
        return res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      }
      else {

        if (results.length > 0) {
          return res.status(200).send({
            status: "success",
            message: "User exists",
          });
        } else {
          return res.status(404).send({
            status: "not_found",
            message: "User not found",
          });
        }
      }
    });
});

/*Login In for user */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT IdCustomer FROM customer WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error connecting to the database");
      }
      if (results.length > 0) {
        const customerId = results[0].IdCustomer;
        res.cookie("userId", customerId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 2 * 60 * 60 * 1000,
        });

        return res
          .status(200)
          .send({ status: "success", message: "User exists" });
      } else {
        return res.status(409).json(results);
      }
    }
  );
});

app.get("/ticketsforEvent", (req, res) => {
  const EventId = req.query.EventId;
  const type = req.query.type;
  db.query(
    "SELECT COUNT(*) as count FROM project360.ticket WHERE idEvent = ? and Seats= ? and Availability= ?",
    [EventId, type, false],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "error", status: "error" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.get("/AvailableTicket", (req, res) => {
  const EventId = req.query.EventId;
  const Seats = req.query.Seats;
  db.query(
    "SELECT * FROM project360.ticket WHERE Availability= ? and IdEvent= ? and Seats= ?",
    [true, EventId, Seats],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "error", status: "error" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.get("/Popular", (req, res) => {
  db.query(
    "select * from project360.event where idEvent=(SELECT idEvent FROM project360.ticket Where  Availability= ? GROUP BY idEvent  ORDER BY COUNT(*) DESC LIMIT 1)",
    [false],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error with query");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.put("/SetTicket", (req, res) => {
  const { idTicket } = req.body;
  const CustomerId = req.cookies.userId;
  db.query(
    "UPDATE project360.ticket SET Availability = ?, idCustomer = ? WHERE idTicket = ?",
    [false, CustomerId, idTicket],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "error", status: "error" });
      } else {
        return res
          .status(200)
          .send({ message: "Ticket set successfully", status: "success" });
      }
    }
  );
});



app.put("/SetTickettrue", (req, res) => {
  const { idTicket } = req.body;
  db.query(
    "UPDATE project360.ticket SET Availability = ?, idCustomer = ? WHERE idTicket = ?",
    [true, null, idTicket],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "error", status: "error" });
      } else {
        return res
          .status(200)
          .send({ message: "Ticket set successfully", status: "success" });
      }
    }
  );
});


app.get("/loginOrganizer", (req, res) => {
  const { email, password } = req.query; // Λήψη των δεδομένων από το query string

  db.query(
    "SELECT IdOrganizer FROM organizer WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error connecting to the database");
      }
      if (results.length > 0) {
        const OrganizerId = results[0].IdOrganizer;
        res.cookie("organizerId", OrganizerId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 2 * 60 * 60 * 1000,
        });
        return res
          .status(200)
          .send({ status: "success", message: "Organizer exists" });
      } else {
        return res
          .status(409)
          .send({ status: "error", message: "Organizer doesn't exist" });
      }
    }
  );
});

app.post("/addticket", (req, res) => {
  const { Seats, Price, Availability, idEvent } = req.body;
  db.query(
    "INSERT INTO ticket(Seats,Price,Availability,idEvent,idCustomer) VALUES(?,?,?,?,?)",
    [Seats, Price, Availability, idEvent, null],
    (err, results) => {
      if (err) {
        return res
          .status(400)
          .send({ status: "failed", message: "Couldnt add ticket" });
      } else {
        return res
          .status(200)
          .send({ status: "success", message: "Ticket added successfully" });
      }
    }
  );
});

app.get("/eventid", (req, res) => {
  const { EventName } = req.query;
  db.query(
    "SELECT idEvent FROM event WHERE Name= ?",
    [EventName],
    (err, results) => {
      if (err) {
        return res
          .status(400)
          .send({ status: "failed", message: "Couldnt find the eventId" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.get("/cardMoney", (req, res) => {
  const idCard = req.query.idCard;
  db.query(
    "Select Money from Card where idCard= ?",
    [idCard],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).send("error");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.put("/money", (req, res) => {
  const { idCard, Money } = req.query;
  db.query(
    "UPDATE Card SET Money = ? WHERE idCard= ?",
    [Money, idCard],
    (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .send({ status: "failed", message: "Couldnt find the eventId" });
      } else {
        return res.status(200).send({ status: "success" });
      }
    }
  );
});

app.post("/addreservation", (req, res) => {
  const { Date, Amount, NumOfTickets, idEvent, idCard } = req.body;
  const idCustomer = req.cookies.userId;
  db.query(
    "INSERT INTO reservation(Date,Amount,NumOfTickets,idCustomer,idEvent,idCard) VALUES(?,?,?,?,?,?)",
    [Date, Amount, NumOfTickets, idCustomer, idEvent, idCard],
    (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .send({ status: "failed", message: "Couldnt add the reservation" });
      } else {
        return res
          .status(200)
          .send({ status: "success", message: "reservation added" });
      }
    }
  );
});

/*Check for user and Organizer cookies */
app.get("/check", (req, res) => {
  const userId = req.cookies.userId;
  const organizerId = req.cookies.organizerId;

  if (userId) {
    return res.status(200).json({ message: `Welcome back, user ${userId}!` });
  } else if (organizerId) {
    return res
      .status(201)
      .json({ message: `Welcome back, organizer ${organizerId}!` });
  }

  res.status(400).json({ message: "Welcome! Please sign up or log in first." });
});

app.get("/getcards", (req, res) => {
  const IdCustomer = req.cookies.userId;
  db.query(
    "SELECT * FROM  project360.card WHERE idCustomer= ?",
    [IdCustomer],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.get("/logout", (req, res) => {
  if (req.cookies.userId) {
    res.clearCookie("userId");
  }
  if (req.cookies.organizerId) {
    res.clearCookie("organizerId");
  }

  res.send("Cookies cleared!");
});

/*Adds Cards */
app.post("/cardadd", (req, res) => {
  const { CardName, CardNumber, Date, Money, CVC } = req.body;
  const idCustomer = req.cookies.userId;
  if (!idCustomer) {
    return res
      .status(400)
      .send({ status: "error", message: "User ID not found in cookies" });
  }
  db.query(
    "INSERT INTO card (CardName, CardNumber, Date, Money, CVC, idCustomer) VALUES (?, ?, ?, ?, ?, ?)",
    [CardName, CardNumber, Date, Money, CVC, idCustomer],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      }
      return res
        .status(200)
        .send({ status: "success", message: "Card added successfully" });
    }
  );
});

/*Organizer put event*/
app.post("/addevent", (req, res) => {
  const IdOrganizer = req.cookies.organizerId;
  const {
    name,
    address,
    type,
    date,
    time,
    normal_price,
    normal_quantity,
    vip_price,
    vip_quantity,
    capacity,
  } = req.body;
  db.query(
    "INSERT INTO  event (name, address, type, date, time, normal_price, normal_quantity, vip_price, vip_quantity, capacity, IdOrganizer) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      address,
      type,
      date,
      time,
      normal_price,
      normal_quantity,
      vip_price,
      vip_quantity,
      capacity,
      IdOrganizer,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      } else {
        return res.status(200).send({ status: "success make a event" });
      }
    }
  );
});

/*Get count events for organazizer*/
app.get('/geteventscount', (req, res) => {

  const IdOrganizer = req.cookies.organizerId;
  db.query('SELECT COUNT(*) AS totalEvents FROM  project360.event WHERE idOrganizer= ?', [IdOrganizer], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error connecting to the database');
    }
    else {
      return res.status(200).json(results);
    }
  });
});

/*Get events for organazizer*/
app.get('/getOrganizerevents', (req, res) => {

  const IdOrganizer = req.cookies.organizerId;
  db.query('SELECT * FROM  project360.event WHERE idOrganizer= ?', [IdOrganizer], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error connecting to the database');
    }
    else {
      return res.status(200).json(results);
    }
  });
});

/*Get get Amount For Menu*/
app.get('/getAmountForMenu', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT SUM(Amount) AS totalAmount FROM project360.reservation WHERE idEvent = ?",
    [idEvent],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Delete all tickets*/
app.delete('/deletealltickets', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "DELETE FROM project360.ticket WHERE idEvent= ?",
    [idEvent],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).send("Reservation deleted successfully");
      }
    }
  );
});

/*Get get Amount For Menu*/
app.get('/getReservations', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT * FROM project360.reservation WHERE idEvent = ?",
    [idEvent],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Get count Reservations for organazizer*/
app.get('/getCountReservations', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query('SELECT COUNT(*) AS totalReservations FROM project360.reservation WHERE idEvent= ?',
    [idEvent],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error connecting to the database');
      }
      else {
        return res.status(200).json(results);
      }
    });
});

/*Delete event*/
app.delete('/deleteEvent', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "DELETE FROM project360.event WHERE idEvent= ?",
    [idEvent],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).send("Reservation deleted successfully");
      }
    }
  );
});


/*Eispajh apo Vip*/
app.get('/getVipBalance', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT SUM(Price) AS TotalVipBalance FROM project360.ticket WHERE idEvent = ? and Availability = ? and Seats = ?",
    [idEvent, false, "VIP"],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Eispajh apo Kanonika*/
app.get('/getNormalBalance', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT SUM(Price) AS TotalNormalBalance FROM project360.ticket WHERE idEvent = ? and Availability = ? and Seats = ?",
    [idEvent, false, "NORMAL"],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Krathmenes theseiw apo Kanonika*/
app.get('/getVipSeats', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT Count(*) AS TotalVipSeats FROM project360.ticket WHERE idEvent = ? and Availability = ? and Seats = ?",
    [idEvent, false, "VIP"],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Krathmenes theseiw apo Kanonika*/
app.get('/getNormalSeats', (req, res) => {
  const idEvent = req.query.idEvent;
  db.query(
    "SELECT Count(*) AS TotalNormalSeats FROM project360.ticket WHERE idEvent = ? and Availability = ? and Seats = ?",
    [idEvent, false, "NORMAL"],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error connecting to the database");
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

/*Keep the connection alive*/
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});


