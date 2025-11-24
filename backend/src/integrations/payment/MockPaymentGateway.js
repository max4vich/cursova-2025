const { v4: uuid } = require("uuid");

class MockPaymentGateway {
  async charge({ amount, provider = "mock", currency = "UAH" }) {
    return {
      status: "PAID",
      provider,
      amount,
      currency,
      transactionId: uuid(),
      paidAt: new Date(),
    };
  }
}

const getPaymentGateway = () => new MockPaymentGateway();

module.exports = { getPaymentGateway };

