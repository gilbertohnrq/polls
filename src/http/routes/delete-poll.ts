import z from 'zod';
import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { redis } from '../../lib/redis';

export async function deletePoll(app: FastifyInstance) {
	app.delete('/polls/:pollId', async (request, reply) => {
		const deletePollParams = z.object({
			pollId: z.string().uuid(),
		});

		const { pollId } = deletePollParams.parse(request.params);

		const pollOptions = await prisma.pollOption.findMany({
			where: {
				pollId: pollId,
			},
		});

		for (let option of pollOptions) {
			await prisma.vote.deleteMany({
				where: {
					pollOptionId: option.id,
				},
			});
		}

		await prisma.pollOption.deleteMany({
			where: {
				pollId: pollId,
			},
		});

		const deletedPoll = await prisma.poll.delete({
			where: {
				id: pollId,
			},
		});

		await redis.del(`poll:${pollId}`);

		return reply.send({
			message: `Poll with id ${deletedPoll.id} has been deleted`,
		});
	});
}
