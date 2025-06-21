
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Listing } from '../types';
import { apiCall } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

const HostListingsPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/listings`);
      // Filter to only show user's listings
      console.log('Fetched listings:', data);
      console.log('Current user:', user);
      const userListings = data.data.filter((listing: Listing) => String(listing.host?.id) === String(user?.id));
      setListings(userListings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await apiCall(`/listings/${id}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Listing deleted",
        description: "Your listing has been deleted successfully.",
      });
      
      fetchListings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your property listings
          </p>
        </div>
        <Link to="/host/listings/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Listing</span>
          </Button>
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={listing.images[0] || '/placeholder.svg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">
                    {listing.title}
                  </CardTitle>
                  <Badge variant={listing.isActive ? 'default' : 'secondary'}>
                    {listing.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${listing.price}</span>
                  <span className="text-gray-500">/ night</span>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/listings/${listing.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/host/listings/${listing.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No listings yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first listing to start hosting guests.
          </p>
          <Link to="/host/listings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HostListingsPage;
