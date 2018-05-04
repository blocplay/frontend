/* eslint-disable no-plusplus */
import { sample } from 'underscore';
import MockObject from './MockObject';

let counter = 0;

const usersData = [
	{
		username: 'Johnny12',
		displayName: 'Stephan Tunison',
		online: true,
		status: 'Playing Destiny',
		avatar: 'mockImages/user/profile-avatar.jpg',
	},
	{
		username: 'Matthew_ts',
		displayName: 'Gerry Audet',
		online: true,
		status: 'Playing World of Warcraft',
		avatar: 'mockImages/user/profile-avatar-2.jpg',
	},
	{
		username: 'JamesShark',
		displayName: 'Martin Vaquera',
		online: false,
		avatar: 'mockImages/user/profile-avatar-3.jpg',
	},
	{
		username: 'MarkH',
		displayName: 'Derick Quinonez',
		online: false,
		avatar: 'mockImages/user/profile-avatar-4.jpg',
	},
	{
		username: 'Obi180',
		displayName: 'Alonzo Cobb',
		online: true,
		avatar: 'mockImages/user/profile-avatar-6.jpg',
	},
	{
		username: 'BB_Bounc3',
		displayName: 'Donnie Damelio',
		online: true,
		avatar: 'mockImages/user/profile-avatar-7.jpg',
	},
	{
		username: 'GGStylez',
		displayName: 'Melany Bob',
		online: false,
		avatar: 'mockImages/user/profile-avatar.jpg',
	},
	{
		username: 'BMX182',
		displayName: 'Kaye Benningfield',
		online: false,
		avatar: 'mockImages/user/profile-avatar-2.jpg',
	},
	{
		username: 'F84l1ty',
		displayName: 'Mirella Schlager',
		online: false,
		avatar: 'mockImages/user/profile-avatar-3.jpg',
	},
	{
		username: 'Ca$H',
		displayName: 'Ronna Streets',
		online: true,
		avatar: 'mockImages/user/profile-avatar-4.jpg',
	},
	{
		username: 'MarkyMark',
		displayName: 'Sharita Vickery',
		online: false,
		avatar: 'mockImages/user/profile-avatar-6.jpg',
	},
	{
		username: 'James_cassidy',
		displayName: 'Josef Oakes',
		online: true,
		status: 'Playing Half-Life 2',
		avatar: 'mockImages/user/profile-avatar-7.jpg',
	},
];

const users = usersData.map(user => {
	const data = {
		id: `${counter++}`,
		displayName: 'Jason Blake',
		tokenBalance: 25200,
		language: 'en',
		motto: 'Make Video games great again!',
		friends: [], // See below
		...user,
	};

	return new MockObject(data);
});

// Make friends
users.forEach((user) => {
	user.friends = sample(users, 5).filter(u => u !== user);
});

export default users;

export function getUserById(id) {
	return users.find(user => user.id === id);
}
