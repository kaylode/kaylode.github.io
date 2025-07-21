'use client'

import { SessionProvider } from 'next-auth/react'
// import DataSyncProvider from '../src/components/providers/DataSyncProvider'
// import StartupSync from '../src/components/utils/StartupSync'

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
