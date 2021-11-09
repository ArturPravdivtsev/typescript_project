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
  title: string
  details: string
  photos: string[]
  coordinates: number[]|null
  bookedDates: []
  totalPrice: number
}
