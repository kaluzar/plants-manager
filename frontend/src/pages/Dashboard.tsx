/**
 * Dashboard page
 */

import { useOverviewStats, useDueTasks, useActiveTreatments } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TaskList } from '@/components/dashboard/TaskList';
import { ActiveTreatments } from '@/components/dashboard/ActiveTreatments';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: tasks, isLoading: tasksLoading } = useDueTasks();
  const { data: treatments, isLoading: treatmentsLoading } = useActiveTreatments();

  if (statsLoading || tasksLoading || treatmentsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats skeletons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tasks and treatments skeletons */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Overview Stats */}
      {stats && (
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>
      )}

      {/* Tasks and Treatments */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Due Tasks */}
        {tasks && (
          <div>
            <TaskList tasks={tasks} />
          </div>
        )}

        {/* Active Treatments */}
        {treatments && (
          <div>
            <ActiveTreatments treatments={treatments} />
          </div>
        )}
      </div>
    </div>
  );
}
