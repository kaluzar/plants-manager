/**
 * Form for logging treatment applications
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface TreatmentApplicationFormData {
  applied_at: string;
  amount?: string;
  notes?: string;
}

interface TreatmentApplicationFormProps {
  onSubmit: (data: TreatmentApplicationFormData) => void;
  onCancel: () => void;
}

export function TreatmentApplicationForm({
  onSubmit,
  onCancel,
}: TreatmentApplicationFormProps) {
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [formData, setFormData] = useState<TreatmentApplicationFormData>({
    applied_at: defaultDateTime,
    amount: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert local datetime to ISO string
    const appliedAtDate = new Date(formData.applied_at);
    const cleanData: TreatmentApplicationFormData = {
      applied_at: appliedAtDate.toISOString(),
      amount: formData.amount?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Applied At */}
      <div className="space-y-2">
        <Label htmlFor="applied_at">Application Date & Time *</Label>
        <Input
          id="applied_at"
          type="datetime-local"
          value={formData.applied_at}
          onChange={(e) => setFormData({ ...formData, applied_at: e.target.value })}
          required
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="text"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="e.g., 2 tablespoons, 100ml"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any observations or additional details..."
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Log Application</Button>
      </div>
    </form>
  );
}
