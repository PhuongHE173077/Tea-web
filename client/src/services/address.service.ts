import {
    getProvincesAPIs,
    getDistrictsByProvinceCodeAPIs,
    getWardsByDistrictCodeAPIs,
    Province as APIProvince,
    District as APIDistrict,
    Ward as APIWard
} from "@/apis/address.apis"

// Local interfaces for compatibility
export interface Province {
    code: string
    name: string
    full_name?: string
    districts?: District[]
}

export interface District {
    code: string
    name: string
    full_name?: string
    province_code?: string
}

export interface Ward {
    code: string
    name: string
    full_name?: string
    district_code?: string
}

// Dữ liệu sẽ được lấy từ API

export class AddressService {
    // Lấy danh sách tỉnh/thành phố từ API
    static async getProvinces(filters?: { search?: string }): Promise<Province[]> {
        try {
            const response = await getProvincesAPIs(filters)
            if (response.data.success) {
                return response.data.data.map((province: APIProvince) => ({
                    code: province.code,
                    name: province.name,
                    full_name: province.full_name
                }))
            }
            return []
        } catch (error) {
            console.error('Error fetching provinces:', error)
            return []
        }
    }

    // Lấy danh sách quận/huyện theo tỉnh/thành phố từ API
    static async getDistrictsByProvinceCode(provinceCode: string, filters?: { search?: string }): Promise<District[]> {
        try {
            const response = await getDistrictsByProvinceCodeAPIs(provinceCode, filters)
            if (response.data.success) {
                return response.data.data.map((district: APIDistrict) => ({
                    code: district.code,
                    name: district.name,
                    full_name: district.full_name,
                    province_code: district.province_code
                }))
            }
            return []
        } catch (error) {
            console.error('Error fetching districts:', error)
            return []
        }
    }

    // Lấy danh sách phường/xã theo quận/huyện từ API
    static async getWardsByDistrictCode(districtCode: string, filters?: { search?: string }): Promise<Ward[]> {
        try {
            const response = await getWardsByDistrictCodeAPIs(districtCode, filters)
            if (response.data.success) {
                return response.data.data.map((ward: APIWard) => ({
                    code: ward.code,
                    name: ward.name,
                    full_name: ward.full_name,
                    district_code: ward.district_code
                }))
            }
            return []
        } catch (error) {
            console.error('Error fetching wards:', error)
            return []
        }
    }

    // Format địa chỉ đầy đủ
    static formatFullAddress(province: string, district: string, ward: string, street: string): string {
        const parts = [street, ward, district, province].filter(part => part && part.trim())
        return parts.join(', ')
    }

    // Validate địa chỉ
    static validateAddress(province: string, district: string, ward: string, street: string): {
        isValid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        if (!province || !province.trim()) {
            errors.push('Vui lòng chọn tỉnh/thành phố')
        }

        if (!district || !district.trim()) {
            errors.push('Vui lòng chọn quận/huyện')
        }

        if (!ward || !ward.trim()) {
            errors.push('Vui lòng chọn phường/xã')
        }

        if (!street || !street.trim()) {
            errors.push('Vui lòng nhập địa chỉ cụ thể')
        } else if (street.trim().length < 5) {
            errors.push('Địa chỉ cụ thể phải có ít nhất 5 ký tự')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    // Cache cho provinces để tránh gọi API nhiều lần
    private static provincesCache: Province[] | null = null
    private static cacheTimestamp: number = 0
    private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    static async getProvincesWithCache(): Promise<Province[]> {
        const now = Date.now()

        // Kiểm tra cache còn hiệu lực không
        if (this.provincesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
            return this.provincesCache
        }

        // Fetch mới từ API
        const provinces = await this.getProvinces()
        this.provincesCache = provinces
        this.cacheTimestamp = now

        return provinces
    }

    // Clear cache khi cần
    static clearCache(): void {
        this.provincesCache = null
        this.cacheTimestamp = 0
    }
}
