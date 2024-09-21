import { getChatMessages, searchByActorAndFilm } from "@/app/actions";
import { CreateNewRating } from "@/components/CreateNewRating";
import { ActorRating } from "../../../../components/ActorRating";

interface ActorFilmProps {
  params: {
    actorId: string;
    filmId: string;
  }
}

export default async function Page({ params }: ActorFilmProps) {
  const { actorId, filmId } = params;

  const rating = await searchByActorAndFilm(Number(actorId), Number(filmId));

  if (!rating) {
    return <CreateNewRating actorId={actorId} filmId={filmId} />
  }

  console.log('Rating', rating);

  const chat = await getChatMessages(rating.id);

  return <ActorRating rating={rating} chat={chat} />
}
