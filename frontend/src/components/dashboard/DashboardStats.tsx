/**
 * DashboardStats component for displaying overview statistics
 */

import { Card } from '@/components/ui/card';
import { Leaf, MapPin, Activity } from 'lucide-react';
import type { OverviewStats } from '@/types/dashboard';

interface DashboardStatsProps {
  stats: OverviewStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Plants */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Plants</p>
            <p className="text-3xl font-bold">{stats.total_plants}</p>
          </div>
          <Leaf className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      {/* Active Treatments */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Treatments</p>
            <p className="text-3xl font-bold">{stats.active_treatments}</p>
          </div>
          <Activity className="h-8 w-8 text-orange-500" />
        </div>
      </Card>

      {/* Plants by Type */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plant Types</p>
            <div className="space-y-1 mt-2">
              {Object.entries(stats.plants_by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize">{type}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Plants by Location */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Locations</p>
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <p className="text-2xl font-bold">
                {Object.keys(stats.plants_by_location).length}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
