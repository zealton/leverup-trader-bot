'use strict';

const {
  getBlockchain,
  getNetwork,
  getUpstream,
  proxyRequest,
  readJsonBody,
  sendJson
} = require('../_lib/proxy');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const network = getNetwork(req);
    const blockchain = getBlockchain(req);
    const { keeperUrl } = getUpstream(network);
    await proxyRequest(res, {
      url: `${keeperUrl}/v1/trading/send-close-position?blockchain=${encodeURIComponent(blockchain)}`,
      method: 'POST',
      body
    });
  } catch (error) {
    sendJson(res, 400, {
      message: 'Invalid close-position payload',
      details: error?.message || String(error)
    });
  }
};
