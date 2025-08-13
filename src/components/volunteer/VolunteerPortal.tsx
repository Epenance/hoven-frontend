import {useEffect, useState} from "react";
import {strapi} from "@strapi/client";
import {ListView} from "@/components/volunteer/ListView.tsx";
import type {Event, RawVolunteer} from "@/components/volunteer/types.ts";
import {CalendarView} from "@/components/volunteer/CalendarView.tsx";
import AuthView from "@/components/volunteer/AuthView.tsx";
import {useAuth, AuthProvider} from "@/hooks/useAuth.ts";

const CMS_PATH = import.meta.env.PUBLIC_CMS_PATH;

function VolunteerPortalContent() {
    const [listViewActive, setListViewActive] = useState<boolean>(false)
    const [events, setEvents] = useState<Event[]>([])
    const { isLoggedIn, user, isLoading, logout, getAuthToken } = useAuth();

    useEffect(() => {
        // Only fetch shifts if logged in
        if (!isLoggedIn) return;

        const jwt = getAuthToken();
        if (!jwt) return;

        const strapiClient = strapi({
            baseURL: `${CMS_PATH}/api`,
            auth: jwt
        });

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
                    if (pagination) {
                        hasMoreData = page < pagination.pageCount;
                        page++;
                    }
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
    }, [isLoggedIn])

    const handleListViewClick = () => {
        setListViewActive(true)
    }

    const handleLogout = () => {
        logout();
        setListViewActive(false); // Reset view state on logout
    }

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jagt-600"></div>
            </div>
        );
    }

    return (
        <div>
            {!isLoggedIn ? (
                <AuthView />
            ) : (
                <div>
                    {/* User info and logout button */}
                    {user && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                            <span className="text-sm text-gray-600">
                                Logget ind som: {user.firstname} {user.surname} ({user.email})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Log ud
                            </button>
                        </div>
                    )}

                    {!listViewActive ? (
                        <CalendarView events={events} onListViewClick={handleListViewClick} />
                    ) : (
                        <ListView onBackToCalendar={() => setListViewActive(false)} events={events} />
                    )}
                </div>
            )}
        </div>
    )
}

export default function VolunteerPortal() {
    return (
        <AuthProvider>
            <VolunteerPortalContent />
        </AuthProvider>
    );
}
