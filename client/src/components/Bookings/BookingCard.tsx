
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Booking } from '../../types';
import { apiCall } from '../../utils/api';
import { useToast } from '@/hooks/use-toast';

interface BookingCardProps {
  booking: Booking;
  userRole: 'guest' | 'host';
  onBookingUpdate: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, userRole, onBookingUpdate }) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      console.log(booking)
      await apiCall(`/bookings/${booking.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      
      toast({
        title: "Booking updated",
        description: `Booking has been ${newStatus}`,
      });
      
      onBookingUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const canConfirm = userRole === 'host' && booking.status === 'pending';
  const canCancel = booking.status !== 'cancelled';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{booking.listing?.title}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{booking.listing?.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <DollarSign className="h-4 w-4 mr-2" />
          <span className="font-semibold">${booking.totalPrice}</span>
        </div>

        {userRole === 'host' && booking.guest && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Guest: {booking.guest.name}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          {canConfirm && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate('confirmed')}
              className="flex-1"
            >
              Confirm
            </Button>
          )}
          {canCancel && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate('cancelled')}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
