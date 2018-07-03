/* eslint-disable no-plusplus */
import merge from 'lodash/merge';
import TokenItem from '../app/CartItem/TokenItem';
import GameItem from '../app/CartItem/GameItem';

/**
 * Data of the MockServer. This sample file should not be modified. Copy (rename) it and use in your
 * env.dev.js if you use a MockServer. The .gitignore already ignores `mockData.js`, so you should
 * rename this file to this.
 *
 * See the api specification for the attributes of each fields.
 * @see https://app.swaggerhub.com/apis/TJB/TokenPlayAppAPI/1.0.0
 */

const oneDay = 1000 * 60 * 60 * 24;

/**
 * Users
 * @type {User[]}
 */
const allUsers = [
	{
		username: 'vance23',
		displayName: 'Alyx Vance',
		avatar: {
			url: 'mockImages/user/profile-avatar-5.jpg',
		},
		tokenBalance: '149275280000000000',
		language: 'en',
		motto: 'My motto here!',
		status: {
			code: 'online',
			displayText: 'Currently online',
		},
	},
	{
		username: 'Johnny12',
		displayName: 'Stephan Tunison',
		status: {
			code: 'online',
			displayText: 'Playing Destiny',
		},
		avatar: {
			url: 'mockImages/user/profile-avatar.jpg',
		},
	},
	{
		username: 'Matthew_ts',
		displayName: 'Gerry Audet',
		status: {
			code: 'online',
			displayText: 'Playing World of Warcraft',
		},
		avatar: {
			url: 'mockImages/user/profile-avatar-2.jpg',
		},
	},
	{
		username: 'JamesShark',
		displayName: 'Martin Vaquera',
		avatar: {
			url: 'mockImages/user/profile-avatar-3.jpg',
		},
	},
	{
		username: 'MarkH',
		displayName: 'Derick Quinonez',
		avatar: {
			url: 'mockImages/user/profile-avatar-4.jpg',
		},
	},
	{
		username: 'Obi180',
		displayName: 'Alonzo Cobb',
		avatar: {
			url: 'mockImages/user/profile-avatar-6.jpg',
		},
	},
	{
		username: 'BB_Bounc3',
		displayName: 'Donnie Damelio',
		status: {
			code: 'online',
			displayText: 'Online',
		},
		avatar: {
			url: 'mockImages/user/profile-avatar-7.jpg',
		},
	},
	{
		username: 'GGStylez',
		displayName: 'Melany Bob',
		avatar: {
			url: 'mockImages/user/profile-avatar.jpg',
		},
	},
	{
		username: 'BMX182',
		displayName: 'Kaye Benningfield',
		avatar: {
			url: 'mockImages/user/profile-avatar-2.jpg',
		},
	},
	{
		username: 'F84l1ty',
		displayName: 'Mirella Schlager',
		avatar: {
			url: 'mockImages/user/profile-avatar-3.jpg',
		},
	},
	{
		username: 'Ca$H',
		displayName: 'Ronna Streets',
		status: {
			code: 'online',
		},
		avatar: {
			url: 'mockImages/user/profile-avatar-4.jpg',
		},
	},
	{
		username: 'MarkyMark',
		displayName: 'Sharita Vickery',
		avatar: {
			url: 'mockImages/user/profile-avatar-6.jpg',
		},
	},
	{
		username: 'James_cassidy',
		displayName: 'Josef Oakes',
		status: {
			code: 'online',
			displayText: 'Playing Half-Life 2',
		},
		avatar: {
			url: 'mockImages/user/profile-avatar-7.jpg',
		},
	},
].map((user, index) => merge({
	id: `u_${index + 1}`, // 1 is the id of the current user
	username: 'not-set',
	displayName: '[Not set]',
	avatar: {
		url: null,
	},
	tokenBalance: '0',
	language: 'en',
	motto: 'Make video games great again!',
	status: {
		code: 'offline',
		displayText: 'Offline',
	},
}, user));

/**
 * Current user's conversations
 * @type {Conversation[]}
 */
const conversations = [
	{
		isFavorite: true,
		latestMessage: 'Last message',
		users: [allUsers[4]],
	},
	{
		title: 'Let\'s play!',
		users: [allUsers[2], allUsers[3], allUsers[4], allUsers[5]],
		latestEvents: [
			{
				type: 'message:sent',
				message: {
					user: allUsers[2],
					content: 'Message content',
				},
			},
			{
				type: 'user:left',
				user: allUsers[8],
			},
			{
				type: 'user:joined',
				user: allUsers[3],
			},
			{
				type: 'message:sent',
				message: {
					user: allUsers[3],
					content: 'My other message',
				},
			},
			{
				type: 'message:sent',
				message: {
					user: allUsers[0],
					content: 'My message',
				},
			},
			{
				type: 'user:left',
				user: allUsers[3],
			},
		],
	},
].map((data, index) => {
	if (data.latestEvents) {
		data.latestEvents.forEach((eventData, eventIndex) => {
			if (eventData.type.indexOf('message:') === 0) {
				const message = {
					id: `m_${eventIndex + 10000}`,
					ref: null,
					creationDate: Math.round((new Date()).getTime() / 1000),
					type: 'text',
					content: '',
					userId: eventData.message.user.id,
					...eventData.message,
				};
				delete message.user;
				eventData.message = message;
			}

			if (eventData.type.indexOf('user:') === 0) {
				eventData.userId = eventData.user.id;
				delete eventData.user;
			}

			merge(eventData, {
				id: `e_${eventIndex + 1}`,
				date: Math.round((new Date()).getTime() / 1000),
			});
		});
	}

	return {
		id: `c_${index + 1}`,
		title: null,
		creationDate: Math.round((new Date()).getTime() / 1000),
		users: [],
		isFavorite: false,
		latestEvents: [],
		latestMessage: null,
		...data,
	};
});

const games = [
	{
		name: 'Deus Ex: Mankind Divided',
		publisher: {
			name: 'Feral Interactive',
		},
		images: {
			activity: { url: 'mockImages/games/deus-ex-mankind/activity.jpg' },
			cover: { url: 'mockImages/games/deus-ex-mankind/cover.jpg' },
			teaser: { url: 'mockImages/games/deus-ex-mankind/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/deus-ex-mankind/trailer-1.mp4',
				previewUrl: './mockImages/games/deus-ex-mankind/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/deus-ex-mankind/trailer-2.mp4',
				previewUrl: './mockImages/games/deus-ex-mankind/activity.jpg',
			},
		],
		package:{
			id: 'adhd',
			defaultDest: 'C:/TokenPlay/games/adhd',
			installSize: 54757100,
			downloaded: true,
		},
	},
	{
		name: 'FIFA 18',
		publisher: {
			name: 'Feral Interactive',
		},
		images: {
			activity: { url: 'mockImages/games/fifa-18/activity.jpg' },
			cover: { url: 'mockImages/games/fifa-18/cover.jpg' },
			teaser: { url: 'mockImages/games/fifa-18/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/fifa-18/trailer-1.mp4',
				previewUrl: './mockImages/games/fifa-18/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/fifa-18/trailer-2.mp4',
				previewUrl: './mockImages/games/fifa-18/activity.jpg',
			},
		],
		package:{
			id: 'gopp',
			defaultDest: 'C:/TokenPlay/games/gopp',
			installSize: 54757100,
		},
	},
	{
		name: 'Batman: Arkham City',
		publisher: {
			name: 'Feral Interactive',
		},
		images: {
			activity: { url: 'mockImages/games/batman-arkham-city/activity.jpg' },
			cover: { url: 'mockImages/games/batman-arkham-city/cover.jpg' },
			teaser: { url: 'mockImages/games/batman-arkham-city/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/batman-arkham-city/trailer-1.mp4',
				previewUrl: './mockImages/games/batman-arkham-city/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/batman-arkham-city/trailer-2.mp4',
				previewUrl: './mockImages/games/batman-arkham-city/activity.jpg',
			},
		],
		package:{
			id: 'mfl',
			defaultDest: 'C:/TokenPlay/games/mfl',
			installSize: 56966400,
		},
	},
	{
		name: 'StarCraft 2',
		publisher: {
			name: 'Havok',
		},
		images: {
			activity: { url: 'mockImages/games/starcraft-2/activity.jpg' },
			cover: { url: 'mockImages/games/starcraft-2/cover.jpg' },
			teaser: { url: 'mockImages/games/starcraft-2/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/starcraft-2/trailer-1.mp4',
				previewUrl: './mockImages/games/starcraft-2/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/starcraft-2/trailer-2.mp4',
				previewUrl: './mockImages/games/starcraft-2/activity.jpg',
			},
		],
		package:{
			id: 'csq',
			defaultDest: 'C:/TokenPlay/games/csq',
			installSize: 56966400,
		},
	},
	{
		// 4
		name: 'Destiny: Rise of Iron',
		publisher: {
			name: 'Bungie',
		},
		images: {
			activity: { url: 'mockImages/games/destiny/activity.jpg' },
			cover: { url: 'mockImages/games/destiny/cover.jpg' },
			teaser: { url: 'mockImages/games/destiny/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/destiny/trailer-1.mp4',
				previewUrl: './mockImages/games/destiny/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/destiny/trailer-2.mp4',
				previewUrl: './mockImages/games/destiny/activity.jpg',
			},
		],
		package:{
			id: 'jwi',
			defaultDest: 'C:/TokenPlay/games/jwi',
			installSize: 56966400,
		},
	},
	{
		name: 'DragonBall Raging Blast 3',
		publisher: {
			name: 'RocketLeague',
		},
		images: {
			activity: { url: 'mockImages/games/dragon-ball-raging-blast/activity.jpg' },
			cover: { url: 'mockImages/games/dragon-ball-raging-blast/cover.jpg' },
			teaser: { url: 'mockImages/games/dragon-ball-raging-blast/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/dragon-ball-raging-blast/trailer-1.mp4',
				previewUrl: './mockImages/games/dragon-ball-raging-blast/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/dragon-ball-raging-blast/trailer-2.mp4',
				previewUrl: './mockImages/games/dragon-ball-raging-blast/activity.jpg',
			},
		],
		package:{
			id: 'wh',
			defaultDest: 'C:/TokenPlay/games/wh',
			installSize: 56966400,
		},
	},
	{
		name: 'Half Life 2',
		price: '3618900000000000',
		publisher: {
			name: 'Valve',
		},
		images: {
			activity: { url: 'mockImages/games/half-life-2/activity.jpg' },
			cover: { url: 'mockImages/games/half-life-2/cover.jpg' },
			teaser: { url: 'mockImages/games/half-life-2/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/half-life-2/trailer-1.mp4',
				previewUrl: './mockImages/games/half-life-2/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/half-life-2/trailer-2.mp4',
				previewUrl: './mockImages/games/half-life-2/activity.jpg',
			},
		],
		package:{
			id: 'hga',
			defaultDest: 'C:/TokenPlay/games/hga',
			installSize: 56966400,
		},
	},
	{
		name: 'Dota 2',
		publisher: {
			name: 'Valve',
		},
		images: {
			activity: { url: 'mockImages/games/dota-2/activity.jpg' },
			cover: { url: 'mockImages/games/dota-2/cover.jpg' },
			teaser: { url: 'mockImages/games/dota-2/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/dota-2/trailer-1.mp4',
				previewUrl: './mockImages/games/dota-2/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/dota-2/trailer-2.mp4',
				previewUrl: './mockImages/games/dota-2/activity.jpg',
			},
		],
		package:{
			id: 'tue',
			defaultDest: 'C:/TokenPlay/games/tue',
			installSize: 56966400,
		},
	},
	{
		// 8
		name: 'Resident Evil 6',
		publisher: {
			name: 'Capcom',
		},
		images: {
			activity: { url: 'mockImages/games/resident-evil-6/activity.jpg' },
			cover: { url: 'mockImages/games/resident-evil-6/cover.jpg' },
			teaser: { url: 'mockImages/games/resident-evil-6/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/resident-evil-6/trailer-1.mp4',
				previewUrl: './mockImages/games/resident-evil-6/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/resident-evil-2/trailer-2.mp4',
				previewUrl: './mockImages/games/resident-evil-6/activity.jpg',
			},
		],
		package:{
			id: 'ava',
			defaultDest: 'C:/TokenPlay/games/ava',
			installSize: 56966400,
		},
	},
	{
		name: "PlayerUnknown's Battlegrounds",
		publisher: {
			name: 'PUBG',
		},
		images: {
			activity: { url: 'mockImages/games/playerunknown-battleground/activity.jpg' },
			cover: { url: 'mockImages/games/playerunknown-battleground/cover.jpg' },
			teaser: { url: 'mockImages/games/playerunknown-battleground/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/playerunknown-battleground/trailer-1.mp4',
				previewUrl: './mockImages/games/playerunknown-battleground/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/playerunknown-battleground/trailer-2.mp4',
			},
		],
		package:{
			id: 'fth',
			defaultDest: 'C:/TokenPlay/games/fth',
			installSize: 56966400,
		},
	},
	{
		name: 'Hurtworld',
		publisher: {
			name: 'Bankroll Studios',
		},
		images: {
			activity: { url: 'mockImages/games/hurtworld/activity.jpg' },
			cover: { url: 'mockImages/games/hurtworld/cover.jpg' },
			teaser: { url: 'mockImages/games/hurtworld/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/hurtworld/trailer-1.mp4',
				previewUrl: './mockImages/games/hurtworld/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/hurtworld/trailer-2.mp4',
				previewUrl: './mockImages/games/hurtworld/activity.jpg',
			},
		],
		package:{
			id: 'cdhr',
			defaultDest: 'C:/TokenPlay/games/cdhr',
			installSize: 56966400,
		},
	},
	{
		name: 'Halo 5',
		publisher: {
			name: '343 Industries',
		},
		images: {
			activity: { url: 'mockImages/games/halo-5/activity.jpg' },
			cover: { url: 'mockImages/games/halo-5/cover.jpg' },
			teaser: { url: 'mockImages/games/halo-5/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/halo-5/trailer-1.mp4',
				previewUrl: './mockImages/games/halo-5/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/halo-5/trailer-2.mp4',
				previewUrl: './mockImages/games/halo-5/activity.jpg',
			},
		],
		package:{
			id: 'ret',
			defaultDest: 'C:/TokenPlay/games/ret',
			installSize: 56966400,
		},
	},
	{
		// 12
		name: 'Fallout 4',
		publisher: {
			name: '343 Industries',
		},
		images: {
			activity: { url: 'mockImages/games/fallout-4/activity.jpg' },
			cover: { url: 'mockImages/games/fallout-4/cover.jpg' },
			teaser: { url: 'mockImages/games/fallout-4/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/fallout-4/trailer-1.mp4',
				previewUrl: './mockImages/games/fallout-4/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/fallout-4/trailer-2.mp4',
				previewUrl: './mockImages/games/fallout-4/activity.jpg',
			},
		],
		package:{
			id: 'kbe',
			defaultDest: 'C:/TokenPlay/games/kbe',
			installSize: 56966400,
		},
	},
	{
		name: 'Call of Duty 4',
		publisher: {
			name: '343 Industries',
		},
		images: {
			activity: { url: 'mockImages/games/call-of-duty/activity.jpg' },
			cover: { url: 'mockImages/games/call-of-duty/cover.jpg' },
			teaser: { url: 'mockImages/games/call-of-duty/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/call-of-duty/trailer-1.mp4',
				previewUrl: './mockImages/games/call-of-duty/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/call-of-duty/trailer-2.mp4',
				previewUrl: './mockImages/games/call-of-duty/activity.jpg',
			},
		],
		package:{
			id: 'som',
			defaultDest: 'C:/TokenPlay/games/som',
			installSize: 5985973593,
		},
	},
	{
		name: 'Day of Defeat',
		publisher: {
			name: '343 Industries',
		},
		images: {
			activity: { url: 'mockImages/games/day-of-defeat/activity.jpg' },
			cover: { url: 'mockImages/games/day-of-defeat/cover.jpg' },
			teaser: { url: 'mockImages/games/day-of-defeat/store.jpg' },
		},
		medias: [
			{
				id: 'media1',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/day-of-defeat/trailer-1.mp4',
				previewUrl: './mockImages/games/day-of-defeat/activity.jpg',
			},
			{
				id: 'media2',
				title: 'Hunting Grounds Trailer for Episode 1',
				type: 'video',
				src: './mockImages/games/day-of-defeat/trailer-2.mp4',
				previewUrl: './mockImages/games/day-of-defeat/activity.jpg',
			},
		],
		package:{
			id: 'quake3',
			defaultDest: 'C:/TokenPlay/games/quake3',
			installSize: 5985973593,
		},
	},
].map((data, index) => ({
	id: `g_${index + 1}`,
	name: '[No name]',
	platforms: ['ios', 'android', 'pc'],
	price: '66180000000000000',
	rating: {
		numerator: 4,
		denominator: 5,
		populationSize: 12569,
	},
	description: 'Game description here',
	tokensEarned: 38501069,
	medias: [],
	images: {},
	publisher: {
		name: '[No publisher]',
	},
	package: {
		id: 'jwi',
		defaultDest: 'C:/TokenPlay/games/jwi',
		installSize: 454757100,
	},
	...data,
}));

const userGames = [
	{
		game: games[0],
		purchaseDate: Math.round(((new Date()).getTime() - (20 * oneDay)) / 1000),
	},
	{
		game: games[1],
		purchaseDate: Math.round(((new Date()).getTime() - (20 * oneDay)) / 1000),
	},
	{
		game: games[2],
		purchaseDate: Math.round(((new Date()).getTime() - (1000 * 60 * 5)) / 1000),
	},
	{
		game: games[3],
	},
].map((data) => ({
	purchaseDate: Math.round(((new Date()).getTime() - (2 * oneDay)) / 1000),
	...data,
}));

const friendRequests = [allUsers[5], allUsers[6]]
	.map((user, index) => ({
		id: `fr_${index + 1}`,
		date: Math.round((new Date()).getTime() / 1000),
		user,
	}));

const cart = {
	items: [
		{
			type: TokenItem.TYPE,
			quantity: (1e17).toString(),
		},
		{
			type: TokenItem.TYPE,
			quantity: (2.25e17).toString(),
		},
		{
			type: GameItem.TYPE,
			game: games[4],
		},
		{
			type: GameItem.TYPE,
			game: games[8],
		},
	].map((itemData, index) => ({
		id: `ci_${index}`,
		...itemData,
	})),
};

const storeCategories = [
	{
		name: 'root',
		featuredGames: [games[1], games[2], games[3]],
		sections: [
			{ id: 'games', title: 'Latest Games', games: [games[4], games[5], games[6]] },
			{ id: 'content', title: 'All games', games, display: 'grid' },
		],
	},
	{ name: 'Indie Games', featuredGames: [], sections: [] },
	{ name: 'Mobile Games', featuredGames: [], sections: [] },
	{ name: 'FP2 Games', featuredGames: [], sections: [] },
	{ name: 'Action Games', featuredGames: [], sections: [] },
].map((data, index) => ({
	id: `ec_${index}`,
	...data,
}));

// Assign categories
storeCategories[0].platformCategories = [
	{
		platform: 'ios',
		categories: [storeCategories[1], storeCategories[2], storeCategories[3], storeCategories[4]],
	},
	{
		platform: 'android',
		categories: [storeCategories[4], storeCategories[3], storeCategories[2], storeCategories[1]],
	},
	{
		platform: 'pc',
		categories: [storeCategories[3], storeCategories[1], storeCategories[4], storeCategories[2]],
	},
];

export default {
	currentUser: allUsers[0],
	users: allUsers,
	friends: [allUsers[1], allUsers[2], allUsers[3], allUsers[4]],
	conversations,
	friendRequests,
	games,
	userGames,
	cart,
	storeRootCategory: storeCategories[0],
};
