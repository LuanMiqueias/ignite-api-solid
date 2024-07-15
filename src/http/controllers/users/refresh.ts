import { FastifyReply, FastifyRequest } from "fastify";

export const refresh = async (req: FastifyRequest, res: FastifyReply) => {
	await req.jwtVerify({
		onlyCookie: true,
	});

	const token = await res.jwtSign(
		{},
		{
			sign: {
				sub: req.user?.sub,
			},
		}
	);
	const refreshToken = await res.jwtSign(
		{},
		{
			sign: {
				sub: req.user?.sub,
			},
		}
	);

	return res
		.setCookie("refreshToken", refreshToken, {
			path: "/",
			secure: true,
			sameSite: true,
			httpOnly: true,
		})
		.status(200)
		.send({
			token,
		});
};
