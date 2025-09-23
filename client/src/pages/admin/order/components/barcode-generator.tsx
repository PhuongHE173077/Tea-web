
import JsBarcode from "jsbarcode"
import { useEffect, useState } from "react"

interface BarcodeGeneratorProps {
  value: string
  width?: number
  height?: number
  format?: string
  displayValue?: boolean
  onGenerated?: (dataUrl: string) => void
}

export const BarcodeGenerator = ({
  value,
  width = 2,
  height = 40,
  format = "CODE128",
  displayValue = false,
  onGenerated
}: BarcodeGeneratorProps) => {
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>("")

  useEffect(() => {
    if (!value) return

    try {
      // Tạo canvas để vẽ mã vạch
      const canvas = document.createElement('canvas')

      JsBarcode(canvas, value, {
        format: format as any,
        width: width,
        height: height,
        displayValue: displayValue,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
      })

      const dataUrl = canvas.toDataURL('image/png')
      setBarcodeDataUrl(dataUrl)

      if (onGenerated) {
        onGenerated(dataUrl)
      }
    } catch (error) {
      console.error('Error generating barcode:', error)
    }
  }, [value, width, height, format, displayValue, onGenerated])

  if (!barcodeDataUrl) {
    return <div>Đang tạo mã vạch...</div>
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={barcodeDataUrl}
        alt={`Barcode for ${value}`}
        className="max-w-full h-auto"
      />

    </div>
  )
}

// Hook để tạo barcode data URL
export const useBarcode = (value: string, options?: Partial<BarcodeGeneratorProps>) => {
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!value) return

    setIsLoading(true)
    setError(null)

    try {
      const canvas = document.createElement('canvas')

      JsBarcode(canvas, value, {
        format: (options?.format as any) || "CODE128",
        width: options?.width || 2,
        height: options?.height || 40,
        displayValue: options?.displayValue || false,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
      })

      const dataUrl = canvas.toDataURL('image/png')
      setBarcodeDataUrl(dataUrl)
    } catch (err) {
      setError('Không thể tạo mã vạch')
      console.error('Error generating barcode:', err)
    } finally {
      setIsLoading(false)
    }
  }, [value, options?.format, options?.width, options?.height, options?.displayValue])

  return { barcodeDataUrl, isLoading, error }
}

// Hàm utility để tạo URL từ ID đơn hàng
export const generateOrderUrl = (orderId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
  return `${baseUrl}/order/${orderId}`
}

// Hàm utility để tạo barcode data URL đồng bộ (cho PDF)
export const generateBarcodeDataUrl = (value: string): string => {
  if (typeof window === 'undefined') return ''

  try {
    const canvas = document.createElement('canvas')

    JsBarcode(canvas, value, {
      format: "CODE128",
      width: 2,
      height: 40,
      displayValue: false,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 5,
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error generating barcode:', error)
    return ''
  }
}
