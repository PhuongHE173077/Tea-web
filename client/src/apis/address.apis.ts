import axiosCustomize from "@/services/axios.customize"

// Address interfaces
export interface Province {
    _id: string
    code: string
    name: string
    name_en?: string
    full_name: string
    full_name_en?: string
    code_name: string
    administrative_unit_id?: number
    administrative_region_id?: number
    is_active: boolean
    createdAt: string
    updatedAt: string
}

export interface District {
    _id: string
    code: string
    name: string
    name_en?: string
    full_name: string
    full_name_en?: string
    code_name: string
    province_code: string
    administrative_unit_id?: number
    is_active: boolean
    createdAt: string
    updatedAt: string
}

export interface Ward {
    _id: string
    code: string
    name: string
    name_en?: string
    full_name: string
    full_name_en?: string
    code_name: string
    district_code: string
    administrative_unit_id?: number
    is_active: boolean
    createdAt: string
    updatedAt: string
}

export interface AddressFilters {
    search?: string
    is_active?: boolean
}

// Lấy danh sách tất cả tỉnh/thành phố
export const getProvincesAPIs = async (filters?: AddressFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    
    const queryString = params.toString()
    return axiosCustomize.get(`/address/provinces${queryString ? `?${queryString}` : ''}`)
}

// Lấy thông tin tỉnh/thành phố theo code
export const getProvinceByCodeAPIs = async (code: string) => {
    return axiosCustomize.get(`/address/provinces/${code}`)
}

// Lấy danh sách quận/huyện theo tỉnh/thành phố
export const getDistrictsByProvinceCodeAPIs = async (provinceCode: string, filters?: { search?: string }) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    return axiosCustomize.get(`/address/provinces/${provinceCode}/districts${queryString ? `?${queryString}` : ''}`)
}

// Lấy thông tin quận/huyện theo code
export const getDistrictByCodeAPIs = async (code: string) => {
    return axiosCustomize.get(`/address/districts/${code}`)
}

// Lấy danh sách phường/xã theo quận/huyện
export const getWardsByDistrictCodeAPIs = async (districtCode: string, filters?: { search?: string }) => {
    const params = new URLSearchParams()

    if (filters?.search) params.append('search', filters.search)

    const queryString = params.toString()
    return axiosCustomize.get(`/address/districts/${districtCode}/wards${queryString ? `?${queryString}` : ''}`)
}

// Lấy thông tin phường/xã theo code
export const getWardByCodeAPIs = async (code: string) => {
    return axiosCustomize.get(`/address/wards/${code}`)
}

// Admin API - Seed dữ liệu địa chỉ
export const seedAddressDataAPIs = async () => {
    return axiosCustomize.post("/address/seed")
}
