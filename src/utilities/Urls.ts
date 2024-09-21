const urls = {
  home: () => "/",
  rating: (actorId: number, filmId: number) => `/rating/${actorId}/${filmId}`,
}

export { urls };