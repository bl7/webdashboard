'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { useDarkMode } from '../context/DarkModeContext'

interface Testimonial {
  id: number
  name: string
  email: string | null
  company: string | null
  role: string | null
  rating: number | null
  message: string
  consent: boolean
  approved: boolean
  source: string | null
  created_at: string
}

const Stars = ({ value }: { value: number | null }) => {
  if (!value) return <span className="text-gray-400">N/A</span>
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </span>
  )
}

export default function BossTestimonialsPage() {
  const { isDarkMode } = useDarkMode()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<Testimonial | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true)
      setError('')
      try {
        const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null
        const res = await fetch('/api/testimonials', {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
        if (!res.ok) throw new Error('Failed to fetch testimonials')
        const data = await res.json()
        setTestimonials(data.testimonials || [])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch testimonials')
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Testimonials</h1>
      {loading ? (
        <div className="dark:text-gray-200">Loading...</div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="overflow-x-auto p-0">
            <table className={isDarkMode ? 'min-w-full border bg-gray-800 rounded shadow border-gray-700' : 'min-w-full border bg-white rounded shadow border-gray-200'}>
              <thead>
                <tr className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Name</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Role</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Company</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Rating</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Testimonial</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Consent</th>
                  <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className={isDarkMode ? 'bg-gray-800' : ''}>
                    <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[140px]">{t.name}</td>
                    <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[120px]">{t.role || <span className='text-gray-400'>N/A</span>}</td>
                    <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[140px]">{t.company || <span className='text-gray-400'>N/A</span>}</td>
                    <td className="p-2"><Stars value={t.rating} /></td>
                    <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[220px] cursor-pointer text-purple-600 hover:underline" title={t.message} onClick={() => setModal(t)}>
                      {t.message}
                    </td>
                    <td className="p-2 text-xs whitespace-nowrap">
                      <span className={t.consent ? 'text-green-600' : 'text-gray-400'}>{t.consent ? 'Yes' : 'No'}</span>
                    </td>
                    <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[140px]">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {testimonials.length === 0 && (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-500 dark:text-gray-400">No testimonials yet.</td></tr>
                )}
              </tbody>
            </table>
            <Dialog open={!!modal} onOpenChange={(open) => !open && setModal(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Testimonial Details</DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-2 text-base text-foreground mt-2">
                      {modal && (
                        <>
                          <div><span className="font-semibold">Name:</span> {modal.name}</div>
                          <div><span className="font-semibold">Email:</span> {modal.email || <span className='text-gray-400'>N/A</span>}</div>
                          <div><span className="font-semibold">Role:</span> {modal.role || <span className='text-gray-400'>N/A</span>}</div>
                          <div><span className="font-semibold">Company:</span> {modal.company || <span className='text-gray-400'>N/A</span>}</div>
                          <div className="flex items-center gap-2"><span className="font-semibold">Rating:</span> <Stars value={modal.rating} /></div>
                          <div><span className="font-semibold">Consent to publish:</span> {modal.consent ? 'Yes' : 'No'}</div>
                          <div><span className="font-semibold">Testimonial:</span> <span className="whitespace-pre-line">{modal.message}</span></div>
                          <div><span className="font-semibold">Date:</span> {new Date(modal.created_at).toLocaleString()}</div>
                        </>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
