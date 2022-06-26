const { dim, bold, yellow } = require('chalk');
var Distance = require('geo-distance');

const { fetchUsers, logUsers } = require('./user');
var Graph = require('./graph');

const calculateScore = (cruiser, customer) => {
	let score = 0;
	if (customer.averageRating >= cruiser.averageRating)
		score += 2;

	if (customer.numberOfRides <= 2 && cruiser.numberOfRides >= 3)
		score += 5;
	if (customer.numberOfRides > 2 && cruiser.numberOfRides < 3)
		score += 2;

	const distanceBetweenCruiserAndCustomer = Distance.between(
		{ lat: customer.lat, lon: customer.long },
		{ lat: cruiser.lat, lon: cruiser.long }
	);

	if (distanceBetweenCruiserAndCustomer <= Distance(' 3 km'))
		score += 7;
	else if (distanceBetweenCruiserAndCustomer <= Distance(' 5 km'))
		score += 3;

	return score;
};

const initCruiserAndCustomerGraph = (cruisers, customers) => {
	const graph = new Graph();
	cruisers.forEach((cruiser) => {
		graph.addVertex(cruiser.fullName);
		customers.forEach(customer => {
			graph.addVertex(customer.fullName);
			graph.addEdge(cruiser.fullName, [customer.fullName, calculateScore(cruiser, customer)]);
		});
	});
	return graph;
};

const findCustomer = (cruiser, cruiserAndCustomerGraph, alreadyMatchedCustomers) => {
	const customer = cruiserAndCustomerGraph.findMaxVertex(cruiser.fullName, alreadyMatchedCustomers);
	if (!customer)
		return null;
	return { fullName: customer[0], score: customer[1] };
};


const logMatchedCruisersAndCustomers = (matched, idleCustomer, idleCruiser) => {

	console.log(`${bold(yellow('============ Matched Cruisers And Customers =============='))}`);
	matched.map(({ CruiserName, CustomerName, score }) => {
		console.log(`${dim(`Customer Name:`)} ${bold(yellow(CustomerName))}`);
		console.log(`${dim(`Cruiser Name:`)} ${bold(yellow(CruiserName))}`);
		console.log(`${dim(`Score:`)} ${bold(yellow(score))}`);
		console.log();
	});

	console.log(`${bold(yellow('============ Idle customers =============='))}`);
	idleCustomer.length === 0 && console.log(`${dim(`No idle Customers`)}`);
	idleCustomer.map(({ id, fullName }) => {
		console.log(`${dim(`#${id}`)} ${bold(yellow(fullName))}`);
		console.log();
	});

	console.log(`${bold(yellow('============ Idle cruisers =============='))}`);
	idleCruiser.length === 0 && console.log(`${dim(`No idle Cruisers`)}`);
	idleCruiser.map(({ id, fullName }) => {
		console.log(`${dim(`#${id}`)} ${bold(yellow(fullName))}`);
		console.log();
	});

};
module.exports = async () => {
	const customers = await fetchUsers('CUSTOMER');
	const cruisers = await fetchUsers('CRUISER');
	const cruiserAndCustomerGraph = initCruiserAndCustomerGraph(cruisers, customers);


	const matchedCruisersAndCustomers = [];
	const alreadyMatchedCustomers = {};
	const alreadyMatchedCruisers = {};

	cruisers.forEach((cruiser) => {
		const customer = findCustomer(cruiser, cruiserAndCustomerGraph, alreadyMatchedCustomers);
		if (!customer)
			return;
		alreadyMatchedCustomers[customer.fullName] = true;
		alreadyMatchedCruisers[cruiser.fullName] = true;
		matchedCruisersAndCustomers.push({
			CustomerName: customer.fullName,
			CruiserName: cruiser.fullName,
			score: customer.score
		});
	});

	const idleCustomers = customers.filter((customer) => !alreadyMatchedCustomers[customer.fullName]);
	const idleCruisers = cruisers.filter((cruisers) => !alreadyMatchedCruisers[cruisers.fullName]);

	logMatchedCruisersAndCustomers(matchedCruisersAndCustomers, idleCustomers, idleCruisers);

};