import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeCreateGymUseCase } from "@/repositories/factories/make-create-gym-use-case";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { title, description, phone, latitude, longitude } =
		createGymBodySchema.parse(req.body);

	const createGymUseCase = makeCreateGymUseCase();

	await createGymUseCase.execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	});

	return res.status(201).send();
};
