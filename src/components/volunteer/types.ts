export interface Event {
    title: string;
    start: string;
}

interface RawVolunteer {
    Name: string,
    Instructor?: boolean
    Email?: string
    Phone?: string
}

export interface RawEvent {
    id: number,
    Date: string,
    volunteers: RawVolunteer[]
}