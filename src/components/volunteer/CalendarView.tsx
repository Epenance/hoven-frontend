import type {Event} from "@/components/volunteer/types.ts";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import type {EventContentArg} from "@fullcalendar/core";

interface CalendarViewViewProps {
    onListViewClick: () => void;
    events?: Event[];
}

function renderEventContent(eventInfo: EventContentArg) {
    return(
        <>
            <i className={`w-full whitespace-normal`}>{eventInfo.event.title}</i>
        </>
    )
}

export const CalendarView = ({onListViewClick, events = []}: CalendarViewViewProps) => {
    const customButtons = {
        listView: {
            text: 'Liste',
            click: function() {
                onListViewClick()
            }
        }
    }

    const headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'listView,dayGridWeek,dayGridMonth'
    }

    const buttonTexts = {
        today:    'I dag',
        month:    'Måned',
        week:     'Uge',
        day:      'Dag',
        year:      'År',
        list:     'Liste'
    }

    return (
        <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            customButtons={customButtons}
            events={events}
            headerToolbar={headerToolbar}
            buttonText={buttonTexts}
            eventContent={renderEventContent}
        />
    )
}