'use client'

import { useEffect, useRef } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function SeedDataBootstrap() {
  const status = useQuery(api.seed.getSeedStatus)
  const seedDatabase = useMutation(api.seed.seedDatabase)
  const hasRequested = useRef(false)

  useEffect(() => {
    if (hasRequested.current) {
      return
    }
    if (!status) {
      return
    }
    if (status.isSeeded) {
      return
    }
    hasRequested.current = true
    void seedDatabase({})
  }, [seedDatabase, status])

  return null
}
