import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar'; // Import the Calendar component
import '.././calendar.css';

function VenueDetailPage() {
  const [venueInfo, setVenueInfo] = useState({
    Name: '',
    Capacity: 0,
    Address: '',
    Description: '',
    City: '',
    LandlordID: 1
  });
  const { bookName } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(''); // State for selected time
  const [availableTime, setAvailableTime] = useState(); // State for selected time
  const [images, setImages] = useState([]); // State for images
  const [warning, setWarning] = useState();
  const [highlightedDates, setHighlightedDates] = useState([]);


  const handleDateChange = async (date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
    console.log(bookName.split('-')[1]);
    
    try {
      // Send selected date to the backend
      const response = await axios.post('/venue/Date', { date: date, id: bookName.split('-')[1] }, {
        headers: {
          'token': localStorage.getItem('Performer-Token'),
        },
      });
      console.log('Date sent from backend:', response.data);
      setAvailableTime(response.data);
    } catch (error) {
      console.error('Error sending date to backend:', error);
    }
  };

  useEffect(() => {
    async function getVenueInfo() {
      try {
        const response = await axios.get(`/venue/${bookName.split('-')[0]}`, {
          headers: { 'token': localStorage.getItem('Spectator-Token') },
        });
        console.log("venue info ", response.data.venueData[0].LandlordID)
        setVenueInfo({ ...response.data.venueData[0] });

        // Fetch images after venue info is loaded
        fetchImages(response.data.venueData[0].LandlordID);
      } catch (error) {
        console.error('Error fetching venue info:', error);
      }
    }
    getVenueInfo();
    


  }, [bookName]);

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const fetchImages = async (landlordID) => {
    try {
      console.log("as ", landlordID)
      const response = await axios.post('/venue/getImages', { id: landlordID, venue_id: bookName.split('-')[1] }, {
        headers: {
          'token': localStorage.getItem('Performer-Token'),
        }
      });
      setImages(response.data);
      console.log("Response ", response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSubmit = async () => {
    if (selectedTime === '') {
      setWarning('No time interval was selected')
    }
    else{
    try {
      setWarning('Okay')
      // Send selected time interval to the backend
      const response = await axios.post('/apply', {
        selectedTime: selectedTime,
      }, {
          headers: { 'token': localStorage.getItem('Performer-Token') },
        });
      console.log('Response from submit:', response.data);
      // Optionally, reset the selected time after successful submission
      setSelectedTime('');
    } catch (error) {
      console.error('Error submitting time interval:', error);
    }
  }
  };

  // Function to handle the month change in the calendar
  const handleActiveStartDateChange = async ({ activeStartDate }) => {
    console.log('New active start date:', activeStartDate);
    // Make Axios GET request to the /venue/availability endpoint
    try {
      const response = await axios.post('/venue/availability', {date: activeStartDate, id: bookName.split('-')[1]}, {
        headers: { 'token': localStorage.getItem('Spectator-Token') }
      });
      console.log('Response from /venue/availability:', response.data);
      
      const datesWithIds = response.data.map(entry => ({
      date: new Date(entry.Date),
      id: entry.ID
    }));
    setHighlightedDates(datesWithIds);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };


    useEffect(() => {
    // Get the current date
    const currentDate = new Date();
    console.log('current date ', currentDate)
    // Call the handleActiveStartDateChange function with the current date
    handleActiveStartDateChange({ activeStartDate: currentDate });
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  return (
    <div className='VenuePage'>
      {venueInfo ? (
        <div>
          <h1>{venueInfo.Name}</h1>
          <h3>{venueInfo.City}</h3>
          <div className="image-container">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div className="image-preview" key={index}>
                  <img className="preview-image" src={`data:image/png;base64,${image}`} alt={`Preview ${index + 1}`}  width="100%" height="100%"/>
                </div>
              ))
            ) : (
              <p>No images uploaded</p>
            )}
          </div>
          <p>{venueInfo.Description}</p>
          <div className='calendar-info'>
            <div className='calendar-container'>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                onActiveStartDateChange={handleActiveStartDateChange}
                className='custom-calendar' 
                tileClassName={({ date }) => {
                if (highlightedDates.some(entry => new Date(entry.date).getDate() === date.getDate())) {
                  return 'colored-tile';
                }
                return '';
              }}
              />
            </div>
          <div className='info'>
            <ul>
              <li>Capacity: {venueInfo.Capacity}</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
          </div>
          <select value={selectedTime} onChange={handleTimeChange}>
            <option value="">Select Time</option>
            {availableTime?.map((c, index) => (<option key={index} value={c.ID}>{c.StartTime + '-' + c.EndTime}</option>))}
          </select>
          {warning !== 'Okay' && !selectedTime && <p style={{ color: 'red' }}>No time interval was selected</p>}
          <div>
            <button className='venue-element' style={{ backgroundColor: 'gray' }} onClick={handleSubmit}>Submit</button>
          </div>  
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default VenueDetailPage;












