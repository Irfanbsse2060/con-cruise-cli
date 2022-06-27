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
	const cruiserGraph = new Graph();
	const customerGraph = new Graph();
	cruisers.forEach((cruiser) => {
		cruiserGraph.addVertex(cruiser.fullName);
		customers.forEach(customer => {
			customerGraph.addVertex(customer.fullName);
			cruiserGraph.addEdge(cruiser.fullName, [customer.fullName, calculateScore(cruiser, customer)]);
			customerGraph.addEdge(customer.fullName, [cruiser.fullName, calculateScore(cruiser, customer)]);
		});
	});

	return [cruiserGraph, customerGraph];
};

const findCustomer = (cruiser, cruiserGraph, customerGraph, alreadyMatchedCustomers) => {
	let excludeUsers = {...alreadyMatchedCustomers}

	while(true)
	{
		let matchedCustomer = cruiserGraph.findMaxVertex(cruiser, excludeUsers)
		if(!matchedCustomer)
			return null;

		const matchedDriver = customerGraph.findMaxVertex(matchedCustomer[0], excludeUsers)


		if(matchedDriver[0]!== cruiser)
		{
			excludeUsers[matchedCustomer[0]] = true
			excludeUsers[matchedDriver[0]] = true
		}
		else {
			return  { fullName: matchedCustomer[0], score: matchedCustomer[1] }
		}
	}

};


const logMatchedCruisersAndCustomers = (matched, idleCustomer, idleCruiser) => {

	console.log(`${bold(yellow('============ Matched Cruisers And Customers =============='))}`);
	matched.map(({ CruiserName, CustomerName, score }) => {
		console.log(`${dim(`Customer Name:`)} ${bold(yellow(CustomerName))}`);
		console.log(`${dim(`Cruiser Name:`)} ${bold(yellow(CruiserName))}`);
		console.log(`${dim(`Score:`)} ${bold(yellow(score))}`);
		console.log();
	});
	console.log();

	console.log(`${bold(yellow('============ Idle customers =============='))}`);
	idleCustomer.length === 0 && console.log(`${dim(`No idle Customers`)}`);
	idleCustomer.map(({ id, fullName }) => {
		console.log(`${dim(`#${id}`)} ${bold(yellow(fullName))}`);
		console.log();
	});
	console.log();

	console.log(`${bold(yellow('============ Idle cruisers =============='))}`);
	idleCruiser.length === 0 && console.log(`${dim(`No idle Cruisers`)}`);
	idleCruiser.map(({ id, fullName }) => {
		console.log(`${dim(`#${id}`)} ${bold(yellow(fullName))}`);
		console.log();
	});
	console.log();

};


module.exports = async () => {
	const customers = await fetchUsers('CUSTOMER');
	const cruisers = await fetchUsers('CRUISER');
	const [cruiserGraph, customerGraph] = initCruiserAndCustomerGraph(cruisers, customers);


	const matchedCruisersAndCustomers = [];
	const alreadyMatchedUsers = {};

	cruisers.forEach((cruiser) => {
		const customer = findCustomer(cruiser.fullName, cruiserGraph, customerGraph, alreadyMatchedUsers);
		if (!customer)
			return;
		alreadyMatchedUsers[customer.fullName] = true;
		alreadyMatchedUsers[cruiser.fullName] = true;
		matchedCruisersAndCustomers.push({
			CustomerName: customer.fullName,
			CruiserName: cruiser.fullName,
			score: customer.score
		});
	});

	const idleCustomers = customers.filter((customer) => !alreadyMatchedUsers[customer.fullName]);
	const idleCruisers = cruisers.filter((cruisers) => !alreadyMatchedUsers[cruisers.fullName]);

	logMatchedCruisersAndCustomers(matchedCruisersAndCustomers, idleCustomers, idleCruisers);

};