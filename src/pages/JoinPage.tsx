import { useState } from 'react'
import { CheckCircle, Star, TrendingUp, Users, Shield, Award } from 'lucide-react'
import { trainers } from '@/data/mock'
import { getAvatarUrl } from '@/lib/utils'

interface TrainerApplication {
  name: string
  title: string
  city: string
  years_experience: string
  specialties: string
  bio: string
  email: string
  phone: string
  wechat_id: string
  sample_course: string
}

const INITIAL_FORM: TrainerApplication = {
  name: '',
  title: '',
  city: '',
  years_experience: '',
  specialties: '',
  bio: '',
  email: '',
  phone: '',
  wechat_id: '',
  sample_course: '',
}

const STORAGE_KEY = 'trainhub_trainer_applications'

/** 保存申请到 localStorage */
function saveApplication(app: TrainerApplication) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  existing.push({ ...app, submitted_at: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

/** 构建 mailto: URL */
function buildMailtoUrl(app: TrainerApplication): string {
  const subject = encodeURIComponent(`TrainHub 培训师入驻申请 — ${app.name}`)
  const body = encodeURIComponent(
    `培训师入驻申请\n` +
    `${'─'.repeat(30)}\n\n` +
    `姓名：${app.name}\n` +
    `职业头衔：${app.title}\n` +
    `所在城市：${app.city}\n` +
    `培训经验：${app.years_experience} 年\n` +
    `专长领域：${app.specialties}\n` +
    `\n个人简介：\n${app.bio}\n` +
    `\n代表课程：\n${app.sample_course || '（未填写）'}\n` +
    `\n联系方式：\n` +
    `邮箱：${app.email}\n` +
    `电话：${app.phone || '（未填写）'}\n` +
    `微信：${app.wechat_id || '（未填写）'}\n`
  )
  return `mailto:hi@trainhub.cn?subject=${subject}&body=${body}`
}

export default function JoinPage() {
  const [form, setForm] = useState<TrainerApplication>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof TrainerApplication, string>>>({})

  const handleChange = (field: keyof TrainerApplication, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TrainerApplication, string>> = {}
    if (!form.name.trim()) newErrors.name = '请输入姓名'
    if (!form.title.trim()) newErrors.title = '请输入职业头衔'
    if (!form.city.trim()) newErrors.city = '请输入所在城市'
    if (!form.years_experience.trim()) newErrors.years_experience = '请输入培训经验年限'
    if (!form.specialties.trim()) newErrors.specialties = '请输入专长领域'
    if (!form.bio.trim()) newErrors.bio = '请输入个人简介'
    if (!form.email.trim()) newErrors.email = '请输入联系邮箱'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = '邮箱格式不正确'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // 保存到 localStorage
    saveApplication(form)

    // 打开 mailto:
    const mailtoUrl = buildMailtoUrl(form)
    window.open(mailtoUrl, '_blank')

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">申请已提交</h1>
          <p className="mt-4 text-gray-600">
            感谢您的入驻申请！我们已收到您的信息，将在 1-2 个工作日内与您联系确认。
          </p>
          <p className="mt-2 text-sm text-gray-500">
            如果邮件客户端未自动打开，请将申请信息发送至 <strong>hi@trainhub.cn</strong>
          </p>
          <button
            type="button"
            onClick={() => { setForm(INITIAL_FORM); setSubmitted(false) }}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            再次提交
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">成为 TrainHub 认证培训师</h1>
          <p className="mt-4 text-lg text-emerald-100">
            展示您的专业能力，连接更多优质企业客户
          </p>
        </div>
      </section>

      {/* 入驻优势 */}
      <section className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Users, title: '精准客户', desc: '直接对接企业 HR 和培训负责人' },
            { icon: Star, title: '专业展示', desc: '个人主页 + 课程大纲，全方位呈现能力' },
            { icon: TrendingUp, title: '零佣金', desc: '平台不收取中间费用，全额收入归您' },
          ].map(item => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 平台数据 + 已入驻培训师 */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* 数据亮点 */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { num: '10+', label: '认证培训师' },
              { num: '12', label: '精品课程' },
              { num: '1,200+', label: '累计学员评价' },
              { num: '6', label: '培训领域' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{item.num}</p>
                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          {/* 已入驻培训师头像墙 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">他们已经入驻 TrainHub</h3>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {trainers.filter(t => t.featured).map(t => (
                <div key={t.id} className="flex flex-col items-center gap-1">
                  <img
                    src={t.avatar_url || getAvatarUrl(t.name, t.id)}
                    alt={t.name}
                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <span className="text-xs text-gray-600">{t.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              平均 14 年培训经验 · 覆盖 6 大城市 · 评分均在 4.7 以上
            </p>
          </div>

          {/* 培训师推荐语 */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600 italic">
                "入驻 TrainHub 后，每月能收到 3-5 个精准的企业咨询，比自己在朋友圈发广告有效多了。"
              </p>
              <div className="mt-3 flex items-center gap-2">
                <img src={getAvatarUrl('张明远', 1)} alt="张明远" className="h-8 w-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">张明远</p>
                  <p className="text-xs text-gray-500">领导力发展专家 · 20年经验</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600 italic">
                "平台的个人主页比我自己做的网站还专业，课程大纲展示得很清晰，企业客户看了就知道我能做什么。"
              </p>
              <div className="mt-3 flex items-center gap-2">
                <img src={getAvatarUrl('林小芳', 8)} alt="林小芳" className="h-8 w-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">林小芳</p>
                  <p className="text-xs text-gray-500">AI应用培训专家 · 8年经验</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 申请表单 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">填写入驻申请</h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            带 <span className="text-red-500">*</span> 的为必填项
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* 基本信息 */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-gray-900">基本信息</legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="姓名" required
                  value={form.name}
                  onChange={v => handleChange('name', v)}
                  placeholder="您的真实姓名"
                  error={errors.name}
                />
                <FormField
                  label="职业头衔" required
                  value={form.title}
                  onChange={v => handleChange('title', v)}
                  placeholder="如：领导力发展专家"
                  error={errors.title}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="所在城市" required
                  value={form.city}
                  onChange={v => handleChange('city', v)}
                  placeholder="如：上海"
                  error={errors.city}
                />
                <FormField
                  label="培训经验（年）" required
                  type="number"
                  value={form.years_experience}
                  onChange={v => handleChange('years_experience', v)}
                  placeholder="如：10"
                  error={errors.years_experience}
                />
              </div>

              <FormField
                label="专长领域" required
                value={form.specialties}
                onChange={v => handleChange('specialties', v)}
                placeholder="用逗号分隔，如：领导力, 团队管理, 战略思维"
                error={errors.specialties}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  个人简介 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  placeholder="介绍您的从业背景、培训经验、教学特色等（100-500字）"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.bio
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio}</p>}
              </div>
            </fieldset>

            {/* 联系方式 */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-gray-900">联系方式</legend>

              <FormField
                label="邮箱" required
                type="email"
                value={form.email}
                onChange={v => handleChange('email', v)}
                placeholder="your@email.com"
                error={errors.email}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="手机号码"
                  type="tel"
                  value={form.phone}
                  onChange={v => handleChange('phone', v)}
                  placeholder="选填"
                />
                <FormField
                  label="微信号"
                  value={form.wechat_id}
                  onChange={v => handleChange('wechat_id', v)}
                  placeholder="选填"
                />
              </div>
            </fieldset>

            {/* 代表课程 */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-gray-900">代表课程（选填）</legend>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  课程标题与简介
                </label>
                <textarea
                  rows={3}
                  value={form.sample_course}
                  onChange={e => handleChange('sample_course', e.target.value)}
                  placeholder="简要描述您最有代表性的一门培训课程，包括课程名称、时长、目标学员等"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              提交入驻申请
            </button>

            <p className="text-center text-xs text-gray-400">
              提交即表示您同意我们审核您的申请信息。审核通过后，您的个人主页将在平台展示。
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

/** 通用表单输入组件 */
function FormField({
  label,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string
  required?: boolean
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
