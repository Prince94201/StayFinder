
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/Bookings/BookingCard';
import { Booking } from '../types';
import { apiCall } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const endpoint = user.role === 'host' ? '/bookings/host' : '/bookings/user';
      const data = await apiCall(endpoint);
      setBookings(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user?.role === 'host' ? 'Guest Bookings' : 'My Bookings'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'host' 
            ? 'Manage bookings for your properties' 
            : 'View and manage your travel bookings'
          }
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole={user?.role || 'guest'}
              onBookingUpdate={fetchBookings}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'host'
              ? "You don't have any guest bookings yet."
              : "You haven't made any bookings yet. Start exploring!"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
