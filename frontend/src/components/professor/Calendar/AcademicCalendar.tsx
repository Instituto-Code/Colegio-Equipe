import { Events } from "@/components/CalendarData/CalendarData"
import { EventsData } from "@/components/CalendarData/EventsData"

export const CalendarAcademic = () => {
    return(
        <div className="flex justify-center items-center flex-col py-15">
            <EventsData />
            <Events />
        </div>
    )
}