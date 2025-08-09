'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  const isToday = (dayNumber: number) => {
    const today = new Date();
    return dayNumber === today.getDate() && 
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    for (let i = 0; i < rows * 7; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const dayOfWeek = i % 7;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      
      days.push(
        <div
          key={i}
          className={`h-24 border border-slate-200 p-2 transition-all hover:bg-slate-50 
            ${isCurrentMonth ? 'bg-white' : 'bg-slate-50/50'}
            ${isToday(dayNumber) && isCurrentMonth ? 'ring-2 ring-blue-500' : ''}
            ${isSunday && isCurrentMonth ? 'bg-red-50' : ''}
            ${isSaturday && isCurrentMonth ? 'bg-yellow-50' : ''}
          `}
        >
          <span className={`
            text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center
            ${isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}
            ${isToday(dayNumber) && isCurrentMonth ? 'bg-blue-500 text-white' : ''}
            ${isSunday && isCurrentMonth ? 'text-red-600' : ''}
            ${isSaturday && isCurrentMonth ? 'text-yellow-600' : ''}
          `}>
            {isCurrentMonth ? dayNumber : ''}
          </span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FiCalendar className="h-6 w-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Calendar
              </span>
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(-1)}
                className="hover:bg-blue-50"
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-blue-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(1)}
                className="hover:bg-blue-50"
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div 
                key={day} 
                className={`p-2 text-center font-semibold bg-slate-50
                  ${index === 0 ? 'text-red-600' : ''}
                  ${index === 6 ? 'text-yellow-600' : ''}
                `}
              >
                {day}
              </div>
            ))}
            {generateCalendarDays()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
