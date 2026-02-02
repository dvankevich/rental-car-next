export interface ICar {
    id: string;
    year: number;
    make: string;
    model: string;
    type: string;
    img: string;
    description: string;
    fuelConsumption: string;
    engineSize: string;
    accessories: string[];
    functionalities: string[];
    rentalPrice: string;
    rentalCompany: string;
    address: string;
    rentalConditions: string;
    mileage: number;
}

export interface ICarFilters {
    brand?: string;
    rentalPrice?: string;
    minMileage?: number;
    maxMileage?: number;
}
