'use strict';

const UPSTREAMS = {
  mainnet: {
    backendUrl: 'https://service.leverup.xyz',
    keeperUrl: 'https://oneclick-01-keeper.leverup.xyz'
  },
  testnet: {
    backendUrl: 'https://api-testnet.leverup.xyz',
    keeperUrl: 'https://oneclick-01-keeper.leverup.xyz'
  }
};

const REQUEST_TIMEOUT_MS = 30000;

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function getNetwork(req) {
  const raw = String(req.query?.network || req.headers['x-leverup-network'] || 'mainnet').toLowerCase();
  return raw === 'testnet' ? 'testnet' : 'mainnet';
}

function getUpstream(network) {
  return UPSTREAMS[network] || UPSTREAMS.mainnet;
}

function getBlockchain(req) {
  return String(req.query?.blockchain || 'MONAD').toUpperCase();
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function proxyRequest(res, { url, method = 'GET', body }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const upstreamRes = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal
    });
    const text = await upstreamRes.text();
    res.statusCode = upstreamRes.status;
    res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(text);
  } catch (error) {
    sendJson(res, 502, {
      message: 'Upstream request failed',
      details: error?.message || String(error)
    });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  getBlockchain,
  getNetwork,
  getUpstream,
  proxyRequest,
  readJsonBody,
  sendJson
};
