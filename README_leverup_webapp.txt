LeverUp 自动交易网页工具

文件：leverup_webapp.html

使用步骤：
1. 建议在该目录启动本地静态服务器：
   python3 -m http.server 8000
2. 浏览器打开：
   http://localhost:8000/leverup_webapp.html
3. 连接 MetaMask。
4. 页面会自动在浏览器本地生成一个隐藏的 Trader Agent，不需要输入任何私钥。
5. 点击“授权 Agent”，用 MetaMask 主钱包向 OneClickAgent 发送授权交易。
6. 确保 USDC 已授权给 LeverUp 合约。
7. 先用很小金额测试，再启用 Bot。

已实现：
- MetaMask 主钱包连接
- 页面本地隐藏 Trader Agent 生成 / 重置
- 用 MetaMask 直接发送 Trader Agent 授权 / 撤销交易
- 通过链上事件日志回读当前授权状态
- Monad Mainnet / Testnet 配置切换
- BTC / ETH / SOL 选择
- LeverUp 1CT 开仓 / 平仓请求
- 链上读取 getPositionsV2 持仓
- 简单 EMA + ATR 趋势策略
- 自动仓位 sizing 会按最大保证金和风险预算反推，而不是复用手动面板参数
- 手动开仓、刷新持仓、平仓
- Bot 启停、冷却、最大持仓时长、基础风控参数

注意：
- 真正的无人值守自动签名仍依赖浏览器本地保存的 Trader Agent 私钥；但页面不会要求你手动暴露或粘贴私钥。
- 如果你清空浏览器存储、换设备或重置本地 Agent，需要重新用 MetaMask 授权。
- 这不是收益保证工具，真实交易请自行承担风险。
