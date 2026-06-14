import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Code, Heading2, Italic, List, ListOrdered, Redo, Strikethrough, Undo } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/atoms/Button'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write something...',
  editable = true,
  className
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  // Sync content from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className={`border rounded-md ${className || ''}`}>
      {editable && (
        <div className='flex flex-wrap gap-1 p-1 border-b bg-muted/30'>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            icon={<Bold className='size-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            icon={<Italic className='size-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            icon={<Strikethrough className='size-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            icon={<Code className='size-4' />}
          />
          <div className='w-px bg-border mx-1' />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            icon={<Heading2 className='size-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            icon={<List className='size-4' />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            icon={<ListOrdered className='size-4' />}
          />
          <div className='w-px bg-border mx-1' />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={<Undo className='size-4' />} />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={<Redo className='size-4' />} />
        </div>
      )}
      <EditorContent
        editor={editor}
        className='prose prose-sm dark:prose-invert max-w-none p-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px] [&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none'
      />
    </div>
  )
}

function ToolbarButton({ onClick, active, icon }: { onClick: () => void; active?: boolean; icon: React.ReactNode }) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      onClick={onClick}
      className={`h-7 w-7 p-0 ${active ? 'bg-muted' : ''}`}
    >
      {icon}
    </Button>
  )
}
