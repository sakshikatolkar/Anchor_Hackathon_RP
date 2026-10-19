import { Hero } from '@/components/site/home/hero'
import { Stats } from '@/components/site/home/stats'
import { HowItWorks } from '@/components/site/home/how-it-works'
import { Legacy, FinalCta } from '@/components/site/home/legacy-cta'
import { WaveDivider } from '@/components/site/primitives'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider fill="paper" />
      <Stats />
      <WaveDivider fill="ink" />
      <HowItWorks />
      <WaveDivider fill="paper" />
      <Legacy />
      <WaveDivider fill="ink" />
      <FinalCta />
    </>
  )
}
