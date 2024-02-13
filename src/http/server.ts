import fastify from 'fastify';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import { pollResults } from './ws/poll-results';
import { getAllPolls } from './routes/get-all-polls';
import { deletePoll } from './routes/delete-poll';

const app = fastify();

app.register(cookie, {
	secret: 'polls-app-secret-key',
	hook: 'onRequest',
});

app.register(websocket);

//GET
app.register(getPoll);
app.register(getAllPolls);

//POST
app.register(createPoll);
app.register(voteOnPoll);

//DELETE
app.register(deletePoll);

//WS
app.register(pollResults);

app
	.listen({
		port: process.env.PORT ? Number(process.env.PORT) : 3333,
		host: '0.0.0.0',
	})
	.then(() => {
		console.log('Server is running');
	});
