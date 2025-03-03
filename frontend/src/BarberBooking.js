import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axios from 'axios';

const BarberBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking details
  const [bookings, setBookings] = useState({}); // barber's booked slots

  // get barber_id & details after Login page
  const location = useLocation();
  const { barber_id, name, email } = location.state || {};

  // const [name, setName] = useState('');
  // const [phone, setPhone] = useState('');
  // const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Get logged on barber schedule list
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/bookings/' + barber_id)
    .then((response) => {
      const bookings = {};

      response.data.forEach((booking) => {
          const barberId = booking.barber.toString(); // Convert barber ID to string
          const bookingDatetime = new Date(booking.booking_datetime); // Parse the datetime
          const dateKey = bookingDatetime.toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
          const timeKey = bookingDatetime.toISOString().split("T")[1].slice(0, 5); // Extract time (HH:MM)
      
          // Initialize the date's entry if it doesn't exist
          if (!bookings[dateKey]) {
            bookings[dateKey] = {};
          }

          // Initialize the date's entry if it doesn't exist
          if (!bookings[dateKey][timeKey]) {
            bookings[dateKey][timeKey] = {'name': booking.customer_name, 'phone': booking.contact_no, 'email': booking.email};
          }
      
          setBookings(bookings);
        });
      }
    )
    .catch(error => {
      console.error(`Could not get selected barber: ${error}`);
    })
  }, [barber_id]);

  // Define time slots from 10 AM to 7 PM
  const timeSlots = [];
  for (let hour = 10; hour <= 19; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  // Simulated bookings data (replace with actual data from backend)
  // const bookings = {
  //   '2025-03-01': {
  //     '10:00': { name: 'Alice', phone: '123-456-7890', email: 'alice@example.com' },
  //     '14:00': { name: 'Bob', phone: '987-654-3210', email: 'bob@example.com' },
  //   },
  // };

  const handleTimeSlotClick = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const booking = bookings[dateKey]?.[time] || null;
      setSelectedBooking(booking);
    }
  };

  const handleCancelAppointment = () => {
    if (selectedDate && selectedTime) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      // Simulate canceling the appointment (replace with actual API call)
      console.log('Appointment canceled for:', dateKey, selectedTime);
      setSelectedBooking(null); // Clear the selected booking
      alert('Appointment canceled successfully!');
    }
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  const handleDateSelect = (date) => {
    // Set the selected date & reset time slot and booking details selection
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedBooking(null);
  };

  // Extract the unique dates and convert them to Date objects
  const bookedDates = Object.keys(bookings).map((dateString) => new Date(dateString));

  const isDateAllowed = (date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
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

      
      <h1>My Booking Schedules</h1>
      <h2>Barber: {name}</h2>
      <div style={styles.bookingForm}>
        <h2>Select a Date</h2>
        <div style={styles.calendarContainer}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            fromDate={new Date()}
            disabled={(day) => !isDateAllowed(day)}
            modifiers={{
              allowed: (day) => isDateAllowed(day), // Add a modifier for allowed dates
            }}
            modifiersStyles={{
              allowed: { backgroundColor: '#90EE90', color: '#000' }, // Highlight allowed dates
            }}
          />
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div style={styles.timeSlotContainer}>
            <h2>Schedules</h2>
            <div style={styles.timeSlots}>
              {timeSlots.map((time, index) => {
                const dateKey = format(selectedDate, 'yyyy-MM-dd');
                const isBooked = bookings[dateKey]?.[time]; // Check if the slot is booked
                return (
                  <button
                    key={index}
                    style={{
                      ...styles.timeSlotButton,
                      ...(selectedTime === time && styles.selectedTimeSlotButton),
                      // ...(isBooked && styles.bookedTimeSlotButton), // Style for booked slots
                    }}
                    onClick={() => handleTimeSlotClick(time)}
                    disabled={!isBooked} // Disable unbooked slots
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dialog Box for Selected Booking */}
        {selectedBooking && (
          <div style={styles.dialogBox}>
            <h3>Booking Details</h3>
            <p>
              <strong>Name:</strong> {selectedBooking.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Contact:</strong> {selectedBooking.phone}
            </p>
            <button
              style={styles.cancelButton}
              onClick={handleCancelAppointment}
            >
              Cancel Appointment
            </button>
          </div>
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
  bookedTimeSlotButton: {
    // backgroundColor: '#ffc107', // Yellow for booked slots
    // color: '#000', // Black text for better contrast on yellow
    // border: '1px solid #ffc107', // Yellow border
  },
  dialogBox: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
  cancelButton: {
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
};

export default BarberBooking;