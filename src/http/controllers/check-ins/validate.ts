import { FastifyReply, FastifyRequest } from "fastify";

// components
import { z } from "zod";

// factories
import { makeValidateCheckInUseCase } from "@/repositories/factories/make-validate-check-in";

export const validate = async (req: FastifyRequest, res: FastifyReply) => {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string().uuid(),
	});

	const { checkInId } = validateCheckInParamsSchema.parse(req.params);

	const userCase = makeValidateCheckInUseCase();

	await userCase.execute({
		checkInId,
	});

	return res.status(204).send();
};
