/**
 * TaskList component for displaying due tasks
 */

import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplet, Sprout } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { DueTasks } from '@/types/dashboard';

interface TaskListProps {
  tasks: DueTasks;
}

export function TaskList({ tasks }: TaskListProps) {
  const totalTasks = tasks.due_watering.length + tasks.due_fertilization.length;

  if (totalTasks === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Due Tasks</h2>
        <p className="text-muted-foreground text-center py-8">
          No tasks due today. Great job! 🎉
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Due Tasks</h2>
        <Badge variant="default">{totalTasks} tasks</Badge>
      </div>

      <div className="space-y-4">
        {/* Watering Tasks */}
        {tasks.due_watering.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              Watering ({tasks.due_watering.length})
            </h3>
            <div className="space-y-2">
              {tasks.due_watering.map((task) => (
                <Link key={task.id} to={`/plants/${task.plant_id}`}>
                  <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Plant {task.plant_id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(parseISO(task.next_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline">Every {task.frequency_days}d</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fertilization Tasks */}
        {tasks.due_fertilization.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-500" />
              Fertilization ({tasks.due_fertilization.length})
            </h3>
            <div className="space-y-2">
              {tasks.due_fertilization.map((task) => (
                <Link key={task.id} to={`/plants/${task.plant_id}`}>
                  <Card className="p-3 hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Plant {task.plant_id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(parseISO(task.next_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline">Every {task.frequency_days}d</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
