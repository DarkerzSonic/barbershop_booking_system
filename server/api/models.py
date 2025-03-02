from django.db import models

class Barber(models.Model):
    barber_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    contact_no = models.CharField(max_length=15)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    class Meta:
        managed = False  # Tell Django not to manage this table
        db_table = 'barber'  # Map to the existing table name

    def __str__(self):
        return self.name

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    barber = models.ForeignKey(Barber, on_delete=models.CASCADE, related_name='bookings')
    booking_datetime = models.DateTimeField()
    customer_name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)

    class Meta:
        managed = False
        db_table = 'booking' 
        constraints = [
            models.UniqueConstraint(
                fields=['barber', 'booking_datetime'],
                name='unique_booking_per_barber'
            )
        ]

    def __str__(self):
        return f"Booking {self.booking_id} for {self.customer_name}"