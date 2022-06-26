const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	customer: { desc: `Show existing list of customers` },
	cruiser: { desc: `Show existing list of cruisers` },
	match: {
		desc: `- Show each customer and assigned driver
- List of failed fulfilment customers if any exists.
- List of idle drivers if any exist.`
	},
	manual: { desc: `To see all the option` }
};

const helpText = meowHelp({
	name: `con-cruise`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
