import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
const octopusTexture = 'https://qclay.design/lovable/kraken/tickers-octopus-texture.webp'
const arrowRightChunky = 'https://qclay.design/lovable/kraken/tickers-arrow-right-chunky.svg'
const arrowLeftChunky = 'https://qclay.design/lovable/kraken/tickers-arrow-left-chunky.svg'
const swapIcon = 'https://qclay.design/lovable/kraken/tickers-swap-icon.svg'
const chevronDown = 'https://qclay.design/lovable/kraken/tickers-chevron-down.svg'
import { popIn, AnimatedLines, DrumText, ScrambleText } from '../lib/animations'
import DotMatrix, { type DotMatrixCrop } from '../lib/DotMatrix'
import TickerCells, { type CellRect } from './TickerCells'

const TEXT_STEP = 0.03

function CountUpNumber({
  value,
  decimals = 0,
  isInView,
  delay = 0,
  duration = 1,
  className,
  style,
}: {
  value: number
  decimals?: number
  isInView: boolean
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  const prevValue = useRef(value)

  useEffect(() => {
    if (!isInView) return
    if (!started.current) {
      started.current = true
      prevValue.current = value
      const controls = animate(0, value, {
        duration,
        delay,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(v),
      })
      return () => controls.stop()
    }
    if (prevValue.current !== value) {
      const from = prevValue.current
      prevValue.current = value
      const controls = animate(from, value, {
        duration: 0.4,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(v),
      })
      return () => controls.stop()
    }
  }, [isInView, value, duration, delay])

  return (
    <span className={className} style={style}>
      {display.toFixed(decimals)}
    </span>
  )
}

const DESIGN_WIDTH = 1545
const DESIGN_HEIGHT = 922

function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setScale(width / designWidth)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth])

  return { ref, scale }
}

function useFitScaleAuto(designWidth: number) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [naturalHeight, setNaturalHeight] = useState(0)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setScale(width / designWidth)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth])

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height) setNaturalHeight(height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { outerRef, innerRef, scale, naturalHeight }
}

const MOBILE_DESIGN_WIDTH = 420

function MobileCoinChip({
  label,
  isSelected,
  onSelect,
}: {
  label: string
  isSelected?: boolean
  onSelect?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`whitespace-nowrap px-[9px] py-[6px] text-[12px] font-medium transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border border-[#70B6FF] bg-[#044AB3] text-white shadow-[0_0_12px_rgba(4,74,179,0.5)]'
          : 'border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
      }`}
      style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.36px' }}
    >
      <span className="flex items-center gap-[4px]">
        {isSelected && <span className="h-[4px] w-[4px] rounded-full bg-[#70B6FF] animate-pulse" />}
        {label}
      </span>
    </button>
  )
}

const vLines = [117, 243, 369, 495, 622, 748, 873, 1000, 1126, 1252, 1378]
const hLines = [0, 114.5, 229, 343.5, 458, 572.5, 687, 801.5, 916]

const coinLabels = [
  { label: 'NVDA', x: 218, y: 103 },
  { label: 'AAPL', x: 733, y: 103 },
  { label: 'MSFT', x: 1100, y: 103 },
  { label: 'TSLA', x: 1495, y: 103 },
  { label: 'AMZN', x: 353, y: 217 },
  { label: 'GOOGL', x: 988, y: 217 },
  { label: 'META', x: 1362, y: 217 },
  { label: 'AMD', x: 344, y: 561 },
  { label: 'SPY', x: 102, y: 677 },
  { label: 'QQQ', x: 1235, y: 677 },
  { label: 'PLTR', x: 723, y: 790 },
  { label: 'AVGO', x: 1111, y: 790 },
]

const textureTiles: { x: number; y: number; crop: DotMatrixCrop; flipX?: boolean }[] = [
  { x: 1127.1, y: 229.8, crop: { x: 190, y: 20, w: 260, h: 236 } },
  { x: 370, y: 1, crop: { x: 20, y: 250, w: 230, h: 208 }, flipX: true },
  { x: 244, y: 688, crop: { x: 0, y: 360, w: 225, h: 204 } },
  { x: 1379, y: 802.5, crop: { x: 225, y: 300, w: 225, h: 204 } },
]

const TEXTURE_TILE_WIDTH = 125.38
const TEXTURE_TILE_HEIGHT = 113.6

const CELL_COL_EDGES = [0, ...vLines, DESIGN_WIDTH]
const CELL_BLOCKED: CellRect[] = [
  { x: 513, y: 258, w: 486, h: 385 },
  ...textureTiles.map((t) => ({ x: t.x, y: t.y, w: TEXTURE_TILE_WIDTH, h: TEXTURE_TILE_HEIGHT })),
]

const BLIND_ROWS = 4
const BLIND_COLOR = '#08090b'

function ImageBlinds({
  left,
  top,
  width,
  height,
  isInView,
  baseDelay = 0,
  leftExtraBleed = 0,
  rightExtraBleed = 0,
  bottomExtraBleed = 0,
}: {
  left: number
  top: number
  width: number
  height: number
  isInView: boolean
  baseDelay?: number
  leftExtraBleed?: number
  rightExtraBleed?: number
  bottomExtraBleed?: number
}) {
  const rowHeight = height / BLIND_ROWS
  return (
    <>
      {Array.from({ length: BLIND_ROWS }).map((_, i) => {
        const isFirst = i === 0
        const isLast = i === BLIND_ROWS - 1
        const rowTop = top + i * rowHeight + (isFirst ? 1 : -1)
        const rowBottom = top + (i + 1) * rowHeight + (isLast ? -1 + bottomExtraBleed : 1)
        const rowLeft = left + 1 - leftExtraBleed
        const rowRight = left + width - 1 + rightExtraBleed
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: rowLeft,
              top: rowTop,
              width: rowRight - rowLeft,
              height: rowBottom - rowTop,
              backgroundColor: BLIND_COLOR,
              transformOrigin: 'bottom',
            }}
            initial={{ scaleY: 1 }}
            animate={isInView ? { scaleY: 0 } : undefined}
            transition={{ duration: 0.5, delay: baseDelay + i * 0.12, ease: 'easeOut' }}
          />
        )
      })}
    </>
  )
}

const sparkleDotsLeft = [
  { x: 508, y: 578, s: 2 },
  { x: 523, y: 615, s: 1 },
  { x: 548, y: 596, s: 1 },
  { x: 562, y: 582, s: 1 },
  { x: 562, y: 621, s: 1 },
  { x: 580, y: 601, s: 1 },
  { x: 601, y: 610, s: 1 },
  { x: 621, y: 599, s: 1 },
  { x: 605, y: 583, s: 1 },
  { x: 621, y: 628, s: 1 },
  { x: 647, y: 577, s: 1 },
]
const sparkleDotsRight = sparkleDotsLeft.map((d) => ({ ...d, x: d.x + 154 }))

function CoinLabel({
  label,
  x,
  y,
  isInView,
  delay = 0,
  isSelected,
  onSelect,
}: {
  label: string
  x: number
  y: number
  isInView: boolean
  delay?: number
  isSelected?: boolean
  onSelect?: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={`absolute whitespace-nowrap px-[9px] py-[6px] text-[12px] font-medium transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#044AB3] text-white border border-[#70B6FF] shadow-[0_0_12px_rgba(4,74,179,0.5)]'
          : 'bg-[#08090b] text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
      }`}
      style={{ left: x, top: y, fontFamily: 'var(--font-display)', letterSpacing: '-0.36px' }}
      {...popIn(isInView, delay)}
    >
      <span className="flex items-center gap-[5px]">
        {isSelected && <span className="h-[5px] w-[5px] rounded-full bg-[#70B6FF] animate-pulse" />}
        {label}
      </span>
    </motion.button>
  )
}

const mobileChipLabels = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'META', 'AMD', 'PLTR']

const ALL_AVAILABLE_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'AMD', name: 'AMD' },
  { symbol: 'SPY', name: 'S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ' },
  { symbol: 'PLTR', name: 'Palantir' },
  { symbol: 'AVGO', name: 'Broadcom' },
]

const SWAP_ICON_HOVER =
  'transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-180 group-active:scale-90'

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const COIN_HOLD_MS = 2600
const CODE_HOLD_MS = 1400

function randomCode(length: number) {
  let out = ''
  for (let i = 0; i < length; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return out
}

function useCoinCodeCycle(coin: string) {
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    setCode(null)
    let timer = 0
    const showCoin = () => {
      setCode(null)
      timer = window.setTimeout(showCode, COIN_HOLD_MS)
    }
    const showCode = () => {
      setCode(randomCode(coin.length))
      timer = window.setTimeout(showCoin, CODE_HOLD_MS)
    }
    timer = window.setTimeout(showCode, COIN_HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [coin])

  return code ?? coin
}

function SideCoinLabel({ coin }: { coin: string }) {
  const [hovering, setHovering] = useState(false)
  const text = useCoinCodeCycle(coin)

  return (
    <span
      className="text-[64px] font-medium text-white"
      style={{ fontFamily: 'var(--font-display)', letterSpacing: '-1.92px' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <ScrambleText text={text} trigger={hovering} duration={600} />
    </span>
  )
}

interface StockQuote {
  ticker: string
  price: number
  high: number
  low: number
  volumeFormatted: string
  change: number
  changePercent: number
}

interface PredictionResult {
  report: string
  recommendation: 'BUY' | 'HOLD' | 'SELL'
  confidence: number
  primaryStock: {
    ticker: string
    price: number
    high: number
    low: number
    volume: string
    changePercent: number
  }
}

// Default baseline estimates until live Polygon data responds
const DEFAULT_STOCK_ESTIMATES: Record<string, StockQuote> = {
  NVDA: { ticker: 'NVDA', price: 237.47, high: 239.08, low: 236.38, volumeFormatted: '81.8M', change: 1.85, changePercent: 0.78 },
  AAPL: { ticker: 'AAPL', price: 336.67, high: 338.67, low: 332.78, volumeFormatted: '34.1M', change: -0.29, changePercent: -0.09 },
  MSFT: { ticker: 'MSFT', price: 529.76, high: 531.73, low: 524.69, volumeFormatted: '16.8M', change: 2.1, changePercent: 0.4 },
  TSLA: { ticker: 'TSLA', price: 377.81, high: 382.35, low: 374.43, volumeFormatted: '25.6M', change: -1.2, changePercent: -0.32 },
  AMZN: { ticker: 'AMZN', price: 212.5, high: 215.1, low: 210.8, volumeFormatted: '38.2M', change: 1.4, changePercent: 0.66 },
  GOOGL: { ticker: 'GOOGL', price: 188.3, high: 190.5, low: 186.7, volumeFormatted: '22.4M', change: -0.8, changePercent: -0.42 },
  META: { ticker: 'META', price: 624.1, high: 629.4, low: 618.5, volumeFormatted: '14.5M', change: 3.5, changePercent: 0.56 },
  AMD: { ticker: 'AMD', price: 162.8, high: 165.2, low: 160.4, volumeFormatted: '45.1M', change: 2.2, changePercent: 1.37 },
  SPY: { ticker: 'SPY', price: 592.4, high: 594.1, low: 590.2, volumeFormatted: '62.0M', change: 0.9, changePercent: 0.15 },
  QQQ: { ticker: 'QQQ', price: 512.6, high: 515.0, low: 510.4, volumeFormatted: '41.8M', change: 1.1, changePercent: 0.21 },
  PLTR: { ticker: 'PLTR', price: 68.4, high: 70.1, low: 67.2, volumeFormatted: '73.5M', change: 4.1, changePercent: 6.38 },
  AVGO: { ticker: 'AVGO', price: 184.2, high: 187.0, low: 182.1, volumeFormatted: '19.2M', change: 1.6, changePercent: 0.88 },
}

function CoinMenu({
  options,
  onPick,
  width,
}: {
  options: { symbol: string; name?: string }[]
  onPick: (coin: string) => void
  width: number
}) {
  const [search, setSearch] = useState('')
  const filtered = options.filter(
    (o) =>
      o.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (o.name && o.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div
      className="absolute left-0 top-[calc(100%+8px)] z-40 border border-white/15 bg-[#121316] shadow-2xl overflow-hidden backdrop-blur-md"
      style={{ width: Math.max(width, 160) }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 border-b border-white/10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          placeholder="Search ticker..."
          className="w-full bg-white/5 border border-white/15 px-2 py-1 text-xs text-white placeholder-white/40 outline-none focus:border-[#70B6FF]"
          autoFocus
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {filtered.map((coin) => (
          <button
            key={coin.symbol}
            type="button"
            onClick={() => onPick(coin.symbol)}
            className="flex items-center justify-between w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="font-medium">{coin.symbol}</span>
            {coin.name && <span className="text-xs text-white/40">{coin.name}</span>}
          </button>
        ))}
        {search.trim().length >= 1 && !filtered.some((f) => f.symbol === search.trim()) && (
          <button
            type="button"
            onClick={() => onPick(search.trim())}
            className="flex items-center gap-1 w-full px-3 py-2 text-left text-xs text-[#70B6FF] hover:bg-white/10 border-t border-white/10"
          >
            <span>+ Pick &ldquo;{search.trim()}&rdquo;</span>
          </button>
        )}
      </div>
    </div>
  )
}

function PredictionDisplay({
  prediction,
  loading,
  ticker,
  onReset,
  onReAnalyze,
}: {
  prediction: PredictionResult | null
  loading: boolean
  ticker: string
  onReset: () => void
  onReAnalyze: () => void
}) {
  const [analyzingStep, setAnalyzingStep] = useState(0)

  useEffect(() => {
    if (!loading) {
      setAnalyzingStep(0)
      return
    }
    const t1 = setTimeout(() => setAnalyzingStep(1), 700)
    const t2 = setTimeout(() => setAnalyzingStep(2), 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [loading])

  const steps = [
    `Connecting to Polygon market feed for ${ticker}...`,
    `Analyzing 10-day OHLC candlestick momentum...`,
    `AI Model synthesizing trading recommendation...`,
  ]

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-[#044AB3]/30" />
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#70B6FF] border-t-transparent" />
        </div>
        <p className="text-[15px] font-medium text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {steps[analyzingStep]}
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#70B6FF] animate-pulse" />
          <span className="text-[12px] text-white/50" style={{ fontFamily: 'var(--font-mono-label)' }}>
            REAL-TIME QUANTITATIVE ENGINE
          </span>
        </div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-[14px] text-white/60 mb-4">No prediction generated yet.</p>
        <button
          type="button"
          onClick={onReAnalyze}
          className="border border-[#70B6FF] bg-[#044AB3] px-4 py-2 text-xs font-medium text-white"
        >
          Generate Prediction for {ticker}
        </button>
      </div>
    )
  }

  const rec = prediction.recommendation
  const isBuy = rec === 'BUY'
  const isSell = rec === 'SELL'

  return (
    <div className="flex h-full flex-col justify-between p-5 text-white">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[22px] font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {prediction.primaryStock.ticker}
            </span>
            <span
              className="text-[16px] text-white/80"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ${prediction.primaryStock.price.toFixed(2)}
            </span>
            <span
              className={`text-[12px] font-semibold ${
                prediction.primaryStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {prediction.primaryStock.changePercent >= 0 ? '+' : ''}
              {prediction.primaryStock.changePercent.toFixed(2)}%
            </span>
          </div>

          <div
            className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase border rounded-sm ${
              isBuy
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : isSell
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            }`}
          >
            {rec}
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
            <span>AI Technical Confidence</span>
            <span className="font-semibold text-white">{prediction.confidence}%</span>
          </div>
          <div className="h-[5px] w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#044AB3] to-[#70B6FF]"
              initial={{ width: 0 }}
              animate={{ width: `${prediction.confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] bg-white/5 p-2 border border-white/10">
          <div>
            <div className="text-white/40">24h High</div>
            <div className="font-medium text-white">${prediction.primaryStock.high.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-white/40">24h Low</div>
            <div className="font-medium text-white">${prediction.primaryStock.low.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-white/40">Volume</div>
            <div className="font-medium text-white">{prediction.primaryStock.volume}</div>
          </div>
          <div>
            <div className="text-white/40">Stance</div>
            <div className={`font-semibold ${isBuy ? 'text-emerald-400' : isSell ? 'text-rose-400' : 'text-amber-400'}`}>
              {isBuy ? 'Bullish' : isSell ? 'Bearish' : 'Neutral'}
            </div>
          </div>
        </div>

        {/* Prediction Report */}
        <div className="mt-3 max-h-[110px] overflow-y-auto pr-1 text-[12px] leading-[18px] text-white/80 border-l-2 border-[#70B6FF] pl-3 py-1 bg-white/[0.02]">
          <p className="whitespace-pre-line">{prediction.report}</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onReset}
          className="text-[12px] text-white/50 hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ← Back to Swap
        </button>
        <button
          type="button"
          onClick={onReAnalyze}
          className="bg-[#044AB3] hover:bg-[#0759D6] text-white text-[12px] font-medium px-3 py-1.5 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Re-Analyze
        </button>
      </div>
    </div>
  )
}

export default function TickerGrid() {
  const canvas = useFitScale(DESIGN_WIDTH)
  const mobile = useFitScaleAuto(MOBILE_DESIGN_WIDTH)
  const textureRef = useRef<HTMLDivElement>(null)
  const textureInView = useInView(textureRef, { once: true, amount: 0.2 })
  const swapRef = useRef<HTMLDivElement>(null)
  const swapInView = useInView(swapRef, { once: true, amount: 0.2 })
  const labelsInView = useInView(canvas.ref, { once: true, amount: 0.1 })
  const mobileSwapRef = useRef<HTMLDivElement>(null)
  const mobileSwapInView = useInView(mobileSwapRef, { once: true, amount: 0.2 })

  const [connectHovering, setConnectHovering] = useState(false)
  const [mobileConnectHovering, setMobileConnectHovering] = useState(false)

  // Unified Swap & Prediction State
  const [sellCoin, setSellCoin] = useState('NVDA')
  const [buyCoin, setBuyCoin] = useState('AAPL')
  const [sellMenuOpen, setSellMenuOpen] = useState(false)
  const [buyMenuOpen, setBuyMenuOpen] = useState(false)
  const sellWrapRef = useRef<HTMLDivElement>(null)
  const buyWrapRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<'swap' | 'predict'>('swap')
  const [predicting, setPredicting] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>(DEFAULT_STOCK_ESTIMATES)

  const sellShares = 10.0
  const sellQuote = quotes[sellCoin] || DEFAULT_STOCK_ESTIMATES[sellCoin] || { price: 200, changePercent: 0 }
  const buyQuote = quotes[buyCoin] || DEFAULT_STOCK_ESTIMATES[buyCoin] || { price: 200, changePercent: 0 }

  const sellTotalUsd = sellShares * (sellQuote.price || 1)
  const buyShares = sellTotalUsd / (buyQuote.price || 1)

  // Fetch real quotes on mount & ticker change
  useEffect(() => {
    async function fetchQuotes() {
      try {
        const query = Array.from(new Set([sellCoin, buyCoin, 'NVDA', 'AAPL', 'MSFT', 'TSLA'])).join(',')
        const res = await fetch(`/api/quote?tickers=${query}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.quotes) {
          const map: Record<string, StockQuote> = {}
          for (const q of data.quotes) {
            map[q.ticker] = q
          }
          setQuotes((prev) => ({ ...prev, ...map }))
        }
      } catch {
        // Fallback gracefully to default estimates
      }
    }
    fetchQuotes()
  }, [sellCoin, buyCoin])

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!sellMenuOpen && !buyMenuOpen) return
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (sellWrapRef.current?.contains(target)) return
      if (buyWrapRef.current?.contains(target)) return
      setSellMenuOpen(false)
      setBuyMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [sellMenuOpen, buyMenuOpen])

  function swap() {
    setSellCoin(buyCoin)
    setBuyCoin(sellCoin)
  }

  function pickSellCoin(coin: string) {
    if (coin === buyCoin) swap()
    else setSellCoin(coin)
    setSellMenuOpen(false)
  }

  function pickBuyCoin(coin: string) {
    if (coin === sellCoin) swap()
    else setBuyCoin(coin)
    setBuyMenuOpen(false)
  }

  // User selects a ticker anywhere on the grid or mobile chips
  function handleSelectTickerFromGrid(ticker: string) {
    if (ticker === buyCoin) {
      swap()
    } else {
      setSellCoin(ticker)
    }
  }

  // Trigger AI Prediction
  async function runPrediction(targetTicker = sellCoin) {
    setPredicting(true)
    setActiveTab('predict')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: [targetTicker] }),
      })
      const data = await res.json()
      if (data.success && data.report) {
        setPredictionResult(data)
      }
    } catch {
      // Handled gracefully inside display
    } finally {
      setPredicting(false)
    }
  }

  const mobileSellLabel = useCoinCodeCycle(sellCoin)
  const mobileBuyLabel = useCoinCodeCycle(buyCoin)

  return (
    <>
      {/* DESKTOP CANVAS */}
      <section
        ref={canvas.ref}
        className="relative hidden w-full overflow-hidden bg-[#08090b] lg:block"
        style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${canvas.scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* hover trail + unfolding quote cards in the empty cells */}
          <TickerCells
            colEdges={CELL_COL_EDGES}
            rowEdges={hLines}
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT}
            blocked={CELL_BLOCKED}
            onSelectTicker={handleSelectTickerFromGrid}
          />

          {/* grid lines */}
          {vLines.map((x, i) => (
            <motion.span
              key={x}
              className="absolute top-0 w-px bg-white/20"
              style={{ left: x, height: DESIGN_HEIGHT }}
              initial={{ scaleY: 0 }}
              animate={labelsInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.04 }}
            />
          ))}
          {hLines.map((y, i) => (
            <motion.span
              key={y}
              className={`absolute left-0 h-px ${
                i === 0 || i === hLines.length - 1 ? 'bg-white/25' : 'bg-white/20'
              }`}
              style={{ top: y, width: DESIGN_WIDTH }}
              initial={{ scaleX: 0 }}
              animate={labelsInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: vLines.length * 0.04 + i * 0.04 }}
            />
          ))}

          {/* texture tiles */}
          <div
            ref={textureRef}
            className="absolute"
            style={{
              left: textureTiles[0].x,
              top: textureTiles[0].y,
              width: TEXTURE_TILE_WIDTH,
              height: TEXTURE_TILE_HEIGHT,
            }}
          />
          {textureTiles.map((t, i) => (
            <div key={i}>
              <DotMatrix
                src={octopusTexture}
                width={TEXTURE_TILE_WIDTH}
                height={TEXTURE_TILE_HEIGHT}
                crop={t.crop}
                flipX={t.flipX}
                pitch={3.4}
                gain={1.3}
                dotScale={1}
                radius={45}
                className="absolute opacity-90"
                style={{ left: t.x, top: t.y }}
              />
              <ImageBlinds
                left={t.x}
                top={t.y}
                width={TEXTURE_TILE_WIDTH}
                height={TEXTURE_TILE_HEIGHT}
                isInView={textureInView}
                baseDelay={i * 0.08}
                leftExtraBleed={i === 0 ? 1.75 : i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 2 : 0}
                rightExtraBleed={i === 0 ? 1 : i === 1 ? 1 : i === 2 ? 0.5 : i === 3 ? 1 : 0}
                bottomExtraBleed={i === 0 ? 1 : i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 2.75 : 0}
              />
            </div>
          ))}

          {/* Interactive ticker labels */}
          {coinLabels.map((c, i) => (
            <CoinLabel
              key={i}
              label={c.label}
              x={c.x}
              y={c.y}
              isInView={labelsInView}
              delay={i * 30}
              isSelected={sellCoin === c.label || buyCoin === c.label}
              onSelect={() => handleSelectTickerFromGrid(c.label)}
            />
          ))}
          <motion.button
            type="button"
            onClick={() => handleSelectTickerFromGrid('GOOG')}
            className={`absolute px-[9px] py-[6px] text-[12px] font-medium transition-all duration-200 cursor-pointer ${
              sellCoin === 'GOOG'
                ? 'bg-[#044AB3] text-white border border-[#70B6FF]'
                : 'text-white/60 hover:text-white'
            }`}
            style={{ left: 350, top: 910, fontFamily: 'var(--font-display)', letterSpacing: '-0.36px' }}
            {...popIn(labelsInView, coinLabels.length * 30)}
          >
            GOOG
          </motion.button>

          {/* Visibility anchor */}
          <div ref={swapRef} className="absolute" style={{ left: 513, top: 258, width: 486, height: 385 }} />

          {/* Left Side: Chunky Arrow + Active Sell Ticker */}
          <motion.div
            className="absolute flex items-center gap-[15px]"
            style={{ left: 69, top: 436 }}
            initial={{ x: -60, opacity: 0 }}
            animate={swapInView ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.img
              src={arrowRightChunky}
              alt=""
              width={53}
              height={48}
              animate={{ x: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <SideCoinLabel coin={sellCoin} />
          </motion.div>

          {/* Right Side: Active Buy Ticker + Chunky Arrow */}
          <motion.div
            className="absolute flex items-center gap-[15px]"
            style={{ right: DESIGN_WIDTH - 1450, top: 428 }}
            initial={{ x: 60, opacity: 0 }}
            animate={swapInView ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <SideCoinLabel coin={buyCoin} />
            <motion.img
              src={arrowLeftChunky}
              alt=""
              width={53}
              height={48}
              animate={{ x: [0, -12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Card Header with View Switcher Tabs */}
          <div
            className="absolute flex items-center justify-between"
            style={{ left: 513, top: 258, width: 486 }}
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('swap')}
                className={`text-[20px] font-medium transition-colors cursor-pointer ${
                  activeTab === 'swap' ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.72px' }}
              >
                Swap
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('predict')}
                className={`flex items-center gap-1.5 text-[20px] font-medium transition-colors cursor-pointer ${
                  activeTab === 'predict' ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.72px' }}
              >
                <span>AI Prediction</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    predictionResult
                      ? 'bg-emerald-400 animate-pulse'
                      : predicting
                      ? 'bg-[#70B6FF] animate-ping'
                      : 'bg-white/20'
                  }`}
                />
              </button>
            </div>

            <span className="text-[12px] font-mono text-white/50">
              {sellCoin} ${sellQuote.price.toFixed(2)}
            </span>
          </div>

          {/* MAIN WIDGET BODY */}
          {activeTab === 'swap' ? (
            <>
              {/* Sell Panel */}
              <motion.div
                className="absolute border border-white/10 backdrop-blur-[10px]"
                style={{ left: 513, top: 303, width: 486, height: 128, background: 'rgba(255,255,255,0.07)' }}
                initial={{ y: 24, opacity: 0 }}
                animate={swapInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div
                  className="absolute text-[16px] font-normal text-white/50"
                  style={{ left: 20, top: 17, fontFamily: 'var(--font-display)' }}
                >
                  Sell
                </div>
                <CountUpNumber
                  value={sellShares}
                  decimals={1}
                  isInView={swapInView}
                  delay={3 * TEXT_STEP}
                  duration={1}
                  className="absolute text-[40px] font-normal text-white"
                  style={{ left: 20, top: 43, fontFamily: 'var(--font-display)', letterSpacing: '-1.2px' }}
                />
                <div
                  className="absolute text-[16px] font-normal text-white/50"
                  style={{ left: 20, top: 94, fontFamily: 'var(--font-display)' }}
                >
                  ${sellTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className="absolute text-[16px] font-normal text-white/50 flex items-center gap-1"
                  style={{ left: 390, top: 94, fontFamily: 'var(--font-display)' }}
                >
                  <span className={sellQuote.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {sellQuote.changePercent >= 0 ? '+' : ''}
                    {sellQuote.changePercent.toFixed(2)}%
                  </span>
                </div>
                <motion.div
                  ref={sellWrapRef}
                  className="absolute flex items-center gap-[8px] bg-white/10 px-[9px] cursor-pointer select-none"
                  style={{ left: 365.8, top: 45, width: 100, height: 35 }}
                  onClick={() => {
                    setBuyMenuOpen(false)
                    setSellMenuOpen((v) => !v)
                  }}
                  {...popIn(swapInView, 60)}
                >
                  <span
                    className="text-[24px] font-normal text-white"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.72px' }}
                  >
                    {sellCoin}
                  </span>
                  <img src={chevronDown} alt="" width={14} height={14} />
                  {sellMenuOpen && (
                    <CoinMenu
                      width={100}
                      options={ALL_AVAILABLE_STOCKS.filter((c) => c.symbol !== sellCoin)}
                      onPick={pickSellCoin}
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Swap Button */}
              <motion.div
                className="group absolute z-[2] flex items-center justify-center border-[4px] border-[#08090b] bg-[#222325] cursor-pointer transition-colors duration-300 hover:bg-[#044AB3]"
                style={{ left: 726, top: 404, width: 60, height: 60 }}
                onClick={swap}
                {...popIn(swapInView, 90)}
              >
                <img src={swapIcon} alt="" width={24} height={24} className={SWAP_ICON_HOVER} />
              </motion.div>

              {/* Buy Panel */}
              <motion.div
                className="absolute bg-white"
                style={{ left: 513, top: 435, width: 486, height: 128 }}
                initial={{ y: 24, opacity: 0 }}
                animate={swapInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
              >
                <div
                  className="absolute text-[16px] font-normal text-black"
                  style={{ left: 20, top: 17, fontFamily: 'var(--font-display)' }}
                >
                  Buy
                </div>
                <CountUpNumber
                  value={buyShares}
                  decimals={2}
                  isInView={swapInView}
                  delay={8 * TEXT_STEP}
                  duration={1}
                  className="absolute text-[40px] font-normal text-black"
                  style={{ left: 20, top: 45, fontFamily: 'var(--font-display)', letterSpacing: '-1.2px' }}
                />
                <div
                  className="absolute text-[16px] font-normal text-black"
                  style={{ left: 20, top: 94, fontFamily: 'var(--font-display)' }}
                >
                  ${sellTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className="absolute text-[16px] font-normal text-black"
                  style={{ left: 390, top: 94, fontFamily: 'var(--font-display)' }}
                >
                  <span className={buyQuote.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {buyQuote.changePercent >= 0 ? '+' : ''}
                    {buyQuote.changePercent.toFixed(2)}%
                  </span>
                </div>
                <motion.div
                  ref={buyWrapRef}
                  className="absolute flex items-center gap-[8px] rounded-none border border-white/15 bg-black px-[9px] cursor-pointer select-none"
                  style={{ left: 364, top: 45, width: 102, height: 36.8 }}
                  onClick={() => {
                    setSellMenuOpen(false)
                    setBuyMenuOpen((v) => !v)
                  }}
                  {...popIn(swapInView, 120)}
                >
                  <span
                    className="text-[24px] font-normal text-white"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.72px' }}
                  >
                    {buyCoin}
                  </span>
                  <img src={chevronDown} alt="" width={14} height={14} className="opacity-50" />
                  {buyMenuOpen && (
                    <CoinMenu
                      width={102}
                      options={ALL_AVAILABLE_STOCKS.filter((c) => c.symbol !== buyCoin)}
                      onPick={pickBuyCoin}
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Action Button: Predict Ticker */}
              <motion.div
                className="absolute flex items-center justify-center overflow-hidden bg-[#044AB3] hover:bg-[#0759D6] transition-colors cursor-pointer"
                style={{ left: 513, top: 583, width: 486, height: 60 }}
                initial={{ y: 24, opacity: 0 }}
                animate={swapInView ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
                onMouseEnter={() => setConnectHovering(true)}
                onMouseLeave={() => setConnectHovering(false)}
                onClick={() => runPrediction(sellCoin)}
              >
                {sparkleDotsLeft.concat(sparkleDotsRight).map((d, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full bg-white/70"
                    style={{ left: d.x - 513, top: d.y - 583, width: d.s, height: d.s }}
                  />
                ))}
                <span
                  className="absolute rounded-full"
                  style={{
                    left: 213,
                    top: 5,
                    width: 60,
                    height: 30,
                    background: 'rgba(112,182,255,0.4)',
                    filter: 'blur(20px)',
                  }}
                />
                <motion.span
                  className="relative inline-block"
                  initial={{ y: 10, opacity: 0 }}
                  animate={swapInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.16 + 13 * TEXT_STEP, ease: 'easeOut' }}
                >
                  <DrumText
                    text={predicting ? 'Analyzing...' : `Predict ${sellCoin} Performance`}
                    hovering={connectHovering}
                    className="text-[20px] font-medium text-white"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.6px' }}
                  />
                </motion.span>
              </motion.div>
            </>
          ) : (
            /* AI Prediction Card View */
            <motion.div
              className="absolute border border-white/10 backdrop-blur-[12px] bg-[#0c0d12]/95 overflow-hidden"
              style={{ left: 513, top: 303, width: 486, height: 340 }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PredictionDisplay
                prediction={predictionResult}
                loading={predicting}
                ticker={sellCoin}
                onReset={() => setActiveTab('swap')}
                onReAnalyze={() => runPrediction(sellCoin)}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* MOBILE CANVAS */}
      <section className="relative block w-full overflow-hidden bg-[#08090b] lg:hidden">
        <div
          ref={mobile.outerRef}
          className="relative w-full overflow-hidden"
          style={{ height: mobile.naturalHeight * mobile.scale }}
        >
          <div
            ref={mobile.innerRef}
            className="absolute left-0 top-0 flex flex-col items-center px-[24px] py-[56px]"
            style={{
              width: MOBILE_DESIGN_WIDTH,
              transform: `scale(${mobile.scale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Mobile Ticker Chips */}
            <div className="mb-[24px] flex flex-wrap items-center justify-center gap-[8px]">
              {mobileChipLabels.map((label) => (
                <MobileCoinChip
                  key={label}
                  label={label}
                  isSelected={sellCoin === label || buyCoin === label}
                  onSelect={() => handleSelectTickerFromGrid(label)}
                />
              ))}
            </div>

            {/* Mobile Side Cycle Ticker Banner */}
            <div className="mb-[24px] flex items-center gap-[8px]">
              <img src={arrowRightChunky} alt="" width={26} height={24} />
              <span
                className="text-[26px] font-medium text-white"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.78px' }}
              >
                <ScrambleText text={mobileSellLabel} />
              </span>
              <span className="text-[26px] font-medium text-white/40">/</span>
              <span
                className="text-[26px] font-medium text-white"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.78px' }}
              >
                <ScrambleText text={mobileBuyLabel} />
              </span>
              <img src={arrowLeftChunky} alt="" width={26} height={24} />
            </div>

            {/* Mobile Swap/Prediction Container */}
            <div ref={mobileSwapRef} className="flex w-full flex-col items-center">
              {/* Tab Header */}
              <div className="mb-[12px] flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('swap')}
                    className={`text-[18px] font-medium transition-colors ${
                      activeTab === 'swap' ? 'text-white' : 'text-white/40'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Swap
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('predict')}
                    className={`flex items-center gap-1 text-[18px] font-medium transition-colors ${
                      activeTab === 'predict' ? 'text-white' : 'text-white/40'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <span>AI Prediction</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        predictionResult ? 'bg-emerald-400' : 'bg-white/20'
                      }`}
                    />
                  </button>
                </div>
                <span className="text-[12px] text-white/50">{sellCoin}</span>
              </div>

              {activeTab === 'swap' ? (
                <>
                  {/* Mobile Sell Panel */}
                  <motion.div
                    className="w-full border border-white/10 backdrop-blur-[10px]"
                    style={{ background: 'rgba(255,255,255,0.07)', padding: 16 }}
                    initial={{ y: 16, opacity: 0 }}
                    animate={mobileSwapInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-normal text-white/50">Sell</span>
                      <div
                        className="relative flex items-center gap-[6px] bg-white/10 px-[9px] py-[6px] cursor-pointer select-none"
                        onClick={() => {
                          setBuyMenuOpen(false)
                          setSellMenuOpen((v) => !v)
                        }}
                      >
                        <span className="text-[18px] font-normal text-white">{sellCoin}</span>
                        <img src={chevronDown} alt="" width={12} height={12} />
                        {sellMenuOpen && (
                          <CoinMenu
                            width={110}
                            options={ALL_AVAILABLE_STOCKS.filter((c) => c.symbol !== sellCoin)}
                            onPick={pickSellCoin}
                          />
                        )}
                      </div>
                    </div>
                    <CountUpNumber
                      value={sellShares}
                      decimals={1}
                      isInView={mobileSwapInView}
                      delay={3 * TEXT_STEP}
                      duration={1}
                      className="mt-[8px] block text-[32px] font-normal text-white"
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.96px' }}
                    />
                    <div className="mt-[8px] flex items-center justify-between text-[13px] font-normal text-white/50">
                      <span>${sellTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className={sellQuote.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {sellQuote.changePercent >= 0 ? '+' : ''}
                        {sellQuote.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </motion.div>

                  {/* Mobile Swap Icon */}
                  <motion.div
                    className="group relative z-[2] -my-[16px] flex items-center justify-center border-[4px] border-[#08090b] bg-[#222325] cursor-pointer transition-colors duration-300 hover:bg-[#044AB3]"
                    style={{ width: 48, height: 48 }}
                    onClick={swap}
                    {...popIn(mobileSwapInView, 90)}
                  >
                    <img src={swapIcon} alt="" width={20} height={20} className={SWAP_ICON_HOVER} />
                  </motion.div>

                  {/* Mobile Buy Panel */}
                  <motion.div
                    className="w-full bg-white"
                    style={{ padding: 16 }}
                    initial={{ y: 16, opacity: 0 }}
                    animate={mobileSwapInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-normal text-black">Buy</span>
                      <div
                        className="relative flex items-center gap-[6px] border border-white/15 bg-black px-[9px] py-[6px] cursor-pointer select-none"
                        onClick={() => {
                          setSellMenuOpen(false)
                          setBuyMenuOpen((v) => !v)
                        }}
                      >
                        <span className="text-[18px] font-normal text-white">{buyCoin}</span>
                        <img src={chevronDown} alt="" width={12} height={12} className="opacity-50" />
                        {buyMenuOpen && (
                          <CoinMenu
                            width={110}
                            options={ALL_AVAILABLE_STOCKS.filter((c) => c.symbol !== buyCoin)}
                            onPick={pickBuyCoin}
                          />
                        )}
                      </div>
                    </div>
                    <CountUpNumber
                      value={buyShares}
                      decimals={2}
                      isInView={mobileSwapInView}
                      delay={8 * TEXT_STEP}
                      duration={1}
                      className="mt-[8px] block text-[32px] font-normal text-black"
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.96px' }}
                    />
                    <div className="mt-[8px] flex items-center justify-between text-[13px] font-normal text-black">
                      <span>${sellTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className={buyQuote.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {buyQuote.changePercent >= 0 ? '+' : ''}
                        {buyQuote.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </motion.div>

                  {/* Mobile Predict Button */}
                  <motion.div
                    className="mt-[16px] flex w-full items-center justify-center overflow-hidden bg-[#044AB3] hover:bg-[#0759D6] transition-colors cursor-pointer"
                    style={{ height: 52 }}
                    initial={{ y: 16, opacity: 0 }}
                    animate={mobileSwapInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
                    onMouseEnter={() => setMobileConnectHovering(true)}
                    onMouseLeave={() => setMobileConnectHovering(false)}
                    onClick={() => runPrediction(sellCoin)}
                  >
                    <motion.span
                      className="relative inline-block"
                      initial={{ y: 10, opacity: 0 }}
                      animate={mobileSwapInView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.16 + 13 * TEXT_STEP, ease: 'easeOut' }}
                    >
                      <DrumText
                        text={predicting ? 'Analyzing...' : `Predict ${sellCoin} Performance`}
                        hovering={mobileConnectHovering}
                        className="text-[16px] font-medium text-white"
                        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.48px' }}
                      />
                    </motion.span>
                  </motion.div>
                </>
              ) : (
                /* Mobile Prediction Display */
                <div className="w-full border border-white/10 bg-[#0c0d12]/95 backdrop-blur-[12px] min-h-[340px]">
                  <PredictionDisplay
                    prediction={predictionResult}
                    loading={predicting}
                    ticker={sellCoin}
                    onReset={() => setActiveTab('swap')}
                    onReAnalyze={() => runPrediction(sellCoin)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
