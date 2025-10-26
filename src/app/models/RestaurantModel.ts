export interface RestaurantModel {
  id: number;
  name: string;
  urlLogo: string;
  nit: string;
  address: string;
}

export interface RestaurantResponseModel {
  id: number;
  name: string;
  address: string;
  ownerId: number;
  phone: string;
  urlLogo: string;
  nit: string;
}

export interface RestaurantRequestModel {
  name: string;
  address: string;
  ownerId: number;
  phone: string;
  urlLogo: string;
  nit: string;
}