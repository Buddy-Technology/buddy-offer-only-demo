'use strict';

const Stripe = require('stripe');

// grab the info we need from the environment
const {
	PLATFORM_STRIPE_TOKEN,
	CONNECTED_BUDDY_ACCOUNT_ID,
} = process.env;

const stripe = Stripe(PLATFORM_STRIPE_TOKEN);

// CORS HELPER
const corsHelper = (obj) => Object.assign(obj, { headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': true,
}});

// Assuming you have these functions defined elsewhere or you'll define them later.
async function doAllTheCharges(ticketPriceInPennies, token, connectedAccountId) {
	try {
		// 1. Create a customer on the platform using the token
		const platformCustomer = await stripe.customers.create({
				source: token
		});

		// Charge the customer on the platform
		const platformCharge = await stripe.charges.create({
				amount: ticketPriceInPennies,
				currency: 'usd',
				customer: platformCustomer.id,
				description: 'Platform charge',
		});

		console.log('Platform charge complete with id:', platformCharge.id);

		// 2. Share the card with the connected account
		const sharedCardToken = await stripe.tokens.create({
				customer: platformCustomer.id
		}, {
				stripeAccount: connectedAccountId
		});

		// 3. Return the shared token
		return sharedCardToken.id;
} catch (error) {
		console.error('Error:', error.message);
		return null;
}
}

async function callBuddy(insurancePayload, sharedToken) {
	// THIS IS JUST MOCKED FOR CONVENIENCE

	// 1. use the shared token to add the payment information to the insurance payload
	const finalInsurancePayload = {
		...insurancePayload,
		payment: {
			type: 'TOKEN',
			gateway: 'STRIPE',
			token: sharedToken,
		}
	};

	// 2. send finalInsurancePayload to buddy-api (which we skip for mocking sake) and get the response
	const response = {
		ok: true,
		order: 'o-12345678',
	};

	// 3. breakout the order number
	const { order: buddyOrderId } = response;

	// 4. return
	return buddyOrderId;
}

module.exports = {
	api: async (event) => {
		// make sure there is a body on the event
		if (!event.body) {
			return corsHelper({
				statusCode: 400,
				body: JSON.stringify({ message: 'You need to send a JSON payload.' }),
			});
		}
		// Parse the incoming body (assuming the payload is in JSON format)
		const { ticketPrice, token, insurancePayload } = JSON.parse(event.body);

		if (ticketPrice === undefined || token === undefined || insurancePayload === undefined) {
			return corsHelper({
				statusCode: 400,
				body: JSON.stringify({ message: 'Incomplete payload provided.' }),
			});
		}

		// now do the charge work and the buddy api call
		try {
			const chargeResultToken = await doAllTheCharges(ticketPrice, token, CONNECTED_BUDDY_ACCOUNT_ID);

			const insuranceOrderId = await callBuddy(insurancePayload, chargeResultToken);

			return corsHelper({
				statusCode: 200,
				body: JSON.stringify({ message: 'Operation successful', insuranceOrderId }),
			});
		} catch (error) {
			console.error('Error processing the request:', error);
			return corsHelper({
				statusCode: 500,
				body: JSON.stringify({ message: 'Internal server error' }),
			});
		}
	}
}
