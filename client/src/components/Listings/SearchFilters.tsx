
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { ListingFilters } from '../../types';

interface SearchFiltersProps {
  onFiltersChange: (filters: ListingFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<ListingFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  const handleClear = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where to?"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="$0"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minPrice: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="$1000"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxPrice: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button type="submit" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
