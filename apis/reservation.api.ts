import { AxiosError } from "axios";
import to from "await-to-js";
import { ReservationResponse, reservationCredentials } from "..";
import { axiosInstance } from "@/lib/axios.instance";

type ToAxiosResult<T> = [AxiosError | null, T | null];

export default class ReservationApi {
  static async createReservation(
    reservationCredentials: reservationCredentials
  ): Promise<ToAxiosResult<ReservationResponse>> {
    console.log(reservationCredentials);
    const [error, response] = await to(
      axiosInstance.post("/reservation", reservationCredentials)
    );
    return [error as AxiosError | null, response?.data];
  }

  static async updateReservation(
    id: number,
    credentials: Partial<ReservationResponse>
  ) {
    const [error, response] = await to(
      axiosInstance.patch(`/reservation/${id}`, credentials)
    );
    return [error as AxiosError | null, response?.data];
  }

  static async deleteReservation(id: number) {
    const [error, response] = await to(
      axiosInstance.delete("/reservation/" + id)
    );
    return [error as AxiosError | null, response?.data];
  }

  static async getReservationsById(
    id: number
  ): Promise<ToAxiosResult<ReservationResponse[]>> {
    const [error, response] = await to(
      axiosInstance.get("/reservation/user/" + id)
    );
    console.log(response);
    return [error as AxiosError | null, response?.data];
  }

  static async getAllReservations(): Promise<
    ToAxiosResult<ReservationResponse[]>
  > {
    const [error, response] = await to(axiosInstance.get("/reservation"));
    return [error as AxiosError | null, response?.data];
  }

  static async cancelReservation(
    id: number
  ): Promise<ToAxiosResult<ReservationResponse[]>> {
    const [error, response] = await to(
      axiosInstance.patch("/cancel-reservation/" + id)
    );
    return [error as AxiosError | null, response?.data];
  }

  static async rateReservation(credentials: {
    reservationId: number;
    rating: number;
  }) {
    const [error, response] = await to(
      axiosInstance.post("/reservation/rate", credentials)
    );
    return [error as AxiosError | null, response?.data];
  }

  static async getAllUsersReservations(): Promise<
    ToAxiosResult<ReservationResponse[]>
  > {
    const [error, response] = await to(axiosInstance.get("/reservation/user"));
    return [error as AxiosError | null, response?.data];
  }
}
