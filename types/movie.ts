export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids?: number[]
}

export interface MovieReview {
  id: string
  movieId: number
  movieTitle: string
  userName: string
  email: string
  rating: number
  review: string
  createdAt: string
}

export interface WatchlistItem {
  id: string
  movieId: number
  movieTitle: string
  posterPath: string | null
  addedAt: string
}
