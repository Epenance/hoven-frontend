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
    const [needsApproval, setNeedsApproval] = useState<boolean>(false)
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
                    })

                    const { data, meta } = response;
                    allShifts.push(...data);

                    // Check if we have more pages
                    const { pagination } = meta;
                    if (pagination) {
                        hasMoreData = page < pagination.pageCount;
                        page++;
                    }
                } catch (error) {
                    console.log(error)
                    console.error('Error fetching shifts:', error);

                    // Check if it's a 403 Forbidden error
                    if (error instanceof Error) {
                        // Check for status code in different possible locations
                        const statusCode = (error as any).status || (error as any).statusCode || (error as any).response?.status;

                        if (statusCode === 403) {
                            console.log('403 Forbidden - User not authorized to access shifts');
                            setNeedsApproval(true)
                            break; // Exit the loop
                        }
                    }

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
        setNeedsApproval(false) // Reset approval state on logout
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
                                className="px-3 cursor-pointer py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Log ud
                            </button>
                        </div>
                    )}

                    {needsApproval ? (
                        <div className="flex items-center justify-center bg-gray-50">
                            <div className="max-w-md w-full mx-auto p-6">
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <div className="mb-6">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Afventer godkendelse
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Din bruger skal godkendes af en administrator før du kan få adgang til vagtplanen.
                                    </p>
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500">
                                            Hvis du har spørgsmål, kan du kontakte en administrator.
                                        </p>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full cursor-pointer flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jagt-500"
                                        >
                                            Log ud
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!listViewActive ? (
                                <CalendarView events={events} onListViewClick={handleListViewClick} />
                            ) : (
                                <ListView onBackToCalendar={() => setListViewActive(false)} events={events} />
                            )}
                        </>
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
