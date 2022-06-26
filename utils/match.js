
const { fetchUsers, logUsers } = require('./user')

const findCustomer = (cruiser, customers)=>{
	let maxScore = 0
	let selectedCustomer= null
	customers.forEach((customer)=> {
		let score = 0
		if(customer.averageRating>= cruiser.averageRating)
			score += 2

		if(customer.numberOfRides<= 2 && cruiser.numberOfRides>=3)
			score += 5
		if(customer.numberOfRides > 2 && cruiser.numberOfRides<3)
			score += 2

		if(!selectedCustomer)
		{
			selectedCustomer = customer
			maxScore = score
		}

		if(maxScore>score)
		{
			selectedCustomer= customer
			maxScore= score
		}

	})
}

module.exports = async () => {
	const customers = await fetchUsers('CUSTOMER')
	const cruisers = await fetchUsers('CRUISER')

	const matchedCruisersAndCustomers = []
	const failedCustomers = []
	const idleDrivers = []

	cruisers.forEach((cruiser)=>{
		const customer = findCustomer(cruiser)
		matchedCruisersAndCustomers.push({
			CustomerName: customer.fullName,
			CruiserName: cruiser.fullName
		})




	})






};