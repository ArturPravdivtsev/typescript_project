export class Place {
  constructor(
    private readonly provider: string,
    public readonly originalId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly photos: string|string[],
    public readonly remoteness: number,
    public readonly bookedDates: [],
    public readonly price: number
  ) {}

  get id () {
    return this.provider + '-' + this.originalId
  }

  public isProvidedBy(providerName: string): boolean {
    return this.provider === providerName
  }
}
