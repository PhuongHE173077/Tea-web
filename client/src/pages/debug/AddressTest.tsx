import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressService } from '@/services/address.service'
import { getProvincesAPIs, getDistrictsByProvinceCodeAPIs, getWardsByDistrictCodeAPIs } from '@/apis/address.apis'

export default function AddressTest() {
    const [provinces, setProvinces] = useState<any[]>([])
    const [districts, setDistricts] = useState<any[]>([])
    const [wards, setWards] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, `[${timestamp}] ${message}`])
        console.log(message)
    }

    const testDirectAPI = async () => {
        setLoading(true)
        setError('')
        addLog('🧪 Testing direct API call...')
        
        try {
            const response = await getProvincesAPIs()
            addLog(`✅ Direct API success: ${response.data.data.length} provinces`)
            setProvinces(response.data.data)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
            addLog(`❌ Direct API error: ${errorMsg}`)
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const testAddressService = async () => {
        setLoading(true)
        setError('')
        addLog('🧪 Testing AddressService...')
        
        try {
            const provincesData = await AddressService.getProvinces()
            addLog(`✅ AddressService success: ${provincesData.length} provinces`)
            setProvinces(provincesData)
        } catch (err: any) {
            const errorMsg = err.message || 'Unknown error'
            addLog(`❌ AddressService error: ${errorMsg}`)
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const testDistricts = async (provinceCode: string) => {
        setLoading(true)
        setError('')
        addLog(`🧪 Testing districts for province ${provinceCode}...`)

        try {
            const response = await getDistrictsByProvinceCodeAPIs(provinceCode)
            addLog(`✅ Districts API success: ${response.data.data.length} districts`)
            setDistricts(response.data.data)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
            addLog(`❌ Districts API error: ${errorMsg}`)
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const testWards = async (districtCode: string) => {
        setLoading(true)
        setError('')
        addLog(`🧪 Testing wards for district ${districtCode}...`)

        try {
            const response = await getWardsByDistrictCodeAPIs(districtCode)
            addLog(`✅ Wards API success: ${response.data.data.length} wards`)
            setWards(response.data.data)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
            addLog(`❌ Wards API error: ${errorMsg}`)
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const clearLogs = () => {
        setLogs([])
        setError('')
        setProvinces([])
        setDistricts([])
        setWards([])
    }

    useEffect(() => {
        addLog('🚀 AddressTest component mounted')
        addLog(`📡 API Base URL: ${import.meta.env.VITE_APP_API_URL}`)
    }, [])

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>🧪 Address API Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        <Button 
                            onClick={testDirectAPI} 
                            disabled={loading}
                            variant="outline"
                        >
                            Test Direct API
                        </Button>
                        <Button 
                            onClick={testAddressService} 
                            disabled={loading}
                            variant="outline"
                        >
                            Test AddressService
                        </Button>
                        <Button
                            onClick={() => testDistricts('01')}
                            disabled={loading}
                            variant="outline"
                        >
                            Test Districts (Hà Nội)
                        </Button>
                        <Button
                            onClick={() => testWards('001')}
                            disabled={loading}
                            variant="outline"
                        >
                            Test Wards (Ba Đình)
                        </Button>
                        <Button 
                            onClick={clearLogs} 
                            variant="destructive"
                        >
                            Clear Logs
                        </Button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {loading && (
                        <div className="p-3 bg-blue-100 border border-blue-300 rounded text-blue-700">
                            Loading...
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Provinces Results */}
            {provinces.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>📍 Provinces ({provinces.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {provinces.map((province) => (
                                <div 
                                    key={province.code} 
                                    className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => testDistricts(province.code)}
                                >
                                    <div className="font-medium">{province.name}</div>
                                    <div className="text-sm text-gray-500">Code: {province.code}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Districts Results */}
            {districts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>🏘️ Districts ({districts.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {districts.map((district) => (
                                <div
                                    key={district.code}
                                    className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => testWards(district.code)}
                                >
                                    <div className="font-medium">{district.name}</div>
                                    <div className="text-sm text-gray-500">Code: {district.code}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Wards Results */}
            {wards.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>🏠 Wards ({wards.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {wards.map((ward) => (
                                <div key={ward.code} className="p-2 border rounded">
                                    <div className="font-medium">{ward.name}</div>
                                    <div className="text-sm text-gray-500">Code: {ward.code}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Logs */}
            <Card>
                <CardHeader>
                    <CardTitle>📝 Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-100 p-3 rounded max-h-60 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">No logs yet...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="text-sm font-mono">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
