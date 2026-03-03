import { useState, useCallback } from 'react'
import { generatePoster, downloadPoster } from '@/lib/poster-generator'
import { getLevelLabel } from '@/lib/assessment'
import { buildShareUrl } from '@/lib/assessment-share'
import type { AssessmentReport } from '@/lib/assessment'

interface PosterPanelProps {
  report: AssessmentReport
  scores: Record<string, number>
}

export default function PosterPanel({ report, scores }: PosterPanelProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    try {
      const url = await generatePoster({
        overallScore: report.overallScore,
        overallLevel: report.overallLevel,
        overallLevelLabel: getLevelLabel(report.overallLevel),
        overallComment: report.overallComment,
        dimensions: report.dimensions.map(d => ({
          name: d.dimension.name,
          score: d.averageScore,
          level: d.level,
          levelLabel: getLevelLabel(d.level),
        })),
        shareUrl: buildShareUrl(scores),
      })
      setPosterUrl(url)
    } finally {
      setGenerating(false)
    }
  }, [report, scores])

  const handleDownload = useCallback(() => {
    if (posterUrl) downloadPoster(posterUrl)
  }, [posterUrl])

  return (
    <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8">
      <h3 className="text-center text-lg font-bold text-gray-900">生成分享海报</h3>
      <p className="mt-2 text-center text-sm text-gray-500">
        一键生成精美海报图片，分享到朋友圈或社交媒体
      </p>

      {!posterUrl ? (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {generating ? '生成中...' : '生成海报图片'}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="mx-auto max-w-xs overflow-hidden rounded-lg border border-gray-200 shadow-md">
            <img src={posterUrl} alt="诊断结果海报" className="w-full" />
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              保存海报图片
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              重新生成
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">
            长按海报图片可直接保存到手机相册
          </p>
        </div>
      )}
    </div>
  )
}
