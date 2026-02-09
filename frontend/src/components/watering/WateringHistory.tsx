import { format } from 'date-fns'
import { Droplet, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WateringLog, WateringSchedule } from '@/types/watering'

interface WateringHistoryProps {
  logs: WateringLog[]
  schedules: WateringSchedule[]
}

export function WateringHistory({ logs, schedules }: WateringHistoryProps) {
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
                      {schedule.amount && (
                        <p className="text-sm text-muted-foreground">
                          Amount: {schedule.amount}
                        </p>
                      )}
                      {schedule.time_of_day && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {schedule.time_of_day}
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

      {/* Watering Logs */}
      {logs.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            Watering History
          </h4>
          <div className="space-y-2">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {format(new Date(log.watered_at), 'PPp')}
                      </p>
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
          <Droplet className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No watering records yet</p>
        </div>
      )}
    </div>
  )
}
