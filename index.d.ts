declare module "*.png";

export type BikeCardType = {
  avgRating: string;
  color: string;
  id: number;
  imageURL: string;
  isAvailable: boolean;
  location: string;
  model: string;
};
declare interface Bike {
  id: number;
  color: string;
  imageURL?: string;
  isAvailable: boolean;
  location: string;
  model: string;
  avgRating: number;
}
type BikeWithoutRatingAndId = Omit<Bike, "avgRating", "id">;

type User = {
  email: string;
  id: number;
  name: string;
  isManager: boolean;
};

type ReservationResponse = {
  startDate: Date;
  endDate: Date;
  user: User;
  bike: Bike;
  disabled: boolean;
  rating: number;
  id: number;
};

type reservationCredentials = {
  startDate: Date;
  endDate: Date;
  bikeId: number;
};

type filterType = {
  avgRating: string;
  color: string;
  isAvailable: boolean;
  location: string;
  model: string;
  startDate: string;
  endDate: string;
};

type LoginType = {
  email: string;
  password: string;
};
