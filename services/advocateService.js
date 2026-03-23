const { v4: uuidv4 } = require('uuid');
const Advocate = require('../models/advocate');
const axios = require('axios');
const kafka = require('../utils/kafka');

async function generateAppNumber(tenantId) {
  try {
    const response = await axios.post(
      `${process.env.IDGEN_URL}/id/_generate`,
      {
        idRequests: [
          {
            key: "advocate.application",
            tenantId: tenantId
          }
        ]
      }
    );

    return response.data.idResponses[0].id;

  } catch (error) {
    // fallback (important for local testing)
    return `ADV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

exports.create = async (req) => {
  try {
    const data = req.Advocate;

    const applicationNumber = await generateAppNumber(data.tenantId);

    const advocate = new Advocate({
      id: uuidv4(),
      applicationNumber,
      name: data.name,
      mobileNumber: data.mobileNumber,
      email: data.email,
      status: "INITIATED",
      tenantId: data.tenantId
    });

    await advocate.save();

    // 🔥 Kafka Persister Simulation
    kafka.publish("save-advocate", {
      RequestInfo: req.RequestInfo,
      Advocate: advocate
    });

    return {
      ResponseInfo: req.RequestInfo,
      Advocate: advocate
    };

  } catch (err) {
    return {
      ResponseInfo: req.RequestInfo,
      Errors: [
        {
          code: "400",
          message: err.message
        }
      ]
    };
  }
};

exports.update = async (req) => {
  try {
    const data = req.Advocate;

    const advocate = await Advocate.findOne({ id: data.id });

    if (!advocate) {
      return {
        ResponseInfo: req.RequestInfo,
        Errors: [
          {
            code: "404",
            message: "Advocate not found"
          }
        ]
      };
    }

    if (data.name) advocate.name = data.name;
    if (data.mobileNumber) advocate.mobileNumber = data.mobileNumber;
    if (data.email) advocate.email = data.email;
    if (data.status) advocate.status = data.status;

    await advocate.save();

    // Kafka event
    kafka.publish("update-advocate", {
      RequestInfo: req.RequestInfo,
      Advocate: advocate
    });

    return {
      ResponseInfo: req.RequestInfo,
      Advocate: advocate
    };

  } catch (err) {
    return {
      ResponseInfo: req.RequestInfo,
      Errors: [
        {
          code: "400",
          message: err.message
        }
      ]
    };
  }
};

exports.search = async (req) => {
  try {
    const { mobileNumber } = req;

    let query = {};

    if (mobileNumber) {
      query.mobileNumber = mobileNumber;
    }

    const advocates = await Advocate.find(query).limit(50);

    return {
      ResponseInfo: req.RequestInfo,
      Advocates: advocates
    };

  } catch (err) {
    return {
      ResponseInfo: req.RequestInfo,
      Errors: [
        {
          code: "500",
          message: err.message
        }
      ]
    };
  }
};