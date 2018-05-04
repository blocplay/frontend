/* eslint-disable no-plusplus */
import { sample } from 'underscore';
import MockObject from './MockObject';
import randomConversationHistory from './randomConversationHistory';
import sampleUsers from './sampleUsers';

let counter = 0;

const communities = [
	{
		name: 'Ethereum Official Community',
		nbMembers: 10853,
		medias: {
			activity: 'mockImages/community/ethereum-community/activity.jpg',
			cover: 'mockImages/community/ethereum-community/cover.jpg',
			store: 'mockImages/community/ethereum-community/store.jpg',
		},
	},
	{
		name: 'Fallout Community',
		medias: {
			activity: 'mockImages/community/fallout-4/activity.jpg',
			cover: 'mockImages/community/fallout-4/cover.jpg',
			store: 'mockImages/community/fallout-4/store.jpg',
		},
	},
	{
		name: 'Bitcoin Community',
		medias: {
			activity: 'mockImages/community/bitcoin/activity.jpg',
			cover: 'mockImages/community/bitcoin/cover.jpg',
			store: 'mockImages/community/bitcoin/store.jpg',
		},
	},
	{
		name: 'Overwatch Group',
		nbMembers: 4543,
		medias: {
			activity: 'mockImages/community/overwatch/activity.jpg',
			cover: 'mockImages/community/overwatch/cover.jpg',
			store: 'mockImages/community/overwatch/store.jpg',
		},
	},
	{
		name: 'FIFA 18 Group',
		medias: {
			activity: 'mockImages/community/fifa-18/activity.jpg',
			cover: 'mockImages/community/fifa-18/cover.jpg',
			store: 'mockImages/community/fifa-18/store.jpg',
		},
	},
	{
		name: 'Halo 5',
		medias: {
			activity: 'mockImages/community/halo-5/activity.jpg',
			cover: 'mockImages/community/halo-5/cover.jpg',
			store: 'mockImages/community/halo-5/store.jpg',
		},
	},
].map(community => new MockObject({
	id: `${counter++}`,
	nbMembers: 2135,
	language: 'English',
	description: 'Red vs Blue',
	conversation: randomConversationHistory(sample(sampleUsers), sample(sampleUsers, 3), counter),
	playing: sample(sampleUsers, 5),
	members: [...sampleUsers],
	...community,
}));

export default communities;

export function findCommunityById(id) {
	return communities.find(community => community.id === id)
}
