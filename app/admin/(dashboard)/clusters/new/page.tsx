'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page is deprecated. Cluster creation now uses the CreateClusterDialog
// component on the clusters list page. Redirect there.
export default function NewClusterPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/admin/clusters')
    }, [router])

    return null
}
