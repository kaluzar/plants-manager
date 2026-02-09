import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface FertilizationLogFormProps {
  onSubmit: (data: {
    fertilized_at: string
    fertilizer_type?: string
    amount?: string
    notes?: string
  }) => void
  onCancel: () => void
}

export function FertilizationLogForm({
  onSubmit,
  onCancel,
}: FertilizationLogFormProps) {
  const now = new Date()
  const defaultDateTime = `${now.toISOString().slice(0, 16)}`

  const [formData, setFormData] = useState({
    fertilized_at: defaultDateTime,
    fertilizer_type: '',
    amount: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      fertilized_at: new Date(formData.fertilized_at).toISOString(),
      fertilizer_type: formData.fertilizer_type || undefined,
      amount: formData.amount || undefined,
      notes: formData.notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fertilized_at">Fertilized At *</Label>
        <Input
          id="fertilized_at"
          type="datetime-local"
          value={formData.fertilized_at}
          onChange={(e) =>
            setFormData({ ...formData, fertilized_at: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fertilizer_type">Fertilizer Type</Label>
        <Input
          id="fertilizer_type"
          placeholder="e.g., NPK 10-10-10"
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
        <Button type="submit">Log Fertilization</Button>
      </div>
    </form>
  )
}
