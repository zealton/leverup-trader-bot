'use strict';

const {
  getNetwork,
  getUpstream,
  proxyRequest,
  sendJson
} = require('../_lib/proxy');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  const inputHash = String(req.query?.inputHash || '');
  if (!inputHash) {
    sendJson(res, 400, { message: 'inputHash is required' });
    return;
  }

  const network = getNetwork(req);
  const { keeperUrl } = getUpstream(network);
  await proxyRequest(res, {
    url: `${keeperUrl}/v1/trading/${encodeURIComponent(inputHash)}/status`,
    method: 'GET'
  });
};
