import { Place } from './place.js'
import { SearchFilter } from './search-filter.js'

export abstract class Provider {
  find(filter: SearchFilter): Promise<Place[]>
  getById(id: string): Promise<Place>
}
