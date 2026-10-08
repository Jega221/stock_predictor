import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
const ctaWaveGlow = 'https://qclay.design/lovable/kraken/cta-wave-glow.webp'
import PortfolioDashboard from './PortfolioDashboard'
import { popIn, AnimatedLines, DrumText } from '../lib/animations'
import DotMatrix from '../lib/DotMatrix'

const DESIGN_WIDTH = 1512
const DESIGN_HEIGHT = 860
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

function ArrowRight({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1 5.5H10M10 5.5L6.5 2M10 5.5L6.5 9"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CTAMobile() {
  const mobile = useFitScaleAuto(MOBILE_DESIGN_WIDTH)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [btnHovering, setBtnHovering] = useState(false)

  return (
    <section className="relative block w-full overflow-hidden bg-[#08090b] lg:hidden">
      <div
        ref={mobile.outerRef}
        className="relative w-full overflow-hidden"
        style={{ height: mobile.naturalHeight * mobile.scale }}
      >
        <div
          ref={mobile.innerRef}
          className="absolute left-0 top-0 flex flex-col px-[24px] py-[60px]"
          style={{ width: MOBILE_DESIGN_WIDTH, transform: `scale(${mobile.scale})`, transformOrigin: 'top left' }}
        >
          <div ref={ref}>
            <div className="inline-flex items-center gap-[6px] whitespace-nowrap border border-white/10 bg-white/10 px-[10px] py-[6px]">
              <span
                className="h-[6px] w-[6px] shrink-0"
                style={{ background: 'linear-gradient(180deg, #044AB3 0%, #70B6FF 100%)' }}
              />
              <span
                className="text-[12px] font-medium uppercase text-white/80"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Let&apos;s talk
              </span>
            </div>

            <AnimatedLines
              as="h2"
              lines={["Let's Talk Trading"]}
              baseDelay={0.05}
              isInView={inView}
              className="mt-[16px] font-medium text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34,
                lineHeight: '36px',
                letterSpacing: '-1px',
              }}
            />

            <AnimatedLines
              as="p"
              lines={[
                'Discover how our trading platform and market tools can help you track opportunities, manage risk, and trade with confidence.',
              ]}
              baseDelay={0.15}
              isInView={inView}
              className="mt-[14px] text-[15px] font-medium text-white/80"
              style={{ fontFamily: 'var(--font-display)', lineHeight: '22px' }}
            />

            <div className="mt-[24px]">
              <motion.div
                className="inline-flex h-[36px] items-center justify-center gap-[7px] bg-white px-[14px]"
                {...popIn(inView, 200)}
                onMouseEnter={() => setBtnHovering(true)}
                onMouseLeave={() => setBtnHovering(false)}
              >
                <DrumText
                  text="Schedule a Demo"
                  hovering={btnHovering}
                  className="whitespace-nowrap text-[14px] font-medium text-black"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.14px' }}
                />
                <span className="h-[16px] w-px bg-black/10" />
                <ArrowRight color="black" />
              </motion.div>
            </div>

            {/* mobile dot matrix glow wave */}
            <div className="relative mt-[36px] h-[220px] w-full overflow-hidden">
              <DotMatrix
                src={ctaWaveGlow}
                width={MOBILE_DESIGN_WIDTH - 48}
                height={220}
                pitch={7}
                gain={1.9}
                radius={80}
                ambient
                autoSweepMs={5000}
                litOnly
                backdrop="#08090b"
                backdropFade={40}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CTA() {
  const canvas = useFitScale(DESIGN_WIDTH)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [btnHovering, setBtnHovering] = useState(false)

  return (
    <>
      <section
        ref={canvas.ref}
        className="relative hidden w-full overflow-hidden bg-[#08090b] lg:block"
        style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }}
      >
        <div
          ref={sectionRef}
          className="absolute left-0 top-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${canvas.scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* warm bottom overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(4,74,179,0) 0%, rgba(4,74,179,0.25) 100%)',
            }}
          />

          {/* left column: badge, headline, copy, CTA */}
          <div className="absolute" style={{ left: 114, top: 110, width: 440 }}>
            <motion.div
              className="inline-flex items-center gap-[6px] whitespace-nowrap border border-white/10 bg-white/10 px-[10px] py-[6px]"
              {...popIn(inView, 0)}
            >
              <span
                className="h-[6px] w-[6px] shrink-0"
                style={{ background: 'linear-gradient(180deg, #044AB3 0%, #70B6FF 100%)' }}
              />
              <span
                className="text-[13px] font-medium uppercase text-white/80"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Let&apos;s talk
              </span>
            </motion.div>

            <AnimatedLines
              as="h2"
              lines={["Let's Talk Trading"]}
              baseDelay={0.06}
              isInView={inView}
              className="mt-[20px] font-medium text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 54,
                lineHeight: '52px',
                letterSpacing: '-1.62px',
              }}
            />

            <AnimatedLines
              as="p"
              lines={[
                'Discover how our trading platform and market tools can help',
                'you track opportunities, manage risk, and trade with confidence.',
              ]}
              baseDelay={0.16}
              isInView={inView}
              className="mt-[20px] text-[16px] font-medium text-white/80"
              style={{ fontFamily: 'var(--font-display)', lineHeight: '22px' }}
            />

            <motion.div
              className="mt-[28px] inline-flex h-[32px] items-center justify-center gap-[7px] bg-white px-[12px] cursor-pointer"
              {...popIn(inView, 250)}
              onMouseEnter={() => setBtnHovering(true)}
              onMouseLeave={() => setBtnHovering(false)}
            >
              <DrumText
                text="Schedule a Demo"
                hovering={btnHovering}
                className="whitespace-nowrap text-[14px] font-medium text-black"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.14px' }}
              />
              <span className="h-[16px] w-px bg-black/10" />
              <ArrowRight color="black" />
            </motion.div>
          </div>

          {/* right side: second glass dashboard window */}
          <motion.div
            className="absolute rounded-[9px] border border-white/15 backdrop-blur-[27px] overflow-hidden"
            style={{
              left: 650,
              top: 100,
              width: 800,
              height: 480,
              background: 'rgba(255,255,255,0.06)',
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute flex items-center gap-[4px]" style={{ left: 16, top: 12 }}>
              <span className="h-[6px] w-[6px] rounded-full bg-white" />
              <span className="h-[6px] w-[6px] rounded-full bg-white/50" />
              <span className="h-[6px] w-[6px] rounded-full bg-white/20" />
            </div>
            <PortfolioDashboard
              x={16}
              y={32}
              width={768}
              height={430}
              scale={768 / 948}
              revealDelay={0.3}
            />
          </motion.div>

          {/* full-width dot matrix wave glowing across bottom */}
          <div className="absolute left-0 bottom-0 pointer-events-none" style={{ width: DESIGN_WIDTH, height: 420 }}>
            <DotMatrix
              src={ctaWaveGlow}
              width={DESIGN_WIDTH}
              height={420}
              pitch={10}
              gain={1.9}
              radius={130}
              litOnly
              backdrop="#08090b"
              backdropFade={80}
            />
          </div>
        </div>
      </section>
      <CTAMobile />
    </>
  )
}
