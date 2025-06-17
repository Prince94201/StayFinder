
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="aspect-video overflow-hidden">
          <img
            src={listing.images[0] || '/placeholder.svg'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{listing.location}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {listing.amenities.slice(0, 2).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {listing.amenities.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{listing.amenities.length - 2} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-2xl font-bold">${listing.price}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">/ night</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ListingCard;
