import { AxiosError } from "axios";
import to from "await-to-js";
import { axiosInstance } from "@/lib/axios.instance";
import { Bike, BikeCardType, BikeWithoutRatingAndId } from "..";

type ToAxiosResult<T> = [AxiosError | null, T | null];

export default class BikeApi {
  static async getBikes(url: string = "/bike"): Promise<
    ToAxiosResult<{
      data: BikeCardType[];
      page: number;
      total: number;
      pageCount: number;
    }>
  > {
    const [error, response] = await to(axiosInstance.get(url));
    return [error as AxiosError | null, response?.data];
  }
  static async updateBike(id: number, credentials: Partial<Bike>) {
    const [error, response] = await to(
      axiosInstance.patch(`/bike/${id}`, credentials)
    );
    return [error as AxiosError | null, response?.status];
  }

  static async deleteBike(id: number) {
    const [error, response] = await to(axiosInstance.delete(`/bike/${id}`));
    return [error as AxiosError | null, response?.status];
  }

  static async getBikeById(id: number) {
    const [error, response] = await to(axiosInstance.get(`/bike/${id}`));
    return [error as AxiosError | null, response?.data];
  }

  static async createBike(bikeDetails: BikeWithoutRatingAndId) {
    const [error, response] = await to(
      axiosInstance.post(`/bike`, bikeDetails)
    );

    return [error as AxiosError | null, response?.data];
  }
}
