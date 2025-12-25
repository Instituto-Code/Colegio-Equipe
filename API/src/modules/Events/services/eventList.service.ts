import { EventRepository } from "../event.repository.js";

export async function ListAllEventsService() {
    const events = await EventRepository.findAll();

    const eventsFormated = events.map((e) => ({
        id: e._id,
        description: e.descricao,
        data: e.data,
        tipo: e.tipo,
        author: e.author
    }))

    return{
        eventsFormated
    }
}