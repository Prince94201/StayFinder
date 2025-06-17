
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Star, Users, Wifi, Car, Coffee } from 'lucide-react';
import { Listing } from '../../types';
import { apiCall } from '../../utils/api';
import { useToast } from '@/hooks/use-toast';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await apiCall(`/listings/${id}`);
      setListing(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load listing details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const totalPrice = calculateTotalPrice();
      await apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          listingId: listing?.id,
          checkIn,
          checkOut,
          totalPrice,
        }),
      });

      toast({
        title: "Booking confirmed!",
        description: "Your booking has been submitted successfully.",
      });
      navigate('/bookings');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!listing || !checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)
    );
    return nights * listing.price;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'kitchen':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Listing not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The listing you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Go back home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={listing.images[0] || '/placeholder.svg'}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {listing.title}
          </h1>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{listing.location}</span>
          </div>

          <div className="flex items-center mb-6">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold">4.8</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">(124 reviews)</span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {listing.description}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  {getAmenityIcon(amenity)}
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${listing.price}
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              / night
            </span>
          </div>
        </div>
      </div>

      {user?.role === 'guest' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Book this stay</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {checkIn && checkOut && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <span>Total price:</span>
                  <span className="font-semibold">${calculateTotalPrice()}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={bookingLoading || !checkIn || !checkOut}
              className="w-full"
            >
              {bookingLoading ? 'Processing...' : 'Book Now'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ListingDetails;
