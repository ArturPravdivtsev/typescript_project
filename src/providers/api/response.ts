export interface PlaceListResponse extends Array<Place> {
  errorMessage?: string
  items: Place[]
}

export interface PlaceResponse {
  errorMessage?: string
  item: Place
}

export interface Place {
  id: string
  name: string
  description: string
  photos: string
  remoteness: number
  bookedDates: []
  price: number
}
