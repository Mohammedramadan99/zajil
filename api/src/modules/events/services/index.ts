import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { Branch } from '../../branches/models/branch.model';
import { CreateEventDto } from '../dto/create-event';
import { UpdateEventDto } from '../dto/update-event';
import { Event, SeatType } from '../models/event.model';

export const createEvent = (createEventDto: CreateEventDto, businessId: number): Promise<Event> => {
    // validate startDate and endDate
    if (new Date(createEventDto.startDate) > new Date(createEventDto.endDate))
        throw new HttpError(400, 'startDate must be before endDate');

    // validate room if it exists
    if (createEventDto.room) {
        const room = createEventDto.room;

        
        // validate that all the rows have the same length
        const rowLength = room[0].length;
        if (!room.every((row) => row.length === rowLength))
        throw new HttpError(400, 'room must be a matrix with equal row lengths');
        
        // validate values
        const allowedSeatTypes = [
            SeatType.NONE,
            SeatType.THEATER,
            SeatType.AVAILABILE_SEAT,
        ]
        if (!room.every((row) => row.every((seat) => allowedSeatTypes.includes(seat))))
            throw new HttpError(400, `allowed seat types are ${allowedSeatTypes.join(', ')}`); 

        // validate number of available seats with the limitedAmount if it exists
        const availableSeats = room.reduce(
            (acc, row) => acc + row.filter((seat) => seat === SeatType.AVAILABILE_SEAT).length,
            0,
        );

        if (createEventDto.limitedAmount && availableSeats < createEventDto.limitedAmount)
            throw new HttpError(400, 'limitedAmount must be less than or equal to the number of available seats');

        // if the limitedAmount is not provided, set it to the number of available seats
        if (!createEventDto.limitedAmount) createEventDto.limitedAmount = availableSeats;
    }

    const event = new Event({ ...createEventDto, businessId: businessId });
    return event.save();
};

// only select users who share a event with the logged in user
export const findAllEvents = async ({
    limit = 10,
    offset = 0,
    businessId,
}: {
    limit: number;
    offset: number;
    businessId: number;
}) => {
    return Event.findAndCountAll({
        where: {
            businessId,
        },
        limit,
        offset,
    });
};

export const findOneEventById = (eventId: number): Promise<Event> => {
    return Event.findOne({
        where: {
            id: eventId,
        },
        include: [
            {
                model: Branch,
                as: 'branches',
            },
        ],
    });
};

export const updateEventById = async (eventId: number, updateEventDto: UpdateEventDto): Promise<Event> => {
    const event = await findOneEventById(eventId);
    if (!event) throw new HttpError(404, 'Event not found');

    if (!updateEventDto.startDate) updateEventDto.startDate = event.startDate as any;
    if (!updateEventDto.endDate) updateEventDto.endDate = event.endDate as any;
    if (!updateEventDto.room) updateEventDto.room = event.room as any;
    if (!updateEventDto.limitedAmount) updateEventDto.limitedAmount = event.limitedAmount as any;

    // validate startDate and endDate
    if (new Date(updateEventDto.startDate) > new Date(updateEventDto.endDate))
        throw new HttpError(400, 'startDate must be before endDate');

    // validate room if it exists
    if (updateEventDto.room) {
        const room = updateEventDto.room;

        // validate that all the rows have the same length
        const rowLength = room[0].length;
        if (!room.every((row) => row.length === rowLength))
            throw new HttpError(400, 'room must be a matrix with equal row lengths');

        // validate number of available seats with the limitedAmount if it exists
        const availableSeats = room.reduce(
            (acc, row) => acc + row.filter((seat) => seat === SeatType.AVAILABILE_SEAT).length,
            0,
        );

        if (updateEventDto.limitedAmount && availableSeats < updateEventDto.limitedAmount)
            throw new HttpError(400, 'limitedAmount must be less than or equal to the number of available seats');

        // if the limitedAmount is not provided, set it to the number of available seats
        if (!updateEventDto.limitedAmount) updateEventDto.limitedAmount = availableSeats;
    }

    return event.update(updateEventDto);
};

export const deleteEventById = async (eventId: number) => {
    const event = await findOneEventById(eventId);
    if (!event) throw new HttpError(404, 'Event not found');

    return event.destroy().then(() => ({ message: 'Event deleted successfully' }));
};
