const { v4: uuid } = require("uuid");

class MockShippingProvider {
  async createShipment({ provider = "nova-poshta", cost }) {
    return {
      provider,
      cost,
      trackingNumber: uuid().split("-")[0],
      status: "PENDING",
      estimatedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  }
}

const getShippingProvider = () => new MockShippingProvider();

module.exports = { getShippingProvider };

