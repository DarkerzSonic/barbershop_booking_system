from django.urls import path
from .views import BarberListCreateView, BarberDetailView, BookingListCreateView, BookingDetailView
from .views import barber_login, barber_register, book_barber_slot, barber_cancel_booking

urlpatterns = [
    path('barbers/', BarberListCreateView.as_view(), name='barber-list-create'),
    path('barbers/<int:pk>/', BarberDetailView.as_view(), name='barber-detail'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:barber_id>/', BookingDetailView.as_view(), name='booking-detail'),
    path('barber-login/', barber_login, name='barber_login'),
    path('barber-register/', barber_register, name='barber_register'),
    path('book-barber-slot/', book_barber_slot, name='book_barber_slot'),
    path('barber-cancel-booking/', barber_cancel_booking, name='barber_cancel_booking'),
]