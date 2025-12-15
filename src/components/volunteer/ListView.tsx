import type {Event} from "@/components/volunteer/types.ts";

interface ListViewProps {
    onBackToCalendar: () => void;
    events?: Event[];
}

export const ListView = ({onBackToCalendar, events = []}: ListViewProps) => {
    // Group events by shift (same date/time)
    const groupEventsByShift = (events: Event[]) => {
        const shiftGroups: { [key: string]: Event[] } = {};

        events.forEach(event => {
            const shiftKey = event.start; // Group by exact date/time

            if (!shiftGroups[shiftKey]) {
                shiftGroups[shiftKey] = [];
            }
            shiftGroups[shiftKey].push(event);
        });

        return shiftGroups;
    };

    // Group shifts by month
    const groupShiftsByMonth = (shiftGroups: { [key: string]: Event[] }) => {
        const monthGroups: { [key: string]: { [key: string]: Event[] } } = {};

        Object.entries(shiftGroups).forEach(([shiftKey, shiftEvents]) => {
            const date = new Date(shiftKey);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthGroups[monthKey]) {
                monthGroups[monthKey] = {};
            }
            monthGroups[monthKey][shiftKey] = shiftEvents;
        });

        // Sort shifts within each month by date
        Object.keys(monthGroups).forEach(month => {
            const sortedShifts: { [key: string]: Event[] } = {};
            const sortedKeys = Object.keys(monthGroups[month]).sort();
            sortedKeys.forEach(key => {
                sortedShifts[key] = monthGroups[month][key];
            });
            monthGroups[month] = sortedShifts;
        });

        return monthGroups;
    };

    const shiftGroups = groupEventsByShift(events);
    const monthGroups = groupShiftsByMonth(shiftGroups);
    
    // Filter out past months - only show current month and future months
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const filteredMonthKeys = Object.keys(monthGroups)
        .filter(monthKey => monthKey >= currentMonthKey)
        .sort();

    return (
        <div className="w-full">
            {/* Top bar with Kalender button */}
            <div className="flex justify-between items-center py-4 bg-white border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Liste visning</h2>
                <button
                    onClick={onBackToCalendar}
                    className="px-4 py-2 cursor-pointer bg-jagt-200 text-white rounded-sm hover:bg-jagt-600 focus:outline-none focus:ring-2 focus:ring-offset-2  border border-jagt-600"
                >
                    Kalender
                </button>
            </div>

            {/* Content area */}
            <div className="p-4">
                {filteredMonthKeys.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Ingen kommende vagter fundet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredMonthKeys.map(monthKey => {
                            const monthShifts = monthGroups[monthKey];
                            const totalShifts = Object.keys(monthShifts).length;
                            const monthName = new Date(Object.keys(monthShifts)[0]).toLocaleDateString('da-DK', {
                                year: 'numeric',
                                month: 'long'
                            });

                            return (
                                <div key={monthKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    {/* Month header */}
                                    <div className="bg-jagt-100 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                                        <h3 className="text-lg font-semibold text-white capitalize">
                                            {monthName}
                                        </h3>
                                        <p className="text-sm text-white">
                                            {totalShifts} vagt{totalShifts !== 1 ? 'er' : ''}
                                        </p>
                                    </div>

                                    {/* Shifts list */}
                                    <div className="divide-y divide-gray-200">
                                        {Object.entries(monthShifts).map(([shiftKey, shiftEvents]) => {
                                            const shiftDate = new Date(shiftKey);
                                            const formattedDate = shiftDate.toLocaleDateString('da-DK', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long'
                                            });

                                            return (
                                                <div key={shiftKey}
                                                     className="p-4 hover:bg-gray-50 transition-colors duration-150">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Vagt - {formattedDate}
                                                            </h4>
                                                            <div className="space-y-1">
                                                                {shiftEvents.map((event, index) => {
                                                                    // Extract volunteer name from title
                                                                    const volunteerInfo = event.title.replace('Vagt: ', '');
                                                                    return (
                                                                        <p key={index}
                                                                           className="text-sm text-gray-600">
                                                                            • {volunteerInfo}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}