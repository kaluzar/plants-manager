/**
 * Form for creating/editing growth logs
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HealthStatus } from '@/types/growthLog';

export interface GrowthLogFormData {
  measured_at: string;
  height_cm?: number;
  width_cm?: number;
  health_status?: HealthStatus;
  notes?: string;
}

interface GrowthLogFormProps {
  initialData?: Partial<GrowthLogFormData>;
  onSubmit: (data: GrowthLogFormData) => void;
  onCancel: () => void;
}

export function GrowthLogForm({ initialData, onSubmit, onCancel }: GrowthLogFormProps) {
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [formData, setFormData] = useState<GrowthLogFormData>({
    measured_at: initialData?.measured_at || defaultDateTime,
    height_cm: initialData?.height_cm,
    width_cm: initialData?.width_cm,
    health_status: initialData?.health_status,
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const measuredAtDate = new Date(formData.measured_at);
    const cleanData: GrowthLogFormData = {
      measured_at: measuredAtDate.toISOString(),
      height_cm: formData.height_cm || undefined,
      width_cm: formData.width_cm || undefined,
      health_status: formData.health_status || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Measured At */}
      <div className="space-y-2">
        <Label htmlFor="measured_at">Date & Time *</Label>
        <Input
          id="measured_at"
          type="datetime-local"
          value={formData.measured_at}
          onChange={(e) => setFormData({ ...formData, measured_at: e.target.value })}
          required
        />
      </div>

      {/* Height */}
      <div className="space-y-2">
        <Label htmlFor="height_cm">Height (cm)</Label>
        <Input
          id="height_cm"
          type="number"
          step="0.1"
          min="0"
          value={formData.height_cm || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              height_cm: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          placeholder="e.g., 25.5"
        />
      </div>

      {/* Width */}
      <div className="space-y-2">
        <Label htmlFor="width_cm">Width (cm)</Label>
        <Input
          id="width_cm"
          type="number"
          step="0.1"
          min="0"
          value={formData.width_cm || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              width_cm: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          placeholder="e.g., 15.0"
        />
      </div>

      {/* Health Status */}
      <div className="space-y-2">
        <Label htmlFor="health_status">Health Status</Label>
        <Select
          value={formData.health_status || 'none'}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              health_status: value === 'none' ? undefined : (value as HealthStatus),
            })
          }
        >
          <SelectTrigger id="health_status">
            <SelectValue placeholder="Select health status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Not specified</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Growth observations, changes noticed, etc."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Growth Log' : 'Create Growth Log'}
        </Button>
      </div>
    </form>
  );
}
