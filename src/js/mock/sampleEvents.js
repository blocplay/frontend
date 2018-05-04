/* eslint-disable no-plusplus */
import moment from 'moment';
import MockObject from './MockObject';
import sampleGames from './sampleGames';

let counter = 0;

const allEvents = [
	{
		name: 'StarCraft 2',
		game: sampleGames[3],
		medias: {
			activity: 'mockImages/events/starcraft-2/activity.jpg',
			cover: 'mockImages/events/starcraft-2/cover.jpg',
			store: 'mockImages/events/starcraft-2/store.jpg',
		},
	},
	{
		name: 'FIFA 18',
		game: sampleGames[1],
		medias: {
			activity: 'mockImages/events/fifa-18/activity.jpg',
			cover: 'mockImages/events/fifa-18/cover.jpg',
			store: 'mockImages/events/fifa-18/store.jpg',
		},
	},
	{
		name: 'Halo 5 Tournament',
		game: sampleGames[11],
		medias: {
			activity: 'mockImages/events/halo-5/activity.jpg',
			cover: 'mockImages/events/halo-5/cover.jpg',
			store: 'mockImages/events/halo-5/store.jpg',
		},
	},
	{
		name: 'Dota 2',
		game: sampleGames[7],
		medias: {
			activity: 'mockImages/events/dota-2/activity.jpg',
			cover: 'mockImages/events/dota-2/cover.jpg',
			store: 'mockImages/events/dota-2/store.jpg',
		},
	},
	{
		name: 'PUBG',
		game: sampleGames[9],
		medias: {
			activity: 'mockImages/events/playerunknown-battleground/activity.jpg',
			cover: 'mockImages/events/playerunknown-battleground/cover.jpg',
			store: 'mockImages/events/playerunknown-battleground/store.jpg',
		},
	},
].map(event => new MockObject({
	id: `${counter++}`,
	tagLine: 'Red vs Blue',
	host: 'ESLeague',
	registrationDateLimit: null,
	startDateTime: moment().subtract(2, 'days').startOf('day'),
	endDateTime: moment().add(2, 'days').startOf('day').hour('12'),
	description: 'We are hosting an EPIC tournament for all! Invite your friends, bring everyone! Visit our website for more details on how to register and sign up. There will be prizes and more.',
	website: 'http://www.example.com',
	...event,
}));

export default {
	suggested: [allEvents[2], allEvents[3]],
	all: [...allEvents],
	games: [allEvents[2], allEvents[3], allEvents[4]],
};

export function getEventById(id) {
	return allEvents.find(event => event.id === id);
}
