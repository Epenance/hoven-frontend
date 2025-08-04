import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import {useEffect, useState} from "react";
import {strapi} from "@strapi/client";
import type { EventContentArg } from '@fullcalendar/core'

const VOLUNTEER_API_KEY = import.meta.env.PUBLIC_VOLUNTEER_API_KEY;
const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;

export const strapiClient = strapi({
    baseURL: `${CMS_PATH}/api`,
    auth: VOLUNTEER_API_KEY
});

interface Event {
    title: string;
    start: string;
}

interface RawVolunteer {
    Name: string,
    Instructor?: boolean
    Email?: string
    Phone?: string
}

interface RawEvent {
    id: number,
    Date: string,
    volunteers: RawVolunteer[]
}



function renderEventContent(eventInfo: EventContentArg) {
    return(
        <>
            <i className={`w-full whitespace-normal`}>{eventInfo.event.title}</i>
        </>
    )
}


export default function VolunteerPortal() {
    const [listViewActive, setListViewActive] = useState<boolean>(false)
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        const collect = strapiClient.collection('shifts')

        const shifts = collect.find({
            populate: '*',
        }).then((response) => {
            const mappedEvents: Event[] = [];
            const {data} = response

            data.map((shift) => {
                console.log(shift)
                shift.volunteers.map((volunteer) => {
                    mappedEvents.push({
                        title: `Vagt: ${volunteer.Name} ${volunteer.Instructor ? '(Instruktør)' : ''}` ,
                        start: shift.Date
                    })
                })
            })
            console.log(data)

            setEvents(mappedEvents)
        })
    }, [])

    const customButtons = {
        listView: {
            text: 'Liste',
            click: function() {
                setListViewActive(!listViewActive)
            }
        }
    }



    const headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'listView,dayGridWeek,dayGridMonth,dayGridYear'
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
        <div>
            {!listViewActive ? (<FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                customButtons={customButtons}
                events={events}
                headerToolbar={headerToolbar}
                buttonText={buttonTexts}
                eventContent={renderEventContent}
            />) : (<ListView onBackToCalendar={() => setListViewActive(false)} />)}
        </div>

    )
}

interface ListViewProps {
    onBackToCalendar: () => void;
    events?: Event[];
}

const ListView = ({ onBackToCalendar, events }: ListViewProps) => {
    return (
        <div className="w-full">
            {/* Top bar with Kalender button */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Liste visning</h2>
                <button
                    onClick={onBackToCalendar}
                    className="px-4 py-2 cursor-pointer bg-jagt-200 text-white rounded-md hover:bg-jagt-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Kalender
                </button>
            </div>

            {/* Content area */}
            <div className="p-4">
                {/* Your list content will go here */}
            </div>
        </div>
    )
}