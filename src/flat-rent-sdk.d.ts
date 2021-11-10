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

  export class SdkProvider {
    get(id: string): Promise<Flat|null>
    search(paraments: Parameters): Promise<Flat[]>
  }
}
