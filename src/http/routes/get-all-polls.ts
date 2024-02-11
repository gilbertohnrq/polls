import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getAllPolls(app: FastifyInstance) {
	app.get('/polls', async (_, reply) => {
		const polls = await prisma.poll.findMany({
			include: {
				options: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		});

		if (polls.length === 0) {
			return reply.status(404).send({ message: 'No polls found' });
		}

		return reply.send({
			polls: polls.map((poll) => {
				return {
					id: poll.id,
					title: poll.title,
					options: poll.options.map((option) => {
						return {
							id: option.id,
							title: option.title,
						};
					}),
				};
			}),
		});
	});
}
