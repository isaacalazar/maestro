import { Calendar, Video, Users, Clock } from "lucide-react";

// Sample data
const events = [
  {
    id: 1,
    title: "Google Technical Interview",
    date: "2025-04-15T14:00:00",
    type: "interview",
  },
  {
    id: 2,
    title: "Microsoft Info Session",
    date: "2025-04-10T11:00:00",
    type: "event",
  },
  {
    id: 3,
    title: "Amazon Assessment Deadline",
    date: "2025-04-05T23:59:00",
    type: "deadline",
  },
];

export function UpcomingEvents() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "interview":
        return <Video className="h-4 w-4 text-[#9333EA]" />;
      case "event":
        return <Users className="h-4 w-4 text-blue-400" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-amber-400" />;
      default:
        return <Calendar className="h-4 w-4 text-[#a3a3a3]" />;
    }
  };

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-[#a3a3a3]">No upcoming events</p>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="flex items-start p-3 rounded-md hover:bg-[#333333] transition-colors"
          >
            <div className="h-7 w-7 rounded-md bg-[#333333] flex items-center justify-center mr-3 flex-shrink-0">
              {getEventIcon(event.type)}
            </div>
            <div>
              <h4 className="font-medium text-sm">{event.title}</h4>
              <p className="text-xs text-[#a3a3a3] mt-1">
                {formatDate(event.date)}
              </p>
            </div>
          </div>
        ))
      )}

      <button className="w-full py-2 mt-4 text-sm text-[#9333EA] hover:text-[#7e22ce] transition-colors border border-[#333333] rounded-md hover:bg-[#333333]">
        Add Event
      </button>
    </div>
  );
}
