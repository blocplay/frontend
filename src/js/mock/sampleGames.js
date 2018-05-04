import { observable } from 'mobx';
import MockObject from './MockObject';

let counter = 0;

const games = [
	{
		name: 'Deus Ex: Mankind Divided',
		publisher: 'Feral Interactive',
		medias: {
			activity: 'mockImages/games/deus-ex-mankind/activity.jpg',
			cover: 'mockImages/games/deus-ex-mankind/cover.jpg',
			store: 'mockImages/games/deus-ex-mankind/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/deus-ex-mankind/trailer-1.mp4',
					poster: './mockImages/games/deus-ex-mankind/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/deus-ex-mankind/trailer-2.mp4',
					poster: './mockImages/games/deus-ex-mankind/activity.jpg',
				},
			],
		},
	},
	{
		name: 'FIFA 18',
		publisher: 'Feral Interactive',
		medias: {
			activity: 'mockImages/games/fifa-18/activity.jpg',
			cover: 'mockImages/games/fifa-18/cover.jpg',
			store: 'mockImages/games/fifa-18/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/fifa-18/trailer-1.mp4',
					poster: './mockImages/games/fifa-18/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/fifa-18/trailer-2.mp4',
					poster: './mockImages/games/fifa-18/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Batman: Arkham City',
		publisher: 'Feral Interactive',
		medias: {
			activity: 'mockImages/games/batman-arkham-city/activity.jpg',
			cover: 'mockImages/games/batman-arkham-city/cover.jpg',
			store: 'mockImages/games/batman-arkham-city/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/batman-arkham-city/trailer-1.mp4',
					poster: './mockImages/games/batman-arkham-city/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/batman-arkham-city/trailer-2.mp4',
					poster: './mockImages/games/batman-arkham-city/activity.jpg',
				},
			],
		},
	},
	{
		name: 'StarCraft 2',
		publisher: 'Havok',
		medias: {
			activity: 'mockImages/games/starcraft-2/activity.jpg',
			cover: 'mockImages/games/starcraft-2/cover.jpg',
			store: 'mockImages/games/starcraft-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/starcraft-2/trailer-1.mp4',
					poster: './mockImages/games/starcraft-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/starcraft-2/trailer-2.mp4',
					poster: './mockImages/games/starcraft-2/activity.jpg',
				},
			],
		},
	},
	{
		// 4
		name: 'Destiny: Rise of Iron',
		publisher: 'Bungie',
		medias: {
			activity: 'mockImages/games/destiny/activity.jpg',
			cover: 'mockImages/games/destiny/cover.jpg',
			store: 'mockImages/games/destiny/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/destiny/trailer-1.mp4',
					poster: './mockImages/games/destiny/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/destiny/trailer-2.mp4',
					poster: './mockImages/games/destiny/activity.jpg',
				},
			],
		},
	},
	{
		name: 'DragonBall Raging Blast 3',
		publisher: 'RocketLeague',
		medias: {
			activity: 'mockImages/games/dragon-ball-raging-blast/activity.jpg',
			cover: 'mockImages/games/dragon-ball-raging-blast/cover.jpg',
			store: 'mockImages/games/dragon-ball-raging-blast/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/dragon-ball-raging-blast/trailer-1.mp4',
					poster: './mockImages/games/dragon-ball-raging-blast/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/dragon-ball-raging-blast/trailer-2.mp4',
					poster: './mockImages/games/dragon-ball-raging-blast/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Half Life 2',
		publisher: 'Valve',
		medias: {
			activity: 'mockImages/games/half-life-2/activity.jpg',
			cover: 'mockImages/games/half-life-2/cover.jpg',
			store: 'mockImages/games/half-life-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/half-life-2/trailer-1.mp4',
					poster: './mockImages/games/half-life-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/half-life-2/trailer-2.mp4',
					poster: './mockImages/games/half-life-2/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Dota 2',
		publisher: 'Valve',
		medias: {
			activity: 'mockImages/games/dota-2/activity.jpg',
			cover: 'mockImages/games/dota-2/cover.jpg',
			store: 'mockImages/games/dota-2/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/dota-2/trailer-1.mp4',
					poster: './mockImages/games/dota-2/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/dota-2/trailer-2.mp4',
					poster: './mockImages/games/dota-2/activity.jpg',
				},
			],
		},
	},
	{
		// 8
		name: 'Resident Evil 6',
		publisher: 'Capcom',
		medias: {
			activity: 'mockImages/games/resident-evil-6/activity.jpg',
			cover: 'mockImages/games/resident-evil-6/cover.jpg',
			store: 'mockImages/games/resident-evil-6/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/resident-evil-6/trailer-1.mp4',
					poster: './mockImages/games/resident-evil-6/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/resident-evil-2/trailer-2.mp4',
					poster: './mockImages/games/resident-evil-6/activity.jpg',
				},
			],
		},
	},
	{
		name: "PlayerUnknown's Battlegrounds",
		publisher: 'PUBG',
		medias: {
			activity: 'mockImages/games/playerunknown-battleground/activity.jpg',
			cover: 'mockImages/games/playerunknown-battleground/cover.jpg',
			store: 'mockImages/games/playerunknown-battleground/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/playerunknown-battleground/trailer-1.mp4',
					poster: './mockImages/games/playerunknown-battleground/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/playerunknown-battleground/trailer-2.mp4',
					poster: './mockImages/games/playerunknown-battleground/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Hurtworld',
		publisher: 'Bankroll Studios',
		medias: {
			activity: 'mockImages/games/hurtworld/activity.jpg',
			cover: 'mockImages/games/hurtworld/cover.jpg',
			store: 'mockImages/games/hurtworld/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/hurtworld/trailer-1.mp4',
					poster: './mockImages/games/hurtworld/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/hurtworld/trailer-2.mp4',
					poster: './mockImages/games/hurtworld/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Halo 5',
		publisher: '343 Industries',
		medias: {
			activity: 'mockImages/games/halo-5/activity.jpg',
			cover: 'mockImages/games/halo-5/cover.jpg',
			store: 'mockImages/games/halo-5/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/halo-5/trailer-1.mp4',
					poster: './mockImages/games/halo-5/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/halo-5/trailer-2.mp4',
					poster: './mockImages/games/halo-5/activity.jpg',
				},
			],
		},
	},
	{
		// 12
		name: 'Fallout 4',
		publisher: '343 Industries',
		medias: {
			activity: 'mockImages/games/fallout-4/activity.jpg',
			cover: 'mockImages/games/fallout-4/cover.jpg',
			store: 'mockImages/games/fallout-4/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/fallout-4/trailer-1.mp4',
					poster: './mockImages/games/fallout-4/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/fallout-4/trailer-2.mp4',
					poster: './mockImages/games/fallout-4/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Call of Duty 4',
		publisher: '343 Industries',
		medias: {
			activity: 'mockImages/games/call-of-duty/activity.jpg',
			cover: 'mockImages/games/call-of-duty/cover.jpg',
			store: 'mockImages/games/call-of-duty/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/call-of-duty/trailer-1.mp4',
					poster: './mockImages/games/call-of-duty/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/call-of-duty/trailer-2.mp4',
					poster: './mockImages/games/call-of-duty/activity.jpg',
				},
			],
		},
	},
	{
		name: 'Day of Defeat',
		publisher: '343 Industries',
		medias: {
			activity: 'mockImages/games/day-of-defeat/activity.jpg',
			cover: 'mockImages/games/day-of-defeat/cover.jpg',
			store: 'mockImages/games/day-of-defeat/store.jpg',
			shopMedias: [
				{
					id: 'media1',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/day-of-defeat/trailer-1.mp4',
					poster: './mockImages/games/day-of-defeat/activity.jpg',
				},
				{
					id: 'media2',
					name: 'Hunting Grounds Trailer for Episode 1',
					type: 'Video',
					src: './mockImages/games/day-of-defeat/trailer-2.mp4',
					poster: './mockImages/games/day-of-defeat/activity.jpg',
				},
			],
		},
	},
].map(
	game =>
		new MockObject({
			// eslint-disable-next-line no-plusplus
			id: `${counter++}`,
			tokensEarned: 38500000,
			numberOfRatings: 8200000,
			rating: 4,
			description: `
	<p>PLAYERUNKNOWN'S BATTLEGROUNDS is a last-man-standing shooter being developed with community feedback. Starting with nothing, players must fight to locate weapons and supplies in a battle to be the lone survivor. This realistic, high tension game is set on a massive 8x8 km island with a level of detail that showcases Unreal Engine 4's capabilities.</p> 

	<p>PLAYERUNKNOWN aka Brendan Greene, is a pioneer of the Battle Royale genre. As the creator of the Battle Royale game-mode found in the ARMA series and H1Z1 : King of the Kill, Greene is co-developing the game with veteran team at Bluehole to create the most diverse and robust Battle Royale experience to date.</p>
	`,
			nbLikes: 825,
			nbCommunities: 2600,
			nbStreaming: 123,
			nbVideos: 5000,
			nbCaptures: 228,
			tokenPrice: 250,
			platform: 'PC',
			// observable primitive, so use isCurrentUserFavourite.get() and isCurrentUserFavourite.set()
			isCurrentUserFavourite: observable(false),
			...game,
		})
);

export default games;

export function getGameById(id) {
	return games.find(game => game.id === id);
}
