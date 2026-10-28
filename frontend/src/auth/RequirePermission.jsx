import { useAuth } from '@/auth/AuthContext'
import { RequireLogin } from '@/auth/RequireLogin'

function PermissionContent({ permission, anyOf, children }) {
  const { hasPermission } = useAuth()
  const requiredPermissions = anyOf.length > 0 ? anyOf : [permission]

  if (!requiredPermissions.some((key) => key && hasPermission(key))) {
    return <p role="alert">You don't have access to this page.</p>
  }

  return children
}

export function RequirePermission({
  permission,
  anyOf = [],
  children,
}) {
  return (
    <RequireLogin>
      <PermissionContent permission={permission} anyOf={anyOf}>
        {children}
      </PermissionContent>
    </RequireLogin>
  )
}
