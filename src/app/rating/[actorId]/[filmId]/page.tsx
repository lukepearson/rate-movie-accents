import { getChatMessages, searchByActorAndFilm } from "@/app/actions";
import { CreateNewRating } from "@/components/CreateNewRating";
import { unB64 } from "@/utilities/Sanitisation";
import { ActorRating } from "../../../../components/ActorRating";

interface ActorFilmProps {
  params: {
    actorId: string;
    filmId: string;
  }
}

export default async function Page({ params }: ActorFilmProps) {
  const { actorId, filmId } = params;

  const actor = unB64(actorId);
  const film = unB64(filmId);
  const rating = await searchByActorAndFilm(actor, film);

  if (!rating) {
    return <CreateNewRating actor={actor} film={film} />
  }

  const chat = await getChatMessages(rating.id);

  return <ActorRating rating={rating} chat={chat} />
}
