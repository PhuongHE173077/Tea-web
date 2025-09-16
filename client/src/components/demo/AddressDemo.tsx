import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddressService, Province, District } from "@/services/address.service"

export default function AddressDemo() {
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
    const [street, setStreet] = useState('')
    const [fullAddress, setFullAddress] = useState('')
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)

    useEffect(() => {
        loadProvinces()
    }, [])

    const loadProvinces = async () => {
        setIsLoadingProvinces(true)
        try {
            const provincesData = await AddressService.getProvincesWithCache()
            setProvinces(provincesData)
        } catch (error) {
            console.error('Error loading provinces:', error)
        } finally {
            setIsLoadingProvinces(false)
        }
    }

    const handleProvinceChange = async (provinceCode: string) => {
        const province = provinces.find(p => p.code === provinceCode)
        if (province) {
            setSelectedProvince(province)
            setSelectedDistrict(null)
            updateFullAddress(province.name, '', street)

            // Load districts
            await loadDistricts(provinceCode)
        }
    }

    const loadDistricts = async (provinceCode: string) => {
        setIsLoadingDistricts(true)
        try {
            const districtsData = await AddressService.getDistrictsByProvinceCode(provinceCode)
            setDistricts(districtsData)
        } catch (error) {
            console.error('Error loading districts:', error)
            setDistricts([])
        } finally {
            setIsLoadingDistricts(false)
        }
    }

    const handleDistrictChange = (districtCode: string) => {
        const district = districts.find(d => d.code === districtCode)
        if (district) {
            setSelectedDistrict(district)
            updateFullAddress(selectedProvince?.name || '', district.name, street)
        }
    }

    const handleStreetChange = (value: string) => {
        setStreet(value)
        updateFullAddress(
            selectedProvince?.name || '', 
            selectedDistrict?.name || '', 
            value
        )
    }

    const updateFullAddress = (province: string, district: string, streetAddr: string) => {
        if (province && district && streetAddr) {
            const formatted = AddressService.formatFullAddress(province, district, streetAddr)
            setFullAddress(formatted)
        } else {
            setFullAddress('')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Demo Address Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Province Selection */}
                    <div>
                        <Label>Tỉnh/Thành phố</Label>
                        <Select onValueChange={handleProvinceChange} disabled={isLoadingProvinces}>
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map((province) => (
                                    <SelectItem key={province.code} value={province.code}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* District Selection */}
                    <div>
                        <Label>Quận/Huyện</Label>
                        <Select
                            onValueChange={handleDistrictChange}
                            disabled={!selectedProvince || isLoadingDistricts}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    !selectedProvince
                                        ? "Vui lòng chọn tỉnh/thành phố trước"
                                        : isLoadingDistricts
                                        ? "Đang tải..."
                                        : "Chọn quận/huyện"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {districts.map((district) => (
                                    <SelectItem key={district.code} value={district.code}>
                                        {district.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Street Address */}
                    <div>
                        <Label>Địa chỉ cụ thể</Label>
                        <Input
                            value={street}
                            onChange={(e) => handleStreetChange(e.target.value)}
                            placeholder="Nhập số nhà, tên đường, phường/xã"
                        />
                    </div>

                    {/* Full Address Preview */}
                    {fullAddress && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <Label className="font-semibold">Địa chỉ đầy đủ:</Label>
                            <p className="mt-1 text-sm">{fullAddress}</p>
                        </div>
                    )}

                    {/* Debug Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                        <h4 className="font-semibold mb-2">Debug Info:</h4>
                        <p><strong>Province Code:</strong> {selectedProvince?.code || 'None'}</p>
                        <p><strong>Province Name:</strong> {selectedProvince?.name || 'None'}</p>
                        <p><strong>District Code:</strong> {selectedDistrict?.code || 'None'}</p>
                        <p><strong>District Name:</strong> {selectedDistrict?.name || 'None'}</p>
                        <p><strong>Street:</strong> {street || 'None'}</p>
                        <p><strong>Available Districts:</strong> {districts.length}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
