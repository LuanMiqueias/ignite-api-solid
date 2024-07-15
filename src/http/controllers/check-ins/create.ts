import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeCreateGymUseCase } from "@/repositories/factories/make-create-gym-use-case";
import { makeCheckInUseCase } from "@/repositories/factories/make-check-in-use-case";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
	const CreateCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});
	const CreateCheckInParamsSchema = z.object({
		gymId: z.string().uuid(),
	});

	const { latitude, longitude } = CreateCheckInBodySchema.parse(req.body);

	const { gymId } = CreateCheckInParamsSchema.parse(req.params);

	const createGymUseCase = makeCheckInUseCase();

	await createGymUseCase.execute({
		userLatitude: latitude,
		userLongitude: longitude,
		userId: req.user.sub,
		gymId,
	});

	return res.status(201).send();
};
