'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const getErrorMessage = (error) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'Your email address is not authorized to access the admin area.',
          suggestion: 'Please contact the administrator if you believe this is an error.'
        }
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There was a problem with the authentication configuration.',
          suggestion: 'Please try again later or contact support.'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication.',
          suggestion: 'Please try signing in again.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <FaExclamationTriangle className="text-3xl text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{errorInfo.title}</h1>
        </div>

        {/* Error Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="text-center">
            <p className="text-gray-300 mb-4">{errorInfo.message}</p>
            <p className="text-sm text-gray-400 mb-6">{errorInfo.suggestion}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/signin')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                <FaArrowLeft className="text-sm" />
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-mono">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
