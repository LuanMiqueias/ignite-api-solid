import { Gym, Prisma, User } from "@prisma/client";

export interface findManyNearByParams {
	latitude: number;
	longitude: number;
}
export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	findById(userId: string): Promise<Gym | null>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	findManyNearBy(params: findManyNearByParams): Promise<Gym[]>;
}
