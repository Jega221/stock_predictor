import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
const krakenMark = 'https://qclay.design/lovable/kraken/hero-kraken-mark.svg'
const xIcon = 'https://qclay.design/lovable/kraken/footer-x.svg'
const linkedinIcon = 'https://qclay.design/lovable/kraken/footer-linkedin.svg'
const githubIcon = 'https://qclay.design/lovable/kraken/footer-github.svg'
import { popIn, AnimatedLines, HoverLine } from '../lib/animations'
import JegaMark from '../lib/JegaMark'

const DESIGN_WIDTH = 1512
const DESIGN_HEIGHT = 440
const MOBILE_DESIGN_WIDTH = 420

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

const columns = [
  {
    title: 'PRODUCTS',
    links: ['Spot Trading', 'Futures', 'Copy Trading', 'Staking', 'Earn', 'Trading Bots'],
  },
  {
    title: 'MARKETS',
    links: ['Markets', 'Equities & Stocks', 'New Listings', 'Top Gainers', 'Market Trends', 'Trading Fees'],
  },
  {
    title: 'TRADERS',
    links: ['Leaderboard', 'Become a Trader', 'Referral Program', 'Rewards'],
  },
  {
    title: 'RESOURCES',
    links: ['Learn', 'Trading Guides', 'Market Insights', 'Help Center', 'About Us', 'Contact Us'],
  },
]

const legalLinks = ['LEGAL', 'PRIVACY', 'DATA PRIVACY', 'CERTIFICATIONS', 'COOKIES']

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function FooterMobile() {
  const mobile = useFitScaleAuto(MOBILE_DESIGN_WIDTH)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <footer className="relative block w-full overflow-hidden bg-[#08090b] lg:hidden">
      <div
        ref={mobile.outerRef}
        className="relative w-full overflow-hidden"
        style={{ height: mobile.naturalHeight * mobile.scale }}
      >
        <div
          ref={mobile.innerRef}
          className="absolute left-0 top-0 flex flex-col px-[24px] py-[48px]"
          style={{ width: MOBILE_DESIGN_WIDTH, transform: `scale(${mobile.scale})`, transformOrigin: 'top left' }}
        >
          <div ref={ref}>
            {/* brand */}
            <div className="flex items-center">
              <JegaMark width={26} height={20} />
              <span
                className="ml-[12px] text-[20px] font-medium text-white"
                style={{ fontFamily: 'var(--font-logo)', letterSpacing: '-0.4px' }}
              >
                Jega
              </span>
            </div>

            <p
              className="mt-[16px] text-[14px] text-white/60 leading-[20px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Trade smarter. Move with the market. A powerful trading platform built to help you track markets, manage
              positions, and act on opportunities with confidence.
            </p>

            {/* socials */}
            <div className="mt-[20px] flex items-center gap-[8px]">
              {[xIcon, linkedinIcon, githubIcon].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-[32px] w-[32px] items-center justify-center border border-white/10 bg-white/5 transition-colors hover:bg-white/15"
                >
                  <img src={icon} alt="" width={14} height={14} />
                </a>
              ))}
            </div>

            {/* columns */}
            <div className="mt-[36px] grid grid-cols-2 gap-[24px]">
              {columns.map((col) => (
                <div key={col.title}>
                  <div
                    className="text-[11px] font-medium uppercase text-white/40 tracking-wider mb-[12px]"
                    style={{ fontFamily: 'var(--font-mono-label)' }}
                  >
                    {col.title}
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {col.links.map((link) => (
                      <span
                        key={link}
                        className="text-[14px] text-white/70"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* bottom legal */}
            <div className="mt-[40px] pt-[20px] border-t border-dashed border-white/10 flex flex-col gap-[12px]">
              <div
                className="text-[10px] text-white/40 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-mono-label)' }}
              >
                © 2026 PROCESSING.COM. ALL RIGHTS RESERVED.
              </div>
              <button
                type="button"
                onClick={scrollToTop}
                className="text-left text-[11px] text-white/60 hover:text-white uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-mono-label)' }}
              >
                BACK TO TOP ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Footer() {
  const canvas = useFitScale(DESIGN_WIDTH)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <>
      <footer
        ref={canvas.ref}
        className="relative hidden w-full overflow-hidden bg-[#08090b] lg:block"
        style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }}
      >
        <div
          ref={ref}
          className="absolute left-0 top-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${canvas.scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* vertical dashed dividers */}
          <div
            className="absolute top-0 bottom-[60px] w-px"
            style={{
              left: 480,
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0 4px, transparent 4px 8px)',
            }}
          />
          <div
            className="absolute top-0 bottom-[60px] w-px"
            style={{
              left: 980,
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0 4px, transparent 4px 8px)',
            }}
          />

          {/* brand column */}
          <div className="absolute" style={{ left: 114, top: 40, width: 320 }}>
            <div className="flex items-center">
              <motion.div {...popIn(inView, 0)}>
                <JegaMark width={30} height={23} />
              </motion.div>
              <AnimatedLines
                lines={['Jega']}
                isInView={inView}
                className="ml-[14px] text-[22px] font-medium text-white"
                style={{ fontFamily: 'var(--font-logo)', letterSpacing: '-0.44px' }}
              />
            </div>

            <AnimatedLines
              as="p"
              lines={[
                'Trade smarter. Move with the market.',
                'A powerful trading platform built to',
                'help you track markets, manage positions,',
                'and act on opportunities with confidence.',
              ]}
              baseDelay={0.1}
              isInView={inView}
              className="mt-[18px] text-[14px] text-white/60 leading-[20px]"
              style={{ fontFamily: 'var(--font-display)' }}
            />

            {/* socials */}
            <div className="mt-[28px] flex items-center gap-[8px]">
              {[xIcon, linkedinIcon, githubIcon].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="flex h-[32px] w-[32px] items-center justify-center border border-white/10 bg-white/5 transition-colors hover:bg-white/15"
                  {...popIn(inView, 200 + i * 50)}
                >
                  <img src={icon} alt="" width={14} height={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 4 link columns */}
          <div className="absolute flex" style={{ left: 520, top: 40, width: 880 }}>
            {columns.map((col, colIdx) => (
              <div key={col.title} style={{ width: 220 }}>
                <div
                  className="text-[11px] font-medium uppercase text-white/40 tracking-wider mb-[16px]"
                  style={{ fontFamily: 'var(--font-mono-label)' }}
                >
                  {col.title}
                </div>
                <div className="flex flex-col gap-[10px]">
                  {col.links.map((link, linkIdx) => (
                    <HoverLine
                      key={link}
                      text={link}
                      baseDelay={0.1 + (colIdx * 4 + linkIdx) * 0.02}
                      isInView={inView}
                      effect={colIdx === 2 && linkIdx === 0 ? 'scramble' : 'drum'}
                      className="whitespace-nowrap text-[14px] text-white/70"
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.28px' }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* horizontal dashed divider */}
          <div
            className="absolute left-[114px] right-[114px] h-px"
            style={{
              bottom: 60,
              backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.15) 0 4px, transparent 4px 8px)',
            }}
          />

          {/* bottom bar */}
          <div className="absolute left-[114px] right-[114px] flex items-center justify-between" style={{ bottom: 24 }}>
            <span
              className="text-[11px] text-white/40 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono-label)' }}
            >
              © 2026 PROCESSING.COM. ALL RIGHTS RESERVED.
            </span>

            <div className="flex items-center gap-[24px]">
              {legalLinks.map((item) => (
                <span
                  key={item}
                  className="text-[11px] text-white/50 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-mono-label)' }}
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-[4px] text-[11px] text-white/60 hover:text-white uppercase tracking-wider cursor-pointer transition-colors"
              style={{ fontFamily: 'var(--font-mono-label)' }}
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </footer>
      <FooterMobile />
    </>
  )
}
