from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import generics
from .models import Barber, Booking
from .serializers import BarberSerializer, BookingSerializer
from datetime import datetime
from django.core.mail import send_mail
import textwrap

class BarberListCreateView(generics.ListCreateAPIView):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer

class BarberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

# class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
class BookingDetailView(generics.ListCreateAPIView):
    # queryset = Booking.objects.all()
    def get_queryset(self):
        # Get the barber_id from the URL
        barber_id = self.kwargs['barber_id']
        
        # Filter bookings by barber_id
        return Booking.objects.filter(barber_id=barber_id)
    serializer_class = BookingSerializer

# Create your views here.
# Login Barber POST Request
@csrf_exempt
def barber_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # Find whether the barber exists in registered barbers
            barber = Barber.objects.filter(username=username, password=password).first()

            if barber:
                return JsonResponse({
                    'message': 'Login successful',
                    'barber_id': barber.barber_id,
                    'name': barber.name,
                    'email': barber.email,
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Register Barber POST Request
@csrf_exempt
def barber_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            contact_no = data.get('contactNo')
            username = data.get('username')
            password = data.get('password')

            # Check if email or username already exists
            if Barber.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            if Barber.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            # Insert new barber into db
            barber = Barber.objects.create(
                name=name,
                email=email,
                contact_no=contact_no,
                username=username,
                password=password
            )

            return JsonResponse({
                'message': 'Barber registered successfully',
                'barber_id': barber.barber_id,
                'name': barber.name,
                'email': barber.email,
            }, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    # Return error for invalid request method
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Customer Book Barber Slot POST Request
@csrf_exempt
def book_barber_slot(request):
    
    if request.method == 'POST':
        try:
            # Parse the request body
            data = json.loads(request.body)
            barber_id = data.get('barber_id')
            booking_datetime = data.get('booking_datetime')
            customer_name = data.get('customer_name')
            contact_no = data.get('contactNo')
            email = data.get('email')
            print(data)

            # Validate the barber_id
            try:
                barber = Barber.objects.get(barber_id=barber_id)
            except Barber.DoesNotExist:
                return JsonResponse({'error': 'Barber not found'}, status=404)

            # Convert booking_datetime to PostgreSQL format
            try:
                booking_datetime = datetime.strptime(booking_datetime, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                return JsonResponse({'error': 'Invalid booking_datetime format. Use YYYY-MM-DD HH:MM:SS'}, status=400)
  
            # Check if the slot is already booked
            if Booking.objects.filter(barber_id=barber_id, booking_datetime=booking_datetime).exists():
                return JsonResponse({'error': 'Slot already booked'}, status=400)

            # Create a new booking
            booking = Booking.objects.create(
                barber=barber,
                booking_datetime=booking_datetime,
                customer_name=customer_name,
                contact_no=contact_no,
                email=email
            )

            # Send email to customer
            send_mail(
                subject='Ouch! Barbershop - Booking Information',  # Email subject
                message=textwrap.dedent(f"""
                Hi {customer_name},

                You have made an appointment with barber {barber.name} on {booking_datetime}.

                To reschedule your appointment, feel free contact your barber at {barber.contact_no} or {barber.email}.

                Thanks.

                Best Regards,
                Ouch! Barbershop
                """),  # Email body
                from_email='darkerzsonic@gmail.com',  # Sender email
                recipient_list=[email],  # List of recipient emails
                fail_silently=False,
            )

            # send email to barber
            send_mail(
                subject='Ouch! Barbershop - New Booking Information',  # Email subject
                message=textwrap.dedent(f"""
                Hi {barber.name},

                You have a new appointment with {customer_name} on {booking_datetime}.

                If you are unavailable on the specified time, please contact your customer at {contact_no} or {email} to reschedule the appointment.

                Thanks.

                Best Regards,
                Ouch! Barbershop
                """),  # Email body
                from_email='darkerzsonic@gmail.com',  # Sender email
                recipient_list=[barber.email],  # List of recipient emails
                fail_silently=False,
            )
            
            # Return success response
            return JsonResponse({
                'message': 'Slot booked & email sent successfully',
                'booking_id': booking.booking_id,
                'barber_id': booking.barber.barber_id,
                'booking_datetime': booking.booking_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                'customer_name': booking.customer_name,
                'contact_no': booking.contact_no,
                'email': booking.email,
            }, status=201)

        except Exception as e:
            # Handle any exceptions
            return JsonResponse({'error': str(e)}, status=400)

    # Return error for invalid request method
    return JsonResponse({'error': 'Invalid request method'}, status=405)

"""OPTIONAL: Barber Cancel Customer Booking POST Request"""
@csrf_exempt
def barber_cancel_booking(request):
    if request.method == 'POST':
        try:
            # Parse data from POST request
            data = json.loads(request.body)
            booking_id = data.get('booking_id')
            barber_id = data.get('barber_id')
            booking_datetime = data.get('booking_datetime')
            customer_name = data.get('customer_name')
            contact_no = data.get('contactNo')
            email = data.get('email')

            # get barber data
            barber = Barber.objects.filter(barber_id=barber_id).first()

            # update database to remove the booking
            Booking.objects.get(booking_id=booking_id).delete()

            # Send email to customer
            send_mail(
                subject='Ouch! Barbershop - Booking Cancelled Notice',  # Email subject
                message=textwrap.dedent(f"""
                Hi {customer_name},

                We are sorry to notify you that your barber {barber.name} has cancelled your booking appointment on {booking_datetime}.

                Feel free to book a new appointment or contact your barber at {barber.contact_no} or {barber.email}.

                Thanks.

                Best Regards,
                Ouch! Barbershop
                """),  # Email body
                from_email='darkerzsonic@gmail.com',  # Sender email
                recipient_list=[email],  # List of recipient emails
                fail_silently=False,
            )

            # send email to barber
            send_mail(
                subject='Ouch! Barbershop - Booking Cancelled Notice',  # Email subject
                message=textwrap.dedent(f"""
                Hi {barber.name},

                You have cancelled your booking appointment with {customer_name} on {booking_datetime}.

                Feel free to contact your customer at {contact_no} or {email} to reschedule the appointment.

                Thanks.

                Best Regards,
                Ouch! Barbershop
                """),  # Email body
                from_email='darkerzsonic@gmail.com',  # Sender email
                recipient_list=[barber.email],  # List of recipient emails
                fail_silently=False,
            )

            return JsonResponse({'status': 'success', 'message': 'Appointment cancelled & email sent successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

