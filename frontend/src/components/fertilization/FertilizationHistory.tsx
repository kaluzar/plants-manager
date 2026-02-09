import { format } from 'date-fns'
import { Sprout, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type {
  FertilizationLog,
  FertilizationSchedule,
} from '@/types/fertilization'

interface FertilizationHistoryProps {
  logs: FertilizationLog[]
  schedules: FertilizationSchedule[]
}

export function FertilizationHistory({
  logs,
  schedules,
}: FertilizationHistoryProps) {
  return (
    <div className="space-y-4">
      {/* Active Schedules */}
      {schedules.filter((s) => s.is_active).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Active Schedules
          </h4>
          {schedules
            .filter((s) => s.is_active)
            .map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Every {schedule.frequency_days} day
                        {schedule.frequency_days > 1 ? 's' : ''}
                      </p>
                      {schedule.fertilizer_type && (
                        <p className="text-sm text-muted-foreground">
                          Type: {schedule.fertilizer_type}
                        </p>
                      )}
                      {schedule.amount && (
                        <p className="text-sm text-muted-foreground">
                          Amount: {schedule.amount}
                        </p>
                      )}
                      {schedule.notes && (
                        <p className="text-sm text-muted-foreground">
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Fertilization Logs */}
      {logs.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Sprout className="h-4 w-4" />
            Fertilization History
          </h4>
          <div className="space-y-2">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {format(new Date(log.fertilized_at), 'PPp')}
                      </p>
                      {log.fertilizer_type && (
                        <p className="text-sm text-muted-foreground">
                          Type: {log.fertilizer_type}
                        </p>
                      )}
                      {log.amount && (
                        <p className="text-sm text-muted-foreground">
                          Amount: {log.amount}
                        </p>
                      )}
                      {log.notes && (
                        <p className="text-sm text-muted-foreground">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && schedules.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Sprout className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No fertilization records yet</p>
        </div>
      )}
    </div>
  )
}
