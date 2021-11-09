import { Place } from '../../place.js'
import { Provider } from '../../provider.js'
import { SearchFilter } from '../../search-filter.js'
import { HttpHelper } from '../../utils/http-helper.js'
import { PlaceResponse, PlaceListResponse, Place as ApiPlace } from './response.js'

export class ApiProvider implements Provider {
  public static provider = 'api'
  private static apiUrl = 'http://localhost:3000'

  public find(filter: SearchFilter): Promise<Place[]> {
    return HttpHelper.fetchAsJson<PlaceListResponse>(
      ApiProvider.apiUrl + '/places'
    )
      .then((response) => {
        this.assertIsValidResponse(response)
        if (filter.priceLimit != null) {
          response.items = response.filter((place) => {
            return place.price <= filter.priceLimit;
          });
        }
        return this.convertPlaceListResponse(response)
      })
  }

  public getById(id: string): Promise<Place> {
    return HttpHelper.fetchAsJson<PlaceResponse>(ApiProvider.apiUrl + '/places/' + id)
      .then((response) => {
        this.assertIsValidResponse(response)
        return this.convertPlaceResponse(response.item)
      })
  }

  private assertIsValidResponse(response: PlaceListResponse | PlaceResponse): void {
    if (response.errorMessage != null) {
      throw new Error(response.errorMessage)
    }
  }

  private convertPlaceListResponse(response: PlaceListResponse): Place[] {
    return response.map((item) => {
      return this.convertPlaceResponse(item)
    })
  }

  private convertPlaceResponse(item: ApiPlace): Place {
    return new Place(
      ApiProvider.provider,
      String(item.id),
      item.name,
      item.description,
      item.photos,
      item.remoteness,
      item.bookedDates,
      item.price
    )
  }
}
