import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
    axios.post('http://127.0.0.1:8000/api/barber-register/', {
      "name": name,
      "email": email,
      "contactNo": contactNo,
      "username": username,
      "password": password
    })
    .then((response) => {
        alert('Registration successful!\nRedirecting to the login page..');
        navigate('/login');
      }
    )
    .catch((error) => {
      console.log(`Failed to register barber: ${error}`);
      alert(`Failed to register barber: ${error}`);
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

      <h2>New Barber Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email">Contact Number:</label>
          <input
            type="tel"
            id="contactNo"
            placeholder="012 345 6789" pattern="[0-9]{10}|[0-9]{11}" required
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            style={styles.input}
          />
        </div>
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
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p style={styles.loginText}>
        Already a Registered Barber?{' '}
        <span style={styles.loginLink} onClick={() => navigate('/')}>
          Login here
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
  loginText: {
    marginTop: '15px',
    fontSize: '14px',
  },
  loginLink: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Register;