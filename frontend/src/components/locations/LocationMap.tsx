/**
 * LocationMap component - Display locations in a grid with plant status indicators
 */

import { useLocations } from '@/hooks/useLocations';
import { usePlantsByLocation } from '@/hooks/usePlants';
import { useDueTasks } from '@/hooks/useDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Droplet, Sprout, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LocationMap() {
  const { data: locations = [], isLoading: locationsLoading, error: locationsError } = useLocations();
  const { data: dueTasks } = useDueTasks();

  // Create maps of due tasks by plant ID
  const dueWateringPlants = new Set(
    dueTasks?.due_watering?.map((task) => task.plant_id) || []
  );
  const dueFertilizationPlants = new Set(
    dueTasks?.due_fertilization?.map((task) => task.plant_id) || []
  );

  if (locationsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 animate-pulse" />
          <p>Loading locations...</p>
        </div>
      </div>
    );
  }

  if (locationsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {locationsError instanceof Error ? locationsError.message : 'Failed to load locations'}
        </AlertDescription>
      </Alert>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium mb-1">No Locations Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create locations to organize your plants by where they are placed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          dueWateringPlants={dueWateringPlants}
          dueFertilizationPlants={dueFertilizationPlants}
        />
      ))}
    </div>
  );
}

interface LocationCardProps {
  location: any;
  dueWateringPlants: Set<string>;
  dueFertilizationPlants: Set<string>;
}

function LocationCard({ location, dueWateringPlants, dueFertilizationPlants }: LocationCardProps) {
  const { data: plants = [], isLoading } = usePlantsByLocation(location.id);

  // Count plants with status
  const needsWatering = plants.filter((plant) => dueWateringPlants.has(plant.id)).length;
  const needsFertilization = plants.filter((plant) => dueFertilizationPlants.has(plant.id)).length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {location.name}
            </CardTitle>
            {location.type && (
              <CardDescription className="mt-1 capitalize">{location.type}</CardDescription>
            )}
          </div>
          <Badge variant="secondary">{plants.length} plants</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading plants...</p>
        ) : plants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plants in this location</p>
        ) : (
          <div className="space-y-3">
            {/* Status summary */}
            {(needsWatering > 0 || needsFertilization > 0) && (
              <div className="flex flex-wrap gap-2 pb-2 border-b">
                {needsWatering > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Droplet className="h-3 w-3 mr-1" />
                    {needsWatering} need water
                  </Badge>
                )}
                {needsFertilization > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Sprout className="h-3 w-3 mr-1" />
                    {needsFertilization} need fertilizer
                  </Badge>
                )}
              </div>
            )}

            {/* Plant list */}
            <div className="space-y-1">
              {plants.slice(0, 5).map((plant) => {
                const needsWater = dueWateringPlants.has(plant.id);
                const needsFert = dueFertilizationPlants.has(plant.id);

                return (
                  <Link
                    key={plant.id}
                    to={`/plants/${plant.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Leaf className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{plant.name}</span>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {needsWater && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" title="Needs watering" />
                      )}
                      {needsFert && (
                        <div className="w-2 h-2 rounded-full bg-green-500" title="Needs fertilization" />
                      )}
                      {!needsWater && !needsFert && (
                        <div className="w-2 h-2 rounded-full bg-gray-200" title="All good" />
                      )}
                    </div>
                  </Link>
                );
              })}
              {plants.length > 5 && (
                <p className="text-xs text-muted-foreground pt-1">
                  +{plants.length - 5} more plants
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
