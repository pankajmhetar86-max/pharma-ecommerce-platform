const CDN = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color'

export const CRYPTO_COINS = [
  { value: 'eth', label: 'Ethereum', symbol: 'ETH', color: 'text-indigo-400', logo: `${CDN}/eth.svg` },
  { value: 'sol', label: 'Solana', symbol: 'SOL', color: 'text-purple-500', logo: `${CDN}/sol.svg` },
  { value: 'xrp', label: 'XRP', symbol: 'XRP', color: 'text-blue-500', logo: `${CDN}/xrp.svg` },
  { value: 'ltc', label: 'Litecoin', symbol: 'LTC', color: 'text-slate-400', logo: `${CDN}/ltc.svg` },
  { value: 'doge', label: 'Dogecoin', symbol: 'DOGE', color: 'text-yellow-500', logo: `${CDN}/doge.svg` },
  { value: 'btc', label: 'Bitcoin', symbol: 'BTC', color: 'text-orange-500', logo: `${CDN}/btc.svg` },
  { value: 'usdttrc20', label: 'USDT (Tron)', symbol: 'USDT', color: 'text-green-500', logo: `${CDN}/usdt.svg` },
] as const

export type CryptoCoin = (typeof CRYPTO_COINS)[number]
