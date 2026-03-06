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

  const address = String(req.query?.address || '');
  if (!address) {
    sendJson(res, 400, { message: 'address is required' });
    return;
  }

  const page = String(req.query?.page || '0');
  const size = String(req.query?.size || '100');
  const blockChain = String(req.query?.block_chain || 'MONAD').toUpperCase();
  const network = getNetwork(req);
  const { backendUrl } = getUpstream(network);
  const params = new URLSearchParams({
    page,
    size,
    block_chain: blockChain
  });

  await proxyRequest(res, {
    url: `${backendUrl}/v1/user/${encodeURIComponent(address)}/trade/history?${params.toString()}`,
    method: 'GET'
  });
};
