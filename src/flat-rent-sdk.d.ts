declare module 'flat-rent-sdk' {
  export interface Flat {
    id: string,
    title: string,
    details: string,
    photos: string[],
    coordinates: number[],
    bookedDates: string[],
    price: number
  }

  export interface Parameters {
    city: string,
    checkInDate: Date,
    checkOutDate: Date,
    priceLimit: number
  }

  export function get(id: string): Promise<Flat|null>

  export function search(paraments: Parameters): Promise<Flat[]>

  export function _formatFlatObject(flat: string, nightNumber?: number)
}
