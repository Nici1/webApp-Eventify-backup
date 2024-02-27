import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config({path: '.env'})


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
    
}).promise()

async function insert_Spectator(Name, Surname, Email, Password){

    const result = await pool.query(`INSERT INTO Spectator (Name, Surname, Email, Password) VALUES (?, ?, ?, ?)`, [Name, Surname, Email, Password]);
    return result
}

async function get_Spectator(Email){

    const result = await pool.query(`SELECT * FROM Spectator WHERE Email=?`, [Email]);
    return result[0]
}




async function get_Landlord(Email){

    const result = await pool.query(`SELECT * FROM Landlord WHERE Email=?`, [Email]);
    return result[0]
}



async function insert_Landlord(Name, Surname, Address, DateofBirth, Email, Password){

    const result = await pool.query(`INSERT INTO Landlord (Name, Surname, Address, DateofBirth, Email, Password) VALUES (?, ?, ?, ?, ?, ?)`, 
    [Name, Surname, Address, DateofBirth, Email, Password]);
    return result
}


async function insert_Performer(Name, Surname, Artist, Category, Email, Password){

    const Category_id = await get_CategoryID(Category);
    const result = await pool.query(`INSERT INTO Performer (Name, Surname, Artist, CategoryID, Email, Password) VALUES (?, ?, ?, ?, ?, ?)`, [Name, Surname, Artist, Category_id, Email, Password]);
    return result
}

async function get_Performer(Email){

    const result = await pool.query(`SELECT * FROM Performer WHERE Email=?`, [Email]);
    return result[0]
}


async function insert_Venue(Name, Capacity, Address, Category, Landlord_id){

    const Category_id = await get_CategoryID(Category);
    const result = await pool.query(`INSERT INTO Venue (Name, Capacity, Address, CategoryID, LandlordID) VALUES (?, ?, ?, ?, ?)`, 
    [Name, Capacity, Address, Category_id, Landlord_id]);
    console.log('From venue ', result[0].insertId)
    return result[0].insertId
}

async function get_Venue(pageNumber, pageSize, City) {
  console.log(pageNumber)
  const offset = (pageNumber - 1) * pageSize;

    if (City==='All'){
    const result = await pool.query(`SELECT ID, Name, Capacity, Address, LandlordID, City, Description FROM Venue ORDER BY ID LIMIT ? OFFSET ?`,
    [pageSize, offset]);
  return result[0];
    }
    else{
    const result = await pool.query(
    `SELECT ID, Name, Capacity, Address, LandlordID, City, Description FROM Venue WHERE City=? ORDER BY ID LIMIT ? OFFSET ?`,
    [City, pageSize, offset]);
  return result[0];
    }
    
  
}


async function get_Venue_info(Name) {
  
  const result = await pool.query(`SELECT Name, Capacity, Address, Description, City, LandlordID FROM Venue WHERE Name = ?`,[Name]);

  return result[0];
}

async function get_Venue_Country() {

  const result = await pool.query(`SELECT DISTINCT Country FROM Venue ORDER BY Country`);
  return result[0];
}

async function get_Venue_City() {

  const result = await pool.query(`SELECT DISTINCT City FROM Venue ORDER BY City`);
  return result[0];
}



async function get_CategoryID(Category){
    console.log(Category)
    const Category_id = await pool.query(`SELECT ID FROM Category WHERE Name = ?`, [Category]);
    
    return Category_id[0][0].ID;

}


async function get_time_Availability(venueID, date){

  console.log(venueID, ' ', date)
 const intervals = await pool.query(
        `SELECT ID, StartTime, EndTime 
         FROM Venueavailability 
         WHERE VenueID = ? AND Date = ?`, 
        [venueID, date]
    );    
    return intervals[0];

}

async function get_date_Availability(venueID, month){
    console.log(venueID, month)
    const dates = await pool.query(
        `SELECT ID, Date 
         FROM Venueavailability 
         WHERE VenueID = ? AND MONTH(Date) = ? AND Status='available'`, 
        [venueID, month]
    );  
    console.log("Dates ", dates[0])  
    return dates[0];

}

async function insert_Application(performerid, availabilityid){

    const result = await pool.query(`INSERT INTO Application (PerformerID, AvailabilityID) VALUES (?, ?)`, 
    [performerid, availabilityid]);
    return result
}

async function get_Applications(pageNumber, pageSize, landlordID) {
  console.log(pageNumber);
  const offset = (pageNumber - 1) * pageSize;

  const venues = await pool.query(
    `SELECT * FROM Venue WHERE LandlordID = ? ORDER BY ID LIMIT ? OFFSET ?`,
    [landlordID, pageSize, offset]
  );
  
  const venueRows = venues[0];
  const venueIDs = venueRows.length > 0 ? venueRows.map(venue => venue.ID) : [];

  console.log("IDS ", venueIDs);

  if (venueIDs.length === 0) {
    console.log("No venues found for the landlord");
    return []; // Return an empty array if no venues found
  }

  const availability = await pool.query(
    `SELECT * FROM VenueAvailability WHERE VenueID IN (?) ORDER BY ID LIMIT ? OFFSET ?`,
    [venueIDs, pageSize, offset]
  );
  console.log("Availability ", availability);

  const availabilityRows = availability[0];
  const avIDs = availabilityRows.length > 0 ? availabilityRows.map(av => av.ID) : [];

  console.log('avIDs ', avIDs);

  if (avIDs.length === 0) {
    console.log("No availability found for the venues");
    return []; // Return an empty array if no availability found
  }

  const result = await pool.query(
    `SELECT PerformerID FROM Application WHERE AvailabilityID IN (?) ORDER BY ID LIMIT ? OFFSET ?`,
    [avIDs, pageSize, offset]
  );

  console.log("Final result ", result[0]);
  return result[0];
}



async function get_MyVenues(pageNumber, pageSize, ID) {
  console.log(pageNumber)
  const offset = (pageNumber - 1) * pageSize;

  const result = await pool.query( `SELECT ID, Name, Capacity, Address, LandlordID, City, Description FROM Venue WHERE LandlordID=? ORDER BY ID LIMIT ? OFFSET ?`,
    [ID, pageSize, offset]);
  return result[0];
    }
    
async function get_MyVenue(ID) {

  const result = await pool.query( `SELECT ID, Name, Capacity, Address, LandlordID, City, Description FROM Venue WHERE LandlordID=?`,[ID]);
  return result[0];
    }


export {insert_Spectator, get_Spectator, insert_Landlord, get_Landlord, insert_Venue, get_Performer, insert_Performer, get_Venue, 
  get_Venue_City, get_Venue_Country, get_Venue_info, get_time_Availability,  insert_Application, get_Applications, get_date_Availability, get_MyVenues};