import {useEffect, useState} from "react";
import {strapi} from "@strapi/client";
import {ListView} from "@/components/volunteer/ListView.tsx";
import type {Event, RawVolunteer} from "@/components/volunteer/types.ts";
import {CalendarView} from "@/components/volunteer/CalendarView.tsx";
import Login from "@/components/volunteer/Login.tsx";

const VOLUNTEER_API_KEY = import.meta.env.PUBLIC_VOLUNTEER_API_KEY;
const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;


export const strapiClient = strapi({
    baseURL: `${CMS_PATH}/api`,
    auth: VOLUNTEER_API_KEY
});


export default function VolunteerPortal() {
    const [listViewActive, setListViewActive] = useState<boolean>(false)
    const [events, setEvents] = useState<Event[]>([])
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    // Check for existing login session on component mount
    useEffect(() => {
        const checkLoginSession = () => {
            const loginData = localStorage.getItem('volunteer_login');
            if (loginData) {
                try {
                    const { timestamp } = JSON.parse(loginData);
                    const now = new Date().getTime();
                    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

                    // Check if the session is still valid (within 30 days)
                    if (now - timestamp < thirtyDaysInMs) {
                        setLoggedIn(true);
                    } else {
                        // Session expired, remove it
                        localStorage.removeItem('volunteer_login');
                    }
                } catch (error) {
                    // Invalid data in localStorage, remove it
                    localStorage.removeItem('volunteer_login');
                }
            }
        };

        checkLoginSession();
    }, []);

    useEffect(() => {
        // Only fetch shifts if logged in
        if (!loggedIn) return;

        const collect = strapiClient.collection('shifts')

        // Get January 1st of the current year
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).toISOString(); // January 1st of current year

        const fetchAllShifts = async () => {
            const allShifts: any[] = [];
            let page = 1;
            let hasMoreData = true;
            const pageSize = 100; // Increase page size for better performance

            while (hasMoreData) {
                try {
                    const response = await collect.find({
                        populate: '*',
                        filters: {
                            Date: { $gte: startOfYear },
                        },
                        pagination: {
                            page: page,
                            pageSize: pageSize
                        }
                    });

                    const { data, meta } = response;
                    allShifts.push(...data);

                    // Check if we have more pages
                    const { pagination } = meta;
                    hasMoreData = page < pagination.pageCount;
                    page++;

                } catch (error) {
                    console.error('Error fetching shifts:', error);
                    hasMoreData = false;
                }
            }

            // Map all shifts to events
            const mappedEvents: Event[] = [];
            allShifts.forEach((shift: any) => {
                shift.volunteers.forEach((volunteer: RawVolunteer) => {
                    mappedEvents.push({
                        title: `Vagt: ${volunteer.Name} ${volunteer.Instructor ? '(Instruktør)' : ''}`,
                        start: shift.Date
                    });
                });
            });

            setEvents(mappedEvents);
        };

        fetchAllShifts();
    }, [loggedIn])

    const handleListViewClick = () => {
        setListViewActive(true)
    }

    const handleLogin = () => {
        // Store login session with timestamp
        const loginData = {
            timestamp: new Date().getTime(),
            loggedIn: true
        };
        localStorage.setItem('volunteer_login', JSON.stringify(loginData));
        setLoggedIn(true);
    }

    return (
        <div>
            {!loggedIn ? <Login onLogin={handleLogin} /> : (!listViewActive ? (<CalendarView events={events} onListViewClick={handleListViewClick} />) : (<ListView onBackToCalendar={() => setListViewActive(false)} events={events} />))}
        </div>
    )
}
