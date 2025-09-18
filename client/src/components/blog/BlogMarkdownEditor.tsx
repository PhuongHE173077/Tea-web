import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Edit, FileText, Code } from 'lucide-react'

interface BlogMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  label?: string
  error?: string
  disabled?: boolean
}

function BlogMarkdownEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung blog bằng Markdown...",
  height = 500,
  label = "Nội dung blog",
  error,
  disabled = false
}: BlogMarkdownEditorProps) {

  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('edit')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Tính toán thời gian đọc ước tính
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // Tính toán số từ
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Tính toán số ký tự
  const getCharCount = (text: string): number => {
    return text.length
  }

  const readingTime = calculateReadingTime(value)
  const wordCount = getWordCount(value)
  const charCount = getCharCount(value)

  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-sm font-medium">
          {label} *
        </Label>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Markdown Editor</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{wordCount} từ</span>
              </div>
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>{charCount} ký tự</span>
              </div>
              <Badge variant="outline">
                ~{readingTime} phút đọc
              </Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Chỉnh sửa
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Xem trước
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chia đôi
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {mounted && (
            <div data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
              <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize, {
                    tagNames: ['img', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'strong', 'em', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                    attributes: {
                      img: ['src', 'alt', 'title', 'width', 'height'],
                      a: ['href', 'title', 'target'],
                      '*': ['className']
                    },
                    protocols: {
                      src: ['http', 'https', 'data'],
                      href: ['http', 'https', 'mailto']
                    }
                  }]]
                }}
                height={height}
                preview={activeTab === 'edit' ? 'edit' : activeTab === 'preview' ? 'preview' : 'live'}
                hideToolbar={false}
                visibleDragBar={false}
                textareaProps={{
                  placeholder,
                  disabled,
                  style: {
                    fontSize: 14,
                    lineHeight: 1.6,
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  }
                }}
                data-color-mode={theme === 'dark' ? 'dark' : 'light'}
              />
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
          
          
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogMarkdownEditor
