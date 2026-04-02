import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { useAuth } from '@/hooks/use-auth'
import type { File as FileRecord, Issue as IssueRecord, User as UserRecord } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' }
]

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const CATEGORY_OPTIONS = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' }
]

function formatDate(d: Date | string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function IssueDetailPage() {
  const { projectId, issueId } = useParams({ strict: false })
  const { user } = useAuth()
  const navigate = useNavigate()
  const [issue, setIssue] = useState<IssueRecord | null>(null)
  const [members, setMembers] = useState<UserRecord[]>([])
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('open')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('feature')
  const [assignee, setAssignee] = useState<string | null>(null)

  useEffect(() => {
    if (!issueId) return
    const load = async () => {
      setIsLoading(true)
      const [issueResult, usersResult] = await Promise.all([
        window.callApi(IpcChannel.ISSUE_GET, { issueId }),
        window.callApi(IpcChannel.AUTH_LIST_USERS)
      ])
      const issueData = issueResult.data as IssueRecord | null
      if (issueData) {
        setIssue(issueData)
        setTitle(issueData.issue_title)
        setDescription(issueData.issue_desc || '')
        setStatus(issueData.issue_status || 'open')
        setPriority(issueData.issue_priority || 'medium')
        setCategory(issueData.issue_category || 'feature')
        setAssignee(issueData.issue_assigned_to)
      }
      if (Array.isArray(usersResult.data)) setMembers(usersResult.data as UserRecord[])

      // Fetch attached files
      const filesResult = await window.callApi(IpcChannel.STORAGE_LIST_ISSUE_FILES, { issueId })
      if (Array.isArray(filesResult.data)) setFiles(filesResult.data as FileRecord[])

      setIsLoading(false)
    }
    load()
  }, [issueId])

  const handleSave = async () => {
    if (!issue || !user) return
    setIsSaving(true)
    const result = await window.callApi(IpcChannel.ISSUE_UPDATE, {
      issueId: issue.issue_id,
      issueTitle: title,
      issueDesc: description,
      issueStatus: status,
      issuePriority: priority,
      issueCategory: category,
      assignedTo: assignee,
      userId: user.user_id
    })
    if (result.error) {
      toast.error(`Failed to save: ${result.error.message}`)
    } else {
      toast.success('Issue updated')
      setIssue(result.data as IssueRecord)
    }
    setIsSaving(false)
  }

  const handleFileAttach = async () => {
    if (!issue) return
    const dialogResult = await window.callApi(IpcChannel.SYSTEM_OPEN_DIALOG, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'All Files', extensions: ['*'] }]
    })

    const openResult = dialogResult.data
    if (!openResult || openResult.canceled || !openResult.filePaths.length) return

    for (const filePath of openResult.filePaths) {
      const response = await fetch(`file://${filePath}`)
      const arrayBuffer = await response.arrayBuffer()
      const fileName = filePath.split(/[\\/]/).pop() || 'file'

      const uploadResult = await window.callApi(IpcChannel.STORAGE_UPLOAD_FILE, {
        fileName,
        filePath,
        fileData: arrayBuffer
      })

      if (uploadResult.data) {
        const fileRecord = uploadResult.data as FileRecord
        await window.callApi(IpcChannel.STORAGE_LINK_FILE, {
          issueId: issue.issue_id,
          fileId: fileRecord.file_id
        })
      }
    }

    const filesResult = await window.callApi(IpcChannel.STORAGE_LIST_ISSUE_FILES, { issueId: issue.issue_id })
    if (Array.isArray(filesResult.data)) setFiles(filesResult.data as FileRecord[])
    toast.success('Files attached')
  }

  const handleFileRemove = async (fileId: string) => {
    if (!issue) return
    await window.callApi(IpcChannel.STORAGE_UNLINK_FILE, {
      issueId: issue.issue_id,
      fileId
    })
    setFiles((prev) => prev.filter((f) => f.file_id !== fileId))
    toast.success('File removed')
  }

  if (isLoading)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  if (!issue)
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Issue not found</p>
      </div>
    )

  return (
    <div className='p-6 h-full overflow-auto'>
      {/* Back button */}
      <button
        type='button'
        onClick={() => navigate({ to: '/projects/$projectId/issues', params: { projectId: projectId! } })}
        className='text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1'
      >
        <ArrowLeft className='size-4' />
        Back to issues
      </button>

      {/* Header */}
      <div className='flex items-start justify-between mb-6'>
        <div className='flex-1'>
          <span className='text-sm text-muted-foreground font-mono'>{issue.issue_key}</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='mt-1 text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0'
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} size='sm'>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className='grid grid-cols-3 gap-8'>
        {/* Main content */}
        <div className='col-span-2 space-y-6'>
          <div>
            <Label className='mb-2 block'>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Add a description...'
              className='min-h-[200px] resize-y'
            />
          </div>

          {/* Attachments */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <Label>Attachments</Label>
              <Button variant='outline' size='sm' onClick={handleFileAttach}>
                Attach File
              </Button>
            </div>
            {files.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No attachments</p>
            ) : (
              <div className='space-y-2'>
                {files.map((file) => (
                  <div key={file.file_id} className='flex items-center justify-between p-2 rounded border'>
                    <div className='flex items-center gap-2'>
                      <Paperclip className='size-4 text-muted-foreground' />
                      <span className='text-sm'>{file.file_name}</span>
                      <span className='text-xs text-muted-foreground'>
                        {file.file_size ? `${Math.round(file.file_size / 1024)} KB` : ''}
                      </span>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleFileRemove(file.file_id)}
                      className='text-destructive h-6 px-2'
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-4'>
          {/* Status */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Assignee</Label>
            <Select value={assignee || 'unassigned'} onValueChange={(v) => setAssignee(v === 'unassigned' ? null : v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='unassigned'>Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.user_name || m.user_email || 'Unknown'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timestamps */}
          <div className='pt-4 border-t space-y-2'>
            <div className='flex justify-between text-xs'>
              <span className='text-muted-foreground'>Created</span>
              <span>{formatDate(issue.issue_created_at)}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-muted-foreground'>Updated</span>
              <span>{formatDate(issue.issue_updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
