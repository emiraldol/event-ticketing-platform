CREATE DATABASE IF NOT EXISTS project360;
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Card;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Organizer;
CREATE TABLE Customer (
    idCustomer INT AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    PhoneNumber BIGINT,
    Email VARCHAR(50),
    Password VARCHAR(50),
    PRIMARY KEY (idCustomer),
    UNIQUE (PhoneNumber),
    UNIQUE (Email)
);
CREATE TABLE Organizer (
    idOrganizer INT AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    PhoneNumber BIGINT,
    Email VARCHAR(50),
    Password VARCHAR(50),
    PRIMARY KEY (idOrganizer),
    UNIQUE (PhoneNumber)
);
CREATE TABLE Event (
    idEvent INT AUTO_INCREMENT,
    Name VARCHAR(50),
    Address VARCHAR(50),
    Type VARCHAR(50),
    Date DATE,
    Time TIME,
    Normal_price INT,
    Normal_quantity INT,
    Vip_price INT,
    Vip_quantity INT,
    Capacity INT CHECK (Capacity >= 0),
    idOrganizer INT,
    PRIMARY KEY (idEvent),
    FOREIGN KEY (idOrganizer) REFERENCES Organizer(idOrganizer),
    UNIQUE (Name)
);
CREATE TABLE Card (
    idCard INT AUTO_INCREMENT,
    CardName VARCHAR(50),
    CardNumber VARCHAR(16),
    Date DATE,
    Money INT CHECK (Money >= 0),
    CVC VARCHAR(3),
    idCustomer INT,
    PRIMARY KEY (idCard),
    UNIQUE (CardNumber),
    FOREIGN KEY (idCustomer) REFERENCES Customer(idCustomer)
);
CREATE TABLE Reservation (
    idReservation INT AUTO_INCREMENT,
    Date DATE,
    Amount INT CHECK (Amount >= 0),
    NumOfTickets INT CHECK (NumOfTickets >= 0),
    idCustomer INT,
    idEvent INT,
    idCard INT,
    PRIMARY KEY (idReservation),
    FOREIGN KEY (idCustomer) REFERENCES Customer(idCustomer),
    FOREIGN KEY (idEvent) REFERENCES Event(idEvent),
    FOREIGN KEY (idCard) REFERENCES Card(idCard)
);
CREATE TABLE Ticket (
    idTicket INT AUTO_INCREMENT,
    Seats VARCHAR(10),
    Price FLOAT CHECK (Price >= 0),
    Availability BOOLEAN,
    idEvent INT,
    idCustomer INT,
    PRIMARY KEY (idTicket),
    FOREIGN KEY (idEvent) REFERENCES Event(idEvent),
    FOREIGN KEY (idCustomer) REFERENCES Customer(idCustomer)
);
INSERT INTO Organizer (
        FirstName,
        LastName,
        PhoneNumber,
        Email,
        Password
    )
VALUES (
        'Antonios',
        'Kavalieros',
        6985623413,
        'csd5088@csd.uoc.gr',
        'AKava'
    );
INSERT INTO Organizer (
        FirstName,
        LastName,
        PhoneNumber,
        Email,
        Password
    )
VALUES (
        'Emiraldo',
        'Lamakia',
        6973653309,
        'csd5059@csd.uoc.gr',
        'Ilovelol12@'
    );
INSERT INTO Organizer (
        FirstName,
        LastName,
        PhoneNumber,
        Email,
        Password
    )
VALUES (
        'Georgia',
        'chrysou',
        6973653310,
        'csd4567@csd.uoc.gr',
        'TsigaraForEver'
    );
   
