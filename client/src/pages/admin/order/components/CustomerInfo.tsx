import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddressService, Province, District, Ward } from '@/services/address.service'
import { useToast } from '@/hooks/use-toast'

interface CustomerInfo {
    name: string
    phone: string
    email: string
    address: string
    note?: string
}

interface CustomerInfoProps {
    customerInfo?: CustomerInfo
    onCustomerInfoChange: (customerInfo: CustomerInfo) => void
}

export default function CustomerInfo({
    customerInfo,
    onCustomerInfoChange
}: CustomerInfoProps) {
    const { toast } = useToast()

    const defaultCustomerInfo: CustomerInfo = {
        name: '',
        phone: '',
        email: '',
        address: '',
        note: ''
    }

    const currentInfo = customerInfo || defaultCustomerInfo

    // State cho dialog cập nhật thông tin
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [updateForm, setUpdateForm] = useState(currentInfo)

    // State cho dialog địa chỉ
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedProvince, setSelectedProvince] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedWard, setSelectedWard] = useState('')
    const [detailAddress, setDetailAddress] = useState('')
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
    const [isLoadingWards, setIsLoadingWards] = useState(false)

    // Load provinces từ API
    useEffect(() => {
        const loadProvinces = async () => {
            setIsLoadingProvinces(true)
            try {
                const provincesData = await AddressService.getProvincesWithCache()
                setProvinces(provincesData)
            } catch (error) {
                console.error('Error loading provinces:', error)
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách tỉnh/thành phố",
                    variant: "destructive"
                })
            } finally {
                setIsLoadingProvinces(false)
            }
        }

        loadProvinces()
    }, [])

    // Load districts khi chọn province
    useEffect(() => {
        const loadDistricts = async () => {
            if (selectedProvince) {
                setIsLoadingDistricts(true)
                try {
                    const districtsData = await AddressService.getDistrictsByProvinceCode(selectedProvince)
                    setDistricts(districtsData)
                } catch (error) {
                    console.error('Error loading districts:', error)
                    toast({
                        title: "Lỗi",
                        description: "Không thể tải danh sách quận/huyện",
                        variant: "destructive"
                    })
                } finally {
                    setIsLoadingDistricts(false)
                }
                setSelectedDistrict('')
                setWards([])
                setSelectedWard('')
            } else {
                setDistricts([])
                setSelectedDistrict('')
                setWards([])
                setSelectedWard('')
            }
        }

        loadDistricts()
    }, [selectedProvince])

    // Load wards khi chọn district
    useEffect(() => {
        const loadWards = async () => {
            if (selectedDistrict) {
                setIsLoadingWards(true)
                try {
                    const wardsData = await AddressService.getWardsByDistrictCode(selectedDistrict)
                    setWards(wardsData)
                } catch (error) {
                    console.error('Error loading wards:', error)
                    toast({
                        title: "Lỗi",
                        description: "Không thể tải danh sách phường/xã",
                        variant: "destructive"
                    })
                } finally {
                    setIsLoadingWards(false)
                }
                setSelectedWard('')
            } else {
                setWards([])
                setSelectedWard('')
            }
        }

        loadWards()
    }, [selectedDistrict])

    const handleUpdateSubmit = () => {
        onCustomerInfoChange(updateForm)
        setIsUpdateDialogOpen(false)
    }

    const handleAddressSubmit = () => {
        // Validate địa chỉ
        const provinceName = provinces.find(p => p.code === selectedProvince)?.name || ''
        const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
        const wardName = wards.find(w => w.code === selectedWard)?.name || ''

        const validation = AddressService.validateAddress(provinceName, districtName, wardName, detailAddress)

        if (!validation.isValid) {
            toast({
                title: "Lỗi",
                description: validation.errors.join(', '),
                variant: "destructive"
            })
            return
        }

        const fullAddress = AddressService.formatFullAddress(provinceName, districtName, wardName, detailAddress)

        onCustomerInfoChange({
            ...currentInfo,
            address: fullAddress
        })
        setIsAddressDialogOpen(false)

        // Reset form
        setSelectedProvince('')
        setSelectedDistrict('')
        setSelectedWard('')
        setDetailAddress('')

        toast({
            title: "Thành công",
            description: "Đã cập nhật địa chỉ khách hàng"
        })
    }

    const handleZaloClick = () => {
        if (currentInfo.phone) {
            // Mở Zalo với số điện thoại
            window.open(`https://zalo.me/${currentInfo.phone.replace(/\D/g, '')}`, '_blank')
        }
    }

    return (
        <Card className="m-2">
            <CardHeader>
                <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Hiển thị thông tin khách hàng */}
                <div className="space-y-2">
                    <div className="flex">
                        <span className="w-24 text-sm font-bold">Họ và Tên:</span>
                        <span className="text-sm font-bold">{currentInfo.name || 'Khách lẻ'}</span>
                    </div>
                    <div className="flex">
                        <span className="w-24 text-sm font-bold">Số điện thoại:</span>
                        <span className="text-sm font-bold">{currentInfo.phone || '(Chưa khai báo)'}</span>
                    </div>
                    <div className="flex">
                        <span className="w-24 text-sm font-bold">Địa chỉ:</span>
                        <span className="text-sm font-bold">{currentInfo.address || '(Chưa khai báo)'}</span>
                    </div>
                </div>

                {/* Các nút hành động */}
                <div className="flex justify-between gap-2 pt-2">
                    {/* Nút Cập nhật */}
                    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="bg-gray-500 w-[120px] hover:bg-gray-600 text-white">
                                Cập nhật
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Cập nhật thông tin khách hàng</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="">
                                        Họ và Tên:
                                    </Label>
                                    <Input
                                        id="name"
                                        value={updateForm.name}
                                        onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="">
                                        Phone:
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={updateForm.phone}
                                        onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="">
                                        Email:
                                    </Label>
                                    <Input
                                        id="email"
                                        value={updateForm.email}
                                        onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleUpdateSubmit}>
                                    Lưu thay đổi
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Nút Địa chỉ */}
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="bg-blue-500 w-[120px] hover:bg-blue-600 text-white">
                                Địa chỉ
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Chọn địa chỉ</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="province" className="text-right">
                                        Tỉnh/Thành phố
                                    </Label>
                                    <Select value={selectedProvince} onValueChange={setSelectedProvince} disabled={isLoadingProvinces}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder={isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="district" className="text-right">
                                        Quận/Huyện
                                    </Label>
                                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedProvince || isLoadingDistricts}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn quận/huyện"} />
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
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="ward" className="text-right">
                                        Phường/Xã
                                    </Label>
                                    <Select value={selectedWard} onValueChange={setSelectedWard} disabled={!selectedDistrict || isLoadingWards}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder={isLoadingWards ? "Đang tải..." : "Chọn phường/xã"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wards.map((ward) => (
                                                <SelectItem key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="detail" className="text-right">
                                        Địa chỉ chi tiết
                                    </Label>
                                    <Input
                                        id="detail"
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        placeholder="Số nhà, tên đường..."
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddressSubmit}>
                                    Lưu địa chỉ
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </div>
            </CardContent>
        </Card>
    )
}
