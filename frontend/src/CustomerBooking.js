import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const CustomerBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [barberUnavailableSlots, setBarberUnavailableSlots] = useState({});
  const [selectedBarber, setSelectedBarber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Get the barbers list
  useEffect(() => {
    // Fetch the list of barbers from the Django backend
    const fetchBarbers = () => {
      axios.get('http://127.0.0.1:8000/api/barbers/')
      .then((response) => {
        setBarbers(response.data);
      })
      .catch((error) => {
        console.error(`Could not get barbers list: ${error}`);
      });
    };

    const fetchUnavailableSlotsList = () => {
        axios.get('http://127.0.0.1:8000/api/bookings/').then((response) => {

        const barberUnavailableSlots = {};

        response.data.forEach((booking) => {
            const barberId = booking.barber.toString(); // Convert barber ID to string
            const bookingDatetime = new Date(booking.booking_datetime); // Parse the datetime
            const dateKey = bookingDatetime.toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
            const timeKey = bookingDatetime.toISOString().split("T")[1].slice(0, 5); // Extract time (HH:MM)
        
            // Initialize the barber's entry if it doesn't exist
            if (!barberUnavailableSlots[barberId]) {
              barberUnavailableSlots[barberId] = {};
            }
        
            // Initialize the date's entry if it doesn't exist
            if (!barberUnavailableSlots[barberId][dateKey]) {
              barberUnavailableSlots[barberId][dateKey] = [];
            }
        
            // Add the time to the corresponding barber and date
            barberUnavailableSlots[barberId][dateKey].push(timeKey);
            setBarberUnavailableSlots(barberUnavailableSlots);
          });
      })
      .catch((error) => {
        console.error(`Could not get barbers unavailable list: ${error}`);
      });
    };

    fetchBarbers();
    fetchUnavailableSlotsList();
  }, []);

  // Define time slots from 10 AM to 7 PM
  const timeSlots = [];
  for (let hour = 10; hour <= 19; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  // Get unavailable time slots for the selected barber and date
  const getUnavailableTimeSlots = () => {
    if (!selectedBarber || !selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return barberUnavailableSlots[selectedBarber]?.[dateKey] || [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!selectedBarber || !selectedDate || !selectedTime || !customerName || !phone || !email) {
      alert('Please fill out all fields, select a barber, date, and time slot.');
      return;
    }

    // Prepare the data for the POST request
    const bookingData = {
        barber_id: selectedBarber,
        booking_datetime: `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}:00`,
        customer_name: customerName,
        contactNo: phone,
        email: email,
      };
    
      console.log(bookingData);

    // POST request to make booking
    axios.post('http://127.0.0.1:8000/api/book-barber-slot/', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        withCredentials: true, 
    })
    .then((response) => {
        alert(`Appointment Booking Successful!`);
        navigate('/');
    })
    .catch((error) => {
        alert(`Appointment Booking Failed: ${error}`);
    })
    
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={handleLogoClick}>
        <img
          src="/logo.png" // Path to your logo image
          alt="Logo"
          style={styles.logo}
        />
      </div>

      <h1>Customer Booking</h1>
      <div style={styles.bookingForm}>
        {/* Barber Selection */}
        <div style={styles.formGroup}>
          <label htmlFor="barber">Select Barber:</label>
          <select
            id="barber"
            value={selectedBarber}
            onChange={(e) => {
              setSelectedBarber(e.target.value);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            style={styles.input}
            required
          >
            <option value="">Select a barber</option>
            {barbers.map((barber) => (
              <option key={barber.barber_id} value={barber.barber_id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        {selectedBarber && (<div>
          <h2>Select a Date</h2>
          <div style={styles.calendarContainer}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              disabled={{ before: new Date() }}
            />
          </div>
        </div>
      )}

        {/* Time Slot Selection */}
        {selectedBarber && selectedDate && (
          <div style={styles.timeSlotContainer}>
            <h2>Select a Time Slot</h2>
            <div style={styles.timeSlots}>
              {timeSlots.map((time, index) => {
                const isUnavailable = getUnavailableTimeSlots().includes(time);
                return (
                  <button
                    key={index}
                    style={{
                      ...styles.timeSlotButton,
                      ...(selectedTime === time && styles.selectedTimeSlotButton),
                      ...(isUnavailable && styles.unavailableTimeSlotButton), // Style for unavailable slots
                    }}
                    onClick={() => !isUnavailable && setSelectedTime(time)}
                    disabled={isUnavailable} // Disable unavailable slots
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {selectedBarber && selectedDate && (<form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 6789" pattern="[0-9]{10}|[0-9]{11}"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Book Appointment
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  logoContainer: {
    cursor: 'pointer', // Make the logo clickable
    marginBottom: '20px', // Space below the logo
  },
  logo: {
    width: '150px', // Adjust the size of the logo
    height: 'auto', // Maintain aspect ratio
  },
  bookingForm: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  calendarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  timeSlotContainer: {
    marginTop: '20px',
  },
  timeSlots: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '10px',
  },
  timeSlotButton: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  selectedTimeSlotButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
  },
  unavailableTimeSlotButton: {
    backgroundColor: '#ccc', // Gray for unavailable slots
    color: '#888',
    cursor: 'not-allowed',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', /* Space between form elements */
    marginTop: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box', /* Include padding and border in width */
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default CustomerBooking;