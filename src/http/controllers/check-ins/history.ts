import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeFetchUserCheckInHistoryUseCase } from "@/repositories/factories/make-fetch-user-check-ins-history-use-case";

export const history = async (req: FastifyRequest, res: FastifyReply) => {
	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	});

	const { page } = checkInHistoryQuerySchema.parse(req.query);

	const fetchUserCheckInHistoryUseCase = makeFetchUserCheckInHistoryUseCase();

	const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
		page,
		userId: req.user.sub,
	});

	return res.status(200).send({ checkIns });
};
