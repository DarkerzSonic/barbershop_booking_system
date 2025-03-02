from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import generics
from .models import Barber, Booking
from .serializers import BarberSerializer, BookingSerializer
from datetime import datetime

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
            
            # Return success response
            return JsonResponse({
                'message': 'Slot booked successfully',
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
def barber_cancel_booking(request):
    if request.method == 'POST': # maybe use DELETE (?)
        pass

