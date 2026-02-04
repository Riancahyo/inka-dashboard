'use client'

import { useEffect, useState } from 'react'
import { getUserRole } from '@/lib/auth'
import { UserRole, canView, canCreate, canEdit, canDelete } from '@/types/roles'

interface PermissionGateProps {
  children: React.ReactNode
  module: string
  action: 'view' | 'create' | 'edit' | 'delete'
  fallback?: React.ReactNode
}

export function PermissionGate({ children, module, action, fallback = null }: PermissionGateProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      const role = await getUserRole()
      
      let permitted = false
      switch (action) {
        case 'view':
          permitted = canView(role, module)
          break
        case 'create':
          permitted = canCreate(role, module)
          break
        case 'edit':
          permitted = canEdit(role, module)
          break
        case 'delete':
          permitted = canDelete(role, module)
          break
      }
      
      setHasPermission(permitted)
      setLoading(false)
    }

    checkPermission()
  }, [module, action])

  if (loading) {
    return null 
  }

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export function usePermission(module: string, action: 'view' | 'create' | 'edit' | 'delete') {
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      const role = await getUserRole()
      
      let permitted = false
      switch (action) {
        case 'view':
          permitted = canView(role, module)
          break
        case 'create':
          permitted = canCreate(role, module)
          break
        case 'edit':
          permitted = canEdit(role, module)
          break
        case 'delete':
          permitted = canDelete(role, module)
          break
      }
      
      setHasPermission(permitted)
      setLoading(false)
    }

    checkPermission()
  }, [module, action])

  return { hasPermission, loading }
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole>('viewer')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      const userRole = await getUserRole()
      setRole(userRole)
      setLoading(false)
    }

    fetchRole()
  }, [])

  return { role, loading }
}