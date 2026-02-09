/**
 * Form for creating/editing treatments
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
import type { IssueType, TreatmentType, TreatmentStatus } from '@/types/treatment';

export interface TreatmentFormData {
  issue_type: IssueType;
  issue_name: string;
  treatment_type: TreatmentType;
  product_name?: string;
  start_date: string;
  end_date?: string;
  status: TreatmentStatus;
  notes?: string;
}

interface TreatmentFormProps {
  initialData?: Partial<TreatmentFormData>;
  onSubmit: (data: TreatmentFormData) => void;
  onCancel: () => void;
}

export function TreatmentForm({ initialData, onSubmit, onCancel }: TreatmentFormProps) {
  const [formData, setFormData] = useState<TreatmentFormData>({
    issue_type: initialData?.issue_type || 'pest',
    issue_name: initialData?.issue_name || '',
    treatment_type: initialData?.treatment_type || 'chemical',
    product_name: initialData?.product_name || '',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || '',
    status: initialData?.status || 'active',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up optional fields
    const cleanData: TreatmentFormData = {
      ...formData,
      product_name: formData.product_name?.trim() || undefined,
      end_date: formData.end_date?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Issue Type */}
      <div className="space-y-2">
        <Label htmlFor="issue_type">Issue Type *</Label>
        <Select
          value={formData.issue_type}
          onValueChange={(value) =>
            setFormData({ ...formData, issue_type: value as IssueType })
          }
        >
          <SelectTrigger id="issue_type">
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pest">Pest</SelectItem>
            <SelectItem value="disease">Disease</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Issue Name */}
      <div className="space-y-2">
        <Label htmlFor="issue_name">Issue Name *</Label>
        <Input
          id="issue_name"
          type="text"
          value={formData.issue_name}
          onChange={(e) => setFormData({ ...formData, issue_name: e.target.value })}
          placeholder="e.g., Aphids, Root Rot"
          required
        />
      </div>

      {/* Treatment Type */}
      <div className="space-y-2">
        <Label htmlFor="treatment_type">Treatment Type *</Label>
        <Select
          value={formData.treatment_type}
          onValueChange={(value) =>
            setFormData({ ...formData, treatment_type: value as TreatmentType })
          }
        >
          <SelectTrigger id="treatment_type">
            <SelectValue placeholder="Select treatment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chemical">Chemical</SelectItem>
            <SelectItem value="organic">Organic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="biological">Biological</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="product_name">Product Name</Label>
        <Input
          id="product_name"
          type="text"
          value={formData.product_name}
          onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
          placeholder="e.g., Neem Oil, Copper Fungicide"
        />
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date *</Label>
        <Input
          id="start_date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          required
        />
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as TreatmentStatus })
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
          placeholder="Treatment details, observations, etc."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Treatment' : 'Create Treatment'}
        </Button>
      </div>
    </form>
  );
}
