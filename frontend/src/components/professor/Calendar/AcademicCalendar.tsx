import { Events } from "@/components/CalendarData/CalendarData"
import { EventsData } from "@/components/CalendarData/EventsData"

export const CalendarAcademic = () => {
    return(
        <div className="flex justify-center items-center flex-col">
            <EventsData />
            <Events />
        </div>
    )
}