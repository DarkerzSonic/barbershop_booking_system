import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/barber-login/', {"username": username, "password": password})
    .then((response) => {
      alert('Login Success!\nGreat to see you back, ' + response.data.name + '!');
      navigate('/barberBooking', {
        state: {
            barber_id: response.data.barber_id,
            name: response.data.name,
            email: response.data.email,
        },
      });
    })
    .catch((error) => {
      console.error(`Could not log in barber: ${error}`);
      alert('Invalid login credentials!');
    });
    
    // navigate('/barberBooking');
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Redirect to the registration page
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

      <h2>Barber Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.registerText}>
        <span style={styles.registerLink} onClick={handleRegisterClick}>
          Register as New Barber
        </span>
      </p>
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
  },
  logoContainer: {
    cursor: 'pointer', // Make the logo clickable
    marginBottom: '20px', // Space below the logo
  },
  logo: {
    width: '150px', // Adjust the size of the logo
    height: 'auto', // Maintain aspect ratio
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  registerLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;