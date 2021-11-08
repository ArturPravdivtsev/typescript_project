import { Place } from '../../place.js'
import { Provider } from '../../provider.js'
import { SearchFilter } from '../../search-filter.js'
import { PlaceResponse, PlaceListResponse, Place as SdkPlace } from './response.js'
import { FlatRentSdk } from '../../flat-rent-sdk.js';

export class SdkProvider implements Provider {
  public static provider = 'sdk'
  private static apiUrl = 'http://localhost:3000'

  private static SDK = new FlatRentSdk();

  public find(filter: SearchFilter): Promise<Place[]> {
    return SdkProvider.SDK.search(filter)
      .then((response) => {
        return this.convertPlaceListResponse(response)
      })
  }

  public getById(id: string): Promise<Place> {
    return SdkProvider.SDK.get(id)
      .then((response) => {
        return this.convertPlaceResponse(response.item)
      })
  }

  private convertFilterToQueryString(filter: SearchFilter): string {
    return `priceLimit=${filter.priceLimit}` +
      `&checkInDate=${filter.checkInDate}&checkOutDate=${filter.checkOutDate}`
  }

  private convertPlaceListResponse(response: PlaceListResponse): Place[] {
    return response.map((item) => {
      return this.convertPlaceResponse(item)
    })
  }

  private convertPlaceResponse(item: SdkPlace): Place {
    return new Place(
      SdkProvider.provider,
      String(item.id),
      item.title,
      item.details,
      item.photos,
      null,
      item.bookedDates,
      item.totalPrice
    )
  }
}
