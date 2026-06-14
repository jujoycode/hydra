import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { RichTextEditor } from '@/components/atoms/RichTextEditor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select'
import { useAuth } from '@/hooks/use-auth'
import type {
  Comment as CommentRecord,
  File as FileRecord,
  Issue as IssueRecord,
  IssueRelation as IssueRelationRecord,
  Label as LabelRecord,
  User as UserRecord
} from '@/interface/CoreInterface'
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
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [issueLabels, setIssueLabels] = useState<LabelRecord[]>([])
  const [allLabels, setAllLabels] = useState<LabelRecord[]>([])
  const [relations, setRelations] = useState<IssueRelationRecord[]>([])
  const [projectIssues, setProjectIssues] = useState<IssueRecord[]>([])
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
      const [
        issueResult,
        usersResult,
        commentsResult,
        issueLabelsResult,
        allLabelsResult,
        relationsResult,
        projectIssuesResult
      ] = await Promise.all([
        window.callApi(IpcChannel.ISSUE_GET, { issueId }),
        window.callApi(IpcChannel.AUTH_LIST_USERS),
        window.callApi(IpcChannel.COMMENT_LIST, { issueId }),
        window.callApi(IpcChannel.LABEL_LIST_BY_ISSUE, { issueId }),
        window.callApi(IpcChannel.LABEL_LIST),
        window.callApi(IpcChannel.ISSUE_RELATION_LIST, { issueId }),
        window.callApi(IpcChannel.ISSUE_LIST, { projectId: projectId! })
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
      if (Array.isArray(commentsResult.data)) setComments(commentsResult.data as CommentRecord[])
      if (Array.isArray(issueLabelsResult.data)) setIssueLabels(issueLabelsResult.data as LabelRecord[])
      if (Array.isArray(allLabelsResult.data)) setAllLabels(allLabelsResult.data as LabelRecord[])
      if (Array.isArray(relationsResult.data)) setRelations(relationsResult.data as IssueRelationRecord[])
      if (Array.isArray(projectIssuesResult.data)) setProjectIssues(projectIssuesResult.data as IssueRecord[])

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

  const handleAddComment = async () => {
    if (!issue || !user || !newComment.trim()) return
    const result = await window.callApi(IpcChannel.COMMENT_CREATE, {
      issueId: issue.issue_id,
      commentContent: newComment.trim(),
      userId: user.user_id
    })
    if (result.data) {
      setComments((prev) => [result.data as CommentRecord, ...prev])
      setNewComment('')
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!user || !editingContent.trim()) return
    const result = await window.callApi(IpcChannel.COMMENT_UPDATE, {
      commentId,
      commentContent: editingContent.trim(),
      userId: user.user_id
    })
    if (result.data) {
      setComments((prev) => prev.map((c) => (c.comment_id === commentId ? (result.data as CommentRecord) : c)))
      setEditingCommentId(null)
      setEditingContent('')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    await window.callApi(IpcChannel.COMMENT_DELETE, { commentId })
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId))
  }

  const handleAddLabel = async (labelId: string) => {
    if (!issue) return
    await window.callApi(IpcChannel.LABEL_LINK, { issueId: issue.issue_id, labelId })
    const label = allLabels.find((l) => l.label_id === labelId)
    if (label) setIssueLabels((prev) => [...prev, label])
  }

  const handleRemoveLabel = async (labelId: string) => {
    if (!issue) return
    await window.callApi(IpcChannel.LABEL_UNLINK, { issueId: issue.issue_id, labelId })
    setIssueLabels((prev) => prev.filter((l) => l.label_id !== labelId))
  }

  const handleAddRelation = async (targetIssueId: string, relationType: string) => {
    if (!issue) return
    const result = await window.callApi(IpcChannel.ISSUE_RELATION_CREATE, {
      sourceIssueId: issue.issue_id,
      targetIssueId,
      relationType
    })
    if (result.data) setRelations((prev) => [...prev, result.data as IssueRelationRecord])
  }

  const handleRemoveRelation = async (relationId: string) => {
    await window.callApi(IpcChannel.ISSUE_RELATION_DELETE, { relationId })
    setRelations((prev) => prev.filter((r) => r.relation_id !== relationId))
  }

  if (isLoading)
    return (
      <div className='p-page'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  if (!issue)
    return (
      <div className='p-page'>
        <p className='text-muted-foreground'>Issue not found</p>
      </div>
    )

  return (
    <div className='p-page h-full overflow-auto'>
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
      <div className='flex items-start justify-between mb-section'>
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
        <div className='col-span-2 space-y-section'>
          <div>
            <Label className='mb-2 block'>Description</Label>
            <RichTextEditor content={description} onChange={setDescription} placeholder='Add a description...' />
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

          {/* Comments */}
          <div>
            <Label className='mb-2 block'>Comments</Label>

            {/* New comment input */}
            <div className='space-y-2 mb-4'>
              <RichTextEditor
                content={newComment}
                onChange={setNewComment}
                placeholder='Add a comment...'
                className='min-h-[80px]'
              />
              <div className='flex justify-end'>
                <Button onClick={handleAddComment} disabled={!newComment.trim()} size='sm'>
                  Post
                </Button>
              </div>
            </div>

            {/* Comment list */}
            {comments.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No comments yet</p>
            ) : (
              <div className='space-y-3'>
                {comments.map((comment) => {
                  const isEditing = editingCommentId === comment.comment_id
                  const authorName =
                    members.find((m) => m.user_id === comment.comment_created_by)?.user_name || 'Unknown'
                  const isOwner = user?.user_id === comment.comment_created_by

                  return (
                    <div key={comment.comment_id} className='rounded border p-3'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <Avatar className='size-6 shrink-0'>
                            <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm font-medium'>{authorName}</span>
                          <span className='text-xs text-muted-foreground'>
                            {formatDate(comment.comment_created_at)}
                          </span>
                        </div>
                        {isOwner && !isEditing && (
                          <div className='flex gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-6 px-2 text-xs'
                              onClick={() => {
                                setEditingCommentId(comment.comment_id)
                                setEditingContent(comment.comment_content)
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-6 px-2 text-xs text-destructive'
                              onClick={() => handleDeleteComment(comment.comment_id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <div className='space-y-2'>
                          <RichTextEditor
                            content={editingContent}
                            onChange={setEditingContent}
                            className='min-h-[60px]'
                          />
                          <div className='flex gap-1 justify-end'>
                            <Button size='sm' variant='ghost' onClick={() => setEditingCommentId(null)}>
                              Cancel
                            </Button>
                            <Button size='sm' onClick={() => handleUpdateComment(comment.comment_id)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className='text-sm prose prose-sm dark:prose-invert max-w-none'
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: Tiptap이 생성한 HTML(화이트리스트 스키마)을 렌더링
                          dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-card'>
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

          {/* Labels */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Labels</Label>
            <div className='flex flex-wrap gap-1 mb-2'>
              {issueLabels.map((label) => (
                <span
                  key={label.label_id}
                  className='inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white'
                  style={{ backgroundColor: label.label_color }}
                >
                  {label.label_name}
                  <button type='button' onClick={() => handleRemoveLabel(label.label_id)} className='hover:opacity-70'>
                    ×
                  </button>
                </span>
              ))}
            </div>
            {/* Dropdown to add labels */}
            <Select
              value=''
              onValueChange={(labelId) => {
                if (labelId && !issueLabels.some((l) => l.label_id === labelId)) {
                  handleAddLabel(labelId)
                }
              }}
            >
              <SelectTrigger className='h-8 text-xs'>
                <SelectValue placeholder='Add label...' />
              </SelectTrigger>
              <SelectContent>
                {allLabels
                  .filter((l) => !issueLabels.some((il) => il.label_id === l.label_id))
                  .map((label) => (
                    <SelectItem key={label.label_id} value={label.label_id}>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 rounded-full' style={{ backgroundColor: label.label_color }} />
                        {label.label_name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Related Issues */}
          <div>
            <Label className='mb-1 block text-xs text-muted-foreground'>Related Issues</Label>
            {relations.length > 0 && (
              <div className='space-y-1 mb-2'>
                {relations.map((rel) => {
                  const otherIssueId =
                    rel.source_issue_id === issue.issue_id ? rel.target_issue_id : rel.source_issue_id
                  const otherIssue = projectIssues.find((i) => i.issue_id === otherIssueId)
                  const relLabel = rel.relation_type.replace(/_/g, ' ')
                  return (
                    <div key={rel.relation_id} className='flex items-center justify-between text-xs'>
                      <div className='flex items-center gap-1 truncate'>
                        <span className='text-muted-foreground'>{relLabel}:</span>
                        <span className='font-mono'>{otherIssue?.issue_key || '...'}</span>
                        <span className='truncate'>{otherIssue?.issue_title || ''}</span>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveRelation(rel.relation_id)}
                        className='text-destructive hover:opacity-70'
                      >
                        x
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <div className='flex gap-1'>
              <Select
                value=''
                onValueChange={(val) => {
                  const [type, targetId] = val.split(':')
                  if (type && targetId) handleAddRelation(targetId, type)
                }}
              >
                <SelectTrigger className='h-7 text-xs'>
                  <SelectValue placeholder='Add relation...' />
                </SelectTrigger>
                <SelectContent>
                  {['blocks', 'is_blocked_by', 'relates_to'].flatMap((type) =>
                    projectIssues
                      .filter(
                        (i) =>
                          i.issue_id !== issue.issue_id &&
                          !relations.some((r) => r.source_issue_id === i.issue_id || r.target_issue_id === i.issue_id)
                      )
                      .map((i) => (
                        <SelectItem key={`${type}:${i.issue_id}`} value={`${type}:${i.issue_id}`}>
                          {type.replace(/_/g, ' ')} &rarr; {i.issue_key}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timestamps */}
          <div className='pt-4 border-t border-border/60 space-y-2'>
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
