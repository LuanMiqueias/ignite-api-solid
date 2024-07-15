import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeSearchGymsUseCase } from "@/repositories/factories/make-search-gyms-use-case";

export const search = async (req: FastifyRequest, res: FastifyReply) => {
	const CreateGymQuerySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1),
	});

	const { page, query } = CreateGymQuerySchema.parse(req.query);

	const SearchGymUseCase = makeSearchGymsUseCase();

	const { gyms } = await SearchGymUseCase.execute({
		page,
		query,
	});

	return res.status(200).send({
		gyms,
	});
};
