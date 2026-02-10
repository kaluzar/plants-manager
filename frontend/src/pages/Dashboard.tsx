/**
 * Dashboard page
 */

import { useOverviewStats, useDueTasks, useActiveTreatments } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TaskList } from '@/components/dashboard/TaskList';
import { ActiveTreatments } from '@/components/dashboard/ActiveTreatments';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  const { data: tasks, isLoading: tasksLoading } = useDueTasks();
  const { data: treatments, isLoading: treatmentsLoading } = useActiveTreatments();

  if (statsLoading || tasksLoading || treatmentsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground">Loading...</p>
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
