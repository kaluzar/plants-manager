import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface WateringLogFormProps {
  onSubmit: (data: {
    watered_at: string
    amount?: string
    notes?: string
  }) => void
  onCancel: () => void
}

export function WateringLogForm({ onSubmit, onCancel }: WateringLogFormProps) {
  const now = new Date()
  const defaultDateTime = `${now.toISOString().slice(0, 16)}`

  const [formData, setFormData] = useState({
    watered_at: defaultDateTime,
    amount: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      watered_at: new Date(formData.watered_at).toISOString(),
      amount: formData.amount || undefined,
      notes: formData.notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="watered_at">Watered At *</Label>
        <Input
          id="watered_at"
          type="datetime-local"
          value={formData.watered_at}
          onChange={(e) =>
            setFormData({ ...formData, watered_at: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          placeholder="e.g., 250ml, 1 cup"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
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
        <Button type="submit">Log Watering</Button>
      </div>
    </form>
  )
}
