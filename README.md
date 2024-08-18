# Policy Management System

## Project Description

The Policy Management System is a Node.js application designed to handle various operations related to policy management. It features functionalities for uploading policy-related data from CSV or XLSX files into MongoDB, tracking CPU usage of the server, and scheduling messages to be inserted into the database at a specified time. 

## Project Features

- **Upload and Process Data**: Upload data files (CSV/XLSX) and process them to store information about agents, users, accounts, policies, and other related entities in MongoDB.
- **CPU Monitoring**: Track real-time CPU utilization of the Node.js server and restart the server if CPU usage exceeds 70%.
- **Scheduled Messages**: Schedule messages to be inserted into the database at a specific time.

## Low-Level Design (LLD)

### MongoDB Collections

1. **User**: Stores user information.
   - `firstName` (String)
   - `dob` (Date)
   - `address` (String)
   - `phone` (String)
   - `state` (String)
   - `zip` (String)
   - `email` (String)
   - `gender` (String)
   - `city` (String)

2. **Account**: Stores account information linked to users.
   - `accountName` (String)
   - `userId` (ObjectId, reference to User)

3. **Agent**: Stores agent information.
   - `name` (String)

4. **Carrier**: Stores carrier information.
   - `companyName` (String)

5. **LOB (Line of Business)**: Stores policy categories.
   - `categoryName` (String)

6. **Policy**: Stores policy information.
   - `policyNumber` (String)
   - `startDate` (Date)
   - `endDate` (Date)
   - `lobId` (ObjectId, reference to LOB)
   - `carrierId` (ObjectId, reference to Carrier)
   - `userId` (ObjectId, reference to User)

7. **Message**: Stores scheduled messages.
   - `message` (String)
   - `day` (Date)
   - `time` (String)

### File Structure

- `models/`: Contains Mongoose schemas for MongoDB collections.
  - `user.js`
  - `account.js`
  - `agent.js`
  - `carrier.js`
  - `lob.js`
  - `policy.js`
  - `message.js`
- `routes/`: Contains Express route handlers.
  - `upload.js`: Handles file uploads.
  - ![](https://github.com/laxmi124/policy_upload/blob/main/public/fileUpload.png)
  - `search.js`: Handles search operations by username.
  - ![](https://github.com/laxmi124/policy_upload/blob/main/public/serachBy_user.png)
  - `aggregate.js`: Handles aggregation operations.
  - ![](https://github.com/laxmi124/policy_upload/blob/main/public/aggregate.png)
  - `scheduleMessage.js`: Handles scheduling messages.
  - ![](https://github.com/laxmi124/policy_upload/blob/main/public/scheduleMessage.png)
- `workers/`: Contains worker threads for file processing.
  - `uploadWorker.js`
- `monitor.js`: Monitors CPU usage and restarts the server if usage exceeds 70%.
- `index.js`: Main entry point for the application.
- `.env`: Contains environment variables like `MONGO_URI` and `PORT`.

## Setup and Installation

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB server
- PM2 (for process management, optional but recommended)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/laxmi124/policy_upload.git
   cd policy_upload

2. **Navigate to the Project Directory**

    ```bash
    cd policy_upload
    ```

3. **Install Dependencies**

    ```bash
    npm install
    npm install -g pm2
    ```


4. **Create Environment Variables**

    Create a `.env` file in the root directory of the project with the following content:

    ```plaintext
    MONGO_URI=mongodb://localhost:27017/insurance
    PORT=8008
    ```

## Running the Project

### Development

To run the server in development mode with `nodemon`, use the following command:

```bash
nodemon index.js
```
To run the server with `pm2`, use the following command:

```bash
pm2 start index.js
pm2 logs
```
To check the list of `pm2`

```bash
pm2 list
```
