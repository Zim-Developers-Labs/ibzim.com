"use client"

import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from "lucide-react"
import { useState } from "react"

export default function IBCalendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    // Default to March 2025
    return {
      month: 2, // 0-indexed (0 = January, 2 = March)
      year: 2025,
    }
  })

  // Helper functions for date navigation
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month - 1
      if (newMonth < 0) {
        return { month: 11, year: prev.year - 1 }
      }
      return { ...prev, month: newMonth }
    })
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month + 1
      if (newMonth > 11) {
        return { month: 0, year: prev.year + 1 }
      }
      return { ...prev, month: newMonth }
    })
  }

  const goToToday = () => {
    // For this example, "today" is March 2025
    setCurrentDate({ month: 2, year: 2025 })
  }

  // Format the current month and year for display
  const formatCurrentMonth = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${monthNames[currentDate.month]} ${currentDate.year}`
  }

  // Calendar data structure
  const events = {
    "Feb 24": [
      { text: "Example Task", color: "bg-gray-300" },
      { text: "Example Task", color: "bg-gray-300" },
    ],
    "Feb 25": [{ text: "Example Task", color: "bg-red-400" }],
    "Mar 1": [{ text: "Example Task", color: "bg-red-400" }],
    "Mar 2": [{ text: "Example Task", color: "bg-red-400" }],
    "Mar 3": [{ text: "Example Task", color: "bg-gray-300" }],
    "Mar 4": [{ text: "Example Task", color: "bg-red-400" }],
    "Mar 5": [{ text: "Example Task", color: "bg-gray-300" }],
    "Mar 6": [{ text: "Example Task", color: "bg-gray-300" }],
    "Mar 7": [
      { text: "Example Task", color: "bg-red-400" },
      { text: "Example Task", color: "bg-gray-300" },
    ],
    "Mar 9": [{ text: "Example Task", color: "bg-blue-500" }],
    "Dec 1": [{ text: "Start Preparing Annual Report", color: "bg-red-400" }],
  }

  // Generate calendar grid
  const generateCalendarDays = () => {
    const days = []

    // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentDate.year, currentDate.month, 1).getDay()

    // Get last day of previous month
    const lastDayPrevMonth = new Date(currentDate.year, currentDate.month, 0).getDate()

    // Get last day of current month
    const lastDayCurrentMonth = new Date(currentDate.year, currentDate.month + 1, 0).getDate()

    // Previous month days to show
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonthDay = lastDayPrevMonth - i
      const prevMonth = currentDate.month - 1 < 0 ? 11 : currentDate.month - 1
      const prevMonthYear = prevMonth === 11 ? currentDate.year - 1 : currentDate.year
      const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][prevMonth]

      days.push({
        date: prevMonthDay,
        month: monthName,
        fullMonth: prevMonth,
        year: prevMonthYear,
      })
    }

    // Current month days
    const currentMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      currentDate.month
    ]
    for (let i = 1; i <= lastDayCurrentMonth; i++) {
      days.push({
        date: i,
        month: currentMonthName,
        fullMonth: currentDate.month,
        year: currentDate.year,
      })
    }

    // Next month days to fill the grid (up to 42 cells for 6 weeks)
    const remainingDays = 42 - days.length
    const nextMonth = currentDate.month + 1 > 11 ? 0 : currentDate.month + 1
    const nextMonthYear = nextMonth === 0 ? currentDate.year + 1 : currentDate.year
    const nextMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      nextMonth
    ]

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        month: nextMonthName,
        fullMonth: nextMonth,
        year: nextMonthYear,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="border border-gray-300 p-1 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h1 className="text-xl font-bold">{formatCurrentMonth()}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Plus size={20} />
            </button>

            <div className="relative">
              <button className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-300">
                Month
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="flex border border-gray-300 rounded-md">
              <button className="p-1.5 hover:bg-gray-200 rounded-l-md" onClick={goToPreviousMonth}>
                <ChevronUp size={16} />
              </button>
              <button className="px-3 py-1.5 border-l border-r border-gray-300 hover:bg-gray-200" onClick={goToToday}>
                Today
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded-r-md" onClick={goToNextMonth}>
                <ChevronDown size={16} />
              </button>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-200">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
          {/* Days of week header */}
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Sun</div>
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Mon</div>
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Tue</div>
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Wed</div>
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Thu</div>
          <div className="bg-gray-100 p-2 text-center border-r border-gray-200">Fri</div>
          <div className="bg-gray-100 p-2 text-center">Sat</div>

          {/* Calendar cells */}
          {calendarDays.map((day, index) => {
            const dayKey = `${day.month} ${day.date}`
            const isToday = day.month === "Mar" && day.date === 6 && day.year === 2025
            const isCurrentMonth = day.fullMonth === currentDate.month

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border-t border-r border-gray-200 ${index % 7 === 6 ? "border-r-0" : ""} ${!isCurrentMonth ? "bg-gray-50" : ""} relative`}
              >
                <div className="flex items-start">
                  <div
                    className={`flex items-center justify-center w-6 h-6 ${isToday ? "bg-blue-600 text-white rounded-full" : ""}`}
                  >
                    {day.date}
                  </div>
                  {day.fullMonth !== currentDate.month && (
                    <span className="text-xs text-gray-400 ml-1">{day.month}</span>
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  {/* @ts-expect-error -- type error */}
                  {events[dayKey]?.map((event, eventIndex) => (
                    <div key={eventIndex} className={`${event.color} text-gray-800 text-xs p-1 rounded truncate`}>
                      {event.text}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

