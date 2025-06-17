
import React, { useState, useEffect } from 'react';
import ListingCard from '../components/Listings/ListingCard';
import SearchFilters from '../components/Listings/SearchFilters';
import { Listing, ListingFilters } from '../types';
import { apiCall } from '../utils/api';
import { useToast } from '@/hooks/use-toast';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (filters: ListingFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());

      const data = await apiCall(`/listings?${queryParams.toString()}`);
      console.log('Fetched listings:', data);
      setListings(data.data);
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

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Find your perfect
          <span className="text-blue-600 block">getaway</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover unique places to stay around the world, from cozy apartments to luxury villas.
        </p>
      </div>

      <SearchFilters onFiltersChange={fetchListings} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria to find more results.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
