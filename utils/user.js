const ora = require('ora');
const axios = require('axios');
const { dim, bold, yellow } = require('chalk');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');

const spinner = ora({ text: '' });
const apiURL = `http://localhost:3000/users`;

module.exports = {

	fetchUsers: async (userRole) => {
		spinner.start(dim(`Fetching ${userRole}…`));
		const [err, res] = await to(axios.get(userRole? `${apiURL}?role=${userRole}`: apiURL));
		handleError(`API CALL FAILED`, err, true, true);

		const users = res.data.map(({ id, fullName, lat, long, numberOfRides , averageRating, role}) => {
			return {
				id,
				fullName,
				lat,
				long,
				numberOfRides,
				averageRating,
				role
			};
		});
		spinner.stop();
		return users;
	},
	logUsers: (users)=>{
		users.map(({ id, fullName, lat, long, numberOfRides , averageRating, role }) => {
			console.log(`${dim(`#${id}`)} ${bold(yellow(fullName))}`);
			console.log(`${dim(`Lat:`)} ${bold(lat)}`);
			console.log(`${dim(`Long:`)} ${bold(long)}`);
			console.log(`${dim(`Number of Rides:`)} ${bold(numberOfRides)}`);
			console.log(`${dim(`Average rate:`)} ${bold(averageRating)}`);
			console.log(`${dim(`Role:`)} ${bold(role)}`);
			console.log();
			console.log();
		});
	}

};