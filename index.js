#!/usr/bin/env node

/**
 * con-cruise-cli
 * Cli to achieve the best demand fulfillment
 *
 * @author Irfan Ali <none>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const { fetchUsers, logUsers } = require('./utils/user');
const matchUsers = require('./utils/match');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`manual`) && cli.showHelp(0);

	if (input.includes(`customer`)) {
		const users = await fetchUsers('CUSTOMER');
		logUsers(users);
	}
	if (input.includes(`cruiser`)) {
		const users = await fetchUsers('CRUISER');
		logUsers(users);
	}

	input.includes('match') && (await matchUsers());


	debug && log(flags);
})();
