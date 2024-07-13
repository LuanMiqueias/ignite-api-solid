import { makeGetUserProfileUseCase } from "@/repositories/factories/make-get-user-profile";
import { FastifyReply, FastifyRequest } from "fastify";

export const profile = async (req: FastifyRequest, res: FastifyReply) => {
	const getUserProfile = makeGetUserProfileUseCase();

	const { user } = await getUserProfile.execute({
		userId: req.user.sub,
	});
	return res.status(200).send({
		user: {
			...user,
			passwordHash: undefined,
		},
	});
};
