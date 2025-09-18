import { useState } from 'react'
import BlogMarkdownEditor from '@/components/blog/BlogMarkdownEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'

const MarkdownTest = () => {
  const [content, setContent] = useState(`# Test Markdown Editor

## Kiểm tra ảnh

### 1. Ảnh đơn giản:
![Tea Image](https://th.bing.com/th/id/R.c5540533f3828969331adaddc500396b?rik=70AMAIVQIMG%2f7g&pid=ImgRaw&r=0)

### 2. Ảnh với alt text:
![Beautiful Tea Cup](https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400)

### 3. Ảnh với HTML:
<img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300" alt="Tea Leaves" width="300" />

### 4. Ảnh clickable:
[![Click me](https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200)](https://unsplash.com)

## Kiểm tra text formatting

**Bold text** và *italic text*

### Code block:
\`\`\`javascript
console.log("Hello Tea Web!");
\`\`\`

### List:
- Item 1
- Item 2
- Item 3

### Table:
| Loại trà | Giá | Mô tả |
|----------|-----|-------|
| Trà xanh | 100k | Thơm ngon |
| Trà đen | 120k | Đậm đà |

> Blockquote: "Trà là nghệ thuật sống"
`)

  const sampleImages = [
    {
      name: 'Ảnh Bing (URL bạn test)',
      url: 'https://th.bing.com/th/id/R.c5540533f3828969331adaddc500396b?rik=70AMAIVQIMG%2f7g&pid=ImgRaw&r=0',
      syntax: '![Tea Image](https://th.bing.com/th/id/R.c5540533f3828969331adaddc500396b?rik=70AMAIVQIMG%2f7g&pid=ImgRaw&r=0)'
    },
    {
      name: 'Ảnh Unsplash 1',
      url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
      syntax: '![Beautiful Tea Cup](https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400)'
    },
    {
      name: 'Ảnh Unsplash 2',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      syntax: '![Tea Leaves](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300)'
    },
    {
      name: 'Ảnh HTML với size',
      url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200',
      syntax: '<img src="https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200" alt="Tea" width="200" />'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã copy vào clipboard!')
  }

  const resetContent = () => {
    setContent(`# Test Markdown Editor

## Kiểm tra ảnh cơ bản:
![Tea Image](https://th.bing.com/th/id/R.c5540533f3828969331adaddc500396b?rik=70AMAIVQIMG%2f7g&pid=ImgRaw&r=0)

Nhập nội dung markdown của bạn ở đây...`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Test Markdown Editor</h1>
        <Button onClick={resetContent} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Markdown Editor */}
        <div className="lg:col-span-2">
          <BlogMarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Nhập markdown để test..."
            height={600}
          />
        </div>

        {/* Sample Images Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🖼️ Sample Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleImages.map((img, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="font-medium text-sm">{img.name}</div>
                  <img 
                    src={img.url} 
                    alt={img.name}
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded flex-1 truncate">
                      {img.syntax}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(img.syntax)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Markdown Syntax</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Ảnh:</strong> <code>![alt](url)</code></div>
              <div><strong>Link:</strong> <code>[text](url)</code></div>
              <div><strong>Bold:</strong> <code>**text**</code></div>
              <div><strong>Italic:</strong> <code>*text*</code></div>
              <div><strong>Code:</strong> <code>`code`</code></div>
              <div><strong>Header:</strong> <code># H1</code></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Content Length:</strong> {content.length} characters
            </div>
            <div>
              <strong>Word Count:</strong> {content.split(/\s+/).filter(w => w.length > 0).length} words
            </div>
            <div>
              <strong>Image Count:</strong> {(content.match(/!\[.*?\]\(.*?\)/g) || []).length} markdown images
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarkdownTest
