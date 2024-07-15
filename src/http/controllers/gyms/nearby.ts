import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeFetchNearbyGymUseCase } from "@/repositories/factories/make-fetch-nearby-gyms-use-case";

export const nearby = async (req: FastifyRequest, res: FastifyReply) => {
	const NearByGymQuerySchema = z.object({
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { latitude, longitude } = NearByGymQuerySchema.parse(req.query);

	const fetchNearByGymUseCase = makeFetchNearbyGymUseCase();

	const { gyms } = await fetchNearByGymUseCase.execute({
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return res.status(200).send({
		gyms,
	});
};
