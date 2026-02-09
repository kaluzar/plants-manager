import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FertilizationSchedule } from '@/types/fertilization'

interface FertilizationScheduleFormProps {
  schedule?: FertilizationSchedule
  onSubmit: (data: {
    frequency_days: number
    fertilizer_type?: string
    amount?: string
    start_date: string
    end_date?: string
    is_active: boolean
    notes?: string
  }) => void
  onCancel: () => void
}

export function FertilizationScheduleForm({
  schedule,
  onSubmit,
  onCancel,
}: FertilizationScheduleFormProps) {
  const [formData, setFormData] = useState({
    frequency_days: schedule?.frequency_days?.toString() || '14',
    fertilizer_type: schedule?.fertilizer_type || '',
    amount: schedule?.amount || '',
    start_date: schedule?.start_date || new Date().toISOString().split('T')[0],
    end_date: schedule?.end_date || '',
    is_active: schedule?.is_active !== undefined ? schedule.is_active : true,
    notes: schedule?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      frequency_days: parseInt(formData.frequency_days, 10),
      fertilizer_type: formData.fertilizer_type || undefined,
      amount: formData.amount || undefined,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      is_active: formData.is_active,
      notes: formData.notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frequency_days">Frequency (days) *</Label>
        <Input
          id="frequency_days"
          type="number"
          min="1"
          value={formData.frequency_days}
          onChange={(e) =>
            setFormData({ ...formData, frequency_days: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fertilizer_type">Fertilizer Type</Label>
        <Input
          id="fertilizer_type"
          placeholder="e.g., NPK 10-10-10, Organic compost"
          value={formData.fertilizer_type}
          onChange={(e) =>
            setFormData({ ...formData, fertilizer_type: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          placeholder="e.g., 1 tablespoon, 100ml"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date *</Label>
        <Input
          id="start_date"
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date">End Date (optional)</Label>
        <Input
          id="end_date"
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="is_active">Active</Label>
        <Select
          value={formData.is_active ? 'true' : 'false'}
          onValueChange={(value) =>
            setFormData({ ...formData, is_active: value === 'true' })
          }
        >
          <SelectTrigger id="is_active">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{schedule ? 'Update' : 'Create'} Schedule</Button>
      </div>
    </form>
  )
}
