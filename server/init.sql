-- Create Barber table
CREATE TABLE barber (
    barber_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact_no VARCHAR(15) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create Booking table
CREATE TABLE booking (
    booking_id SERIAL,
    barber_id INT REFERENCES barber(barber_id),
    booking_datetime TIMESTAMP NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (barber_id, booking_datetime)
);

-- Insert test data
INSERT INTO barber (name, email, contact_no, username, password) VALUES ('Ali Pay', 'darkerzsonic@hotmail.com', '012-3456789', 'alipay', 'alipay');

INSERT INTO booking (barber_id, booking_datetime, customer_name, contact_no, email)
VALUES (1, '2025-03-05 10:00:00', 'Alice', '123-456-7890', 'darkerzsonic@icloud.com');

INSERT INTO booking (barber_id, booking_datetime, customer_name, contact_no, email)
VALUES (1, '2025-03-05 11:00:00', 'Bob', '987-654-3210', 'bob@gmail.com');
