import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { Input } from './Membership.jsx'

export default function AdminSettings() {
  const { user, updateEmail, updatePassword, signOut } = useAuth()
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailMessage, setEmailMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleEmailChange(e) {
    e.preventDefault()
    setSavingEmail(true)
    setEmailMessage(null)
    try {
      await updateEmail(newEmail)
      setEmailMessage('Check your new email inbox to confirm the change.')
      setNewEmail('')
    } catch (err) {
      setEmailMessage('Could not update email. Please try again.')
    } finally {
      setSavingEmail(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordMessage(null)
    if (newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.')
      return
    }
    setSavingPassword(true)
    try {
      await updatePassword(newPassword)
      setPasswordMessage('Password updated.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMessage('Could not update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="max-w-xl space-y-12">
      <div>
        <h1 className="mb-8 font-display text-3xl text-ink">Settings</h1>
        <p className="text-sm text-muted">Signed in as <span className="text-ink">{user?.email}</span></p>
      </div>

      <form onSubmit={handleEmailChange} className="space-y-4 rounded-2xl border border-white/5 bg-surface/50 p-6">
        <h2 className="text-sm font-medium text-ink">Change Admin Email</h2>
        <Input label="New Email" type="email" value={newEmail} onChange={setNewEmail} />
        {emailMessage && <p className="text-sm text-muted">{emailMessage}</p>}
        <button type="submit" disabled={savingEmail || !newEmail} className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft disabled:opacity-60">
          {savingEmail ? 'Updating…' : 'Update Email'}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="space-y-4 rounded-2xl border border-white/5 bg-surface/50 p-6">
        <h2 className="text-sm font-medium text-ink">Change Password</h2>
        <Input label="New Password" type="password" value={newPassword} onChange={setNewPassword} />
        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
        {passwordMessage && <p className="text-sm text-muted">{passwordMessage}</p>}
        <button type="submit" disabled={savingPassword} className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-soft disabled:opacity-60">
          {savingPassword ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <button onClick={signOut} className="text-sm text-muted hover:text-ink">Sign out</button>
    </div>
  )
}
