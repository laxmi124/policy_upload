require('dotenv').config();
const { parentPort, workerData } = require('node:worker_threads');
const csv = require('csvtojson');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const Agent = require('../models/agent');
const User = require('../models/user');
const Account = require('../models/account');
const LOB = require('../models/lob');
const Carrier = require('../models/carrier');
const Policy = require('../models/policy');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const processFile = async () => {
    try {
        let jsonData = [];
        if (workerData.fileType === 'text/csv') {
            jsonData = await csv().fromFile(workerData.filePath);
        } else if (workerData.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const workbook = xlsx.readFile(workerData.filePath);
            const sheetName = workbook.SheetNames[0];
            jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }

        for (const data of jsonData) {
            const agent = new Agent({ name: data.agent });
            const savedAgent = await agent.save();

            const user = new User({
                firstName: data.firstname,
                dob: new Date(data.dob),
                address: data.address,
                phone: data.phone,
                state: data.state,
                zip: data.zip,
                email: data.email,
                gender: data.gender,
                city: data.city
            });
            const savedUser = await user.save();
            const account = new Account({ accountName: data.account_name, userId : user._id });
            await account.save();

            const lob = new LOB({ categoryName: data.category_name });
            await lob.save();

            const carrier = new Carrier({ companyName: data.company_name });
            await carrier.save();

            const policy = new Policy({
                policyNumber: data.policy_number,
                startDate: new Date(data.policy_start_date),
                endDate: new Date(data.policy_end_date),
                lobId: lob._id,
                carrierId: carrier._id,
                userId: savedUser._id
            });
            await policy.save();
        }

        parentPort.postMessage('File processed successfully.');
    } catch (error) {
        parentPort.postMessage(`Error processing file: ${error.message}`);
    }
};

processFile();
