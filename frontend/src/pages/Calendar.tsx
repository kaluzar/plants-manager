/**
 * Calendar page for viewing scheduled activities
 */

import { useState } from 'react';
import { startOfMonth, endOfMonth, addMonths, subMonths, format } from 'date-fns';
import { useCalendarEvents } from '@/hooks/useDashboard';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  const { data: events = [], isLoading } = useCalendarEvents(startDate, endDate);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading events...</p>
      ) : (
        <CalendarView events={events} currentDate={currentDate} />
      )}
    </div>
  );
}
