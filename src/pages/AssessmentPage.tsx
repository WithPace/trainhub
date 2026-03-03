import { useState, useMemo, useEffect } from 'react'
import { JsonLd } from '@/components/seo/JsonLd'
import PageHead from '@/components/seo/PageHead'
import AssessmentHero from '@/components/assessment/AssessmentHero'
import Questionnaire from '@/components/assessment/Questionnaire'
import ResultReport from '@/components/assessment/ResultReport'
import PosterPanel from '@/components/assessment/PosterPanel'
import SharePanel from '@/components/assessment/SharePanel'
import ActionPanel from '@/components/assessment/ActionPanel'
import BottomCTA from '@/components/assessment/BottomCTA'
import { allQuestionIds, calculateReport } from '@/lib/assessment'
import { decodeScores, buildAssessmentSchema } from '@/lib/assessment-share'

export default function AssessmentPage() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)

  // 页面加载时检查 URL 参数，自动恢复分享结果
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('r')
    if (encoded) {
      const decoded = decodeScores(encoded)
      if (decoded) {
        setScores(decoded)
        setShowResult(true)
        setTimeout(() => {
          document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [])

  const allAnswered = allQuestionIds.every(id => scores[id] !== undefined)

  const report = useMemo(() => {
    if (!showResult) return null
    return calculateReport(scores)
  }, [scores, showResult])

  const handleScore = (questionId: string, score: number) => {
    setScores(prev => ({ ...prev, [questionId]: score }))
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    setShowResult(true)
    setTimeout(() => {
      document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleReset = () => {
    setScores({})
    setShowResult(false)
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <PageHead
        title="企业培训需求诊断 | TrainHub - 3分钟快速评估培训方向"
        description="3分钟快速评估企业培训现状，获取专业诊断报告和改进建议，涵盖领导力、专业技能、团队协作、数字化能力四大维度。"
        path="/assessment"
      />
      <JsonLd data={buildAssessmentSchema()} />

      <AssessmentHero />

      <Questionnaire
        scores={scores}
        showResult={showResult}
        onScore={handleScore}
        onSubmit={handleSubmit}
      />

      {showResult && report && (
        <section id="assessment-result" className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <ResultReport report={report} />
            <PosterPanel report={report} scores={scores} />
            <SharePanel report={report} scores={scores} />
            <ActionPanel onReset={handleReset} />
          </div>
        </section>
      )}

      {!showResult && <BottomCTA />}
    </div>
  )
}
