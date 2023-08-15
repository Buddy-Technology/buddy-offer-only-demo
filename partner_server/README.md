# Partner Server

## Overview
Partner Server acts as a mock downstream distributor's partner server, specifically designed for internal developers and demo purposes. It's built with JavaScript using Node.js and is designed to run as a Lambda function.

## Prerequisites

- Node.js (at least v18)
- [Serverless Framework](https://www.serverless.com/) installed globally.
- AWS permissions (specific permissions should be provided by the admin).
- [Yarn package manager](https://yarnpkg.com/)
- Grab the env.yml file from Google Drive hidden files and drop it into this directory once cloned

## Setup & Installation

1. **Clone the Demo Repository (if not already done)**:  
   ```
   git clone https://github.com/Buddy-Technology/demo
   ```

2. **Navigate to the Project Directory**:  
   ```
   cd demo/partner_server
   ```

3. **Install Dependencies**:  
   ```
   yarn
   ```

4. **Run Locally**:  
   ```
   yarn dev
   ```

## Usage

### Endpoint Details

- **Route**: `http://localhost:3210/api`
- **HTTP Method**: POST
- **Payload**: 
   - `ticketPrice`: Price of the ticket in pennies.
   - `token`: Initial stripe token from the front end.
   - `insurancePayload`: Object, provided by the offer-element.

   Example:
   ```
   {
     "ticketPrice": 1000,
     "token": "tok_123456789",
     "insurancePayload": {
        "customer": {
            "firstName": "David",
            "lastName": "Buddy"
        },
        "policy": {
            "offering": "TEST_ION",
            "premiumTotal": 1000
        }
    }
   }
   ```

- For easy testing, an updated POSTman collection is available in the Buddy workspace.

## Error Handling

If an error occurs during a request, the server will respond with the relevant HTTP status code accompanied by a `message` property detailing the nature of the error.

## Shutdown

To stop the server when running locally, simply terminate the process in your terminal (typically `CTRL+C`).

## Additional Information

As of now, no additional information or known limitations. For any questions or issues, please reach out to the repository maintainer or team lead.
