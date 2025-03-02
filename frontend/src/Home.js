import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

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

      <h1>Welcome to Ouch! Barbershop</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => navigate('/customerBooking')}
        >
          Make an Appointment
        </button>
        <button
          style={styles.button}
          onClick={() => navigate('/login')}
        >
          Barber Login
        </button>
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
    height: '100vh',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
  logoContainer: {
    cursor: 'pointer', // Make the logo clickable
    marginBottom: '20px', // Space below the logo
  },
  logo: {
    width: '150px', // Adjust the size of the logo
    height: 'auto', // Maintain aspect ratio
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;