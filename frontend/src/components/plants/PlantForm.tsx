/**
 * Plant form component for creating and editing plants
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocations } from '@/hooks/useLocations';
import type { Plant, PlantCreate, PlantUpdate } from '@/types/plant';

interface PlantFormProps {
  plant?: Plant;
  onSubmit: (data: PlantCreate | PlantUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PlantForm({ plant, onSubmit, onCancel, isLoading }: PlantFormProps) {
  const { data: locations } = useLocations();

  const [formData, setFormData] = useState({
    name: plant?.name || '',
    scientific_name: plant?.scientific_name || '',
    type: plant?.type || 'indoor',
    category: plant?.category || 'flower',
    species: plant?.species || '',
    location_id: plant?.location_id || 'none',
    acquisition_date: plant?.acquisition_date || '',
    notes: plant?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      scientific_name: formData.scientific_name || null,
      type: formData.type as 'indoor' | 'outdoor',
      category: formData.category as 'flower' | 'tree' | 'grass' | 'other',
      species: formData.species || null,
      location_id: formData.location_id === 'none' || !formData.location_id ? null : formData.location_id,
      acquisition_date: formData.acquisition_date || null,
      notes: formData.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Rose Bush, Tomato Plant"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scientific_name">Scientific Name</Label>
          <Input
            id="scientific_name"
            value={formData.scientific_name}
            onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
            placeholder="e.g., Rosa rugosa"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flower">Flower</SelectItem>
              <SelectItem value="tree">Tree</SelectItem>
              <SelectItem value="grass">Grass</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            placeholder="e.g., Hybrid Tea Rose"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_id">Location</Label>
          <Select
            value={formData.location_id}
            onValueChange={(value) => setFormData({ ...formData, location_id: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="location_id">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No location</SelectItem>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} ({location.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="acquisition_date">Acquisition Date</Label>
        <Input
          id="acquisition_date"
          type="date"
          value={formData.acquisition_date}
          onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this plant..."
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : plant ? 'Update Plant' : 'Create Plant'}
        </Button>
      </div>
    </form>
  );
}
