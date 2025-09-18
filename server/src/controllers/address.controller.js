import { StatusCodes } from "http-status-codes"
import axios from "axios"

// Sử dụng API bên thứ 3 cho dữ liệu địa chỉ Việt Nam
const PROVINCES_API_URL = "https://provinces.open-api.vn/api"

// Helper function để map administrative unit type
const getAdministrativeUnitId = (type) => {
    switch (type) {
        case 'thanh-pho':
        case 'thanh-pho-trung-uong':
            return 1 // Thành phố
        case 'quan':
            return 2 // Quận
        case 'huyen':
            return 3 // Huyện
        case 'thi-xa':
            return 4 // Thị xã
        case 'phuong':
            return 5 // Phường
        case 'xa':
            return 6 // Xã
        case 'thi-tran':
            return 7 // Thị trấn
        default:
            return 3 // Default to huyện
    }
}

const getAllProvinces = async (req, res, next) => {
    try {
        console.log('📍 GET /api/v1/address/provinces called')
        const { search, is_active } = req.query
        console.log('Query params:', { search, is_active })

        // Gọi API bên thứ 3
        const response = await axios.get(`${PROVINCES_API_URL}/p/`)
        let provinces = response.data

        // Transform data để match với format cũ
        provinces = provinces.map(province => ({
            _id: `p${province.code}`,
            code: province.code.toString().padStart(2, '0'),
            name: province.name,
            full_name: province.name_with_type,
            code_name: province.slug,
            administrative_unit_id: province.type === 'thanh-pho-trung-uong' ? 1 : 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }))

        // Apply search filter nếu có
        if (search) {
            provinces = provinces.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.full_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Apply is_active filter nếu có
        if (is_active !== undefined) {
            const activeFilter = is_active === 'true'
            provinces = provinces.filter(p => p.is_active === activeFilter)
        }

        console.log(`Found ${provinces.length} provinces (using API data)`)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Provinces retrieved successfully',
            data: provinces
        })
    } catch (error) {
        console.error('❌ Error in getAllProvinces:', error)
        next(error)
    }
}
const getProvinceByCode = async (req, res, next) => {
    try {
        const { code } = req.params

        // Gọi API bên thứ 3 để lấy province theo code
        const response = await axios.get(`${PROVINCES_API_URL}/p/${code}`)
        const provinceData = response.data

        if (!provinceData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Province not found'
            })
        }

        // Transform data để match với format cũ
        const province = {
            _id: `p${provinceData.code}`,
            code: provinceData.code.toString().padStart(2, '0'),
            name: provinceData.name,
            full_name: provinceData.name_with_type,
            code_name: provinceData.slug,
            administrative_unit_id: provinceData.type === 'thanh-pho-trung-uong' ? 1 : 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Province retrieved successfully',
            data: province
        })
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Province not found'
            })
        }
        next(error)
    }
}

const getDistrictsByProvinceCode = async (req, res, next) => {
    try {
        const { province_code } = req.params
        const { search } = req.query

        // Gọi API bên thứ 3 để lấy districts theo province code
        const response = await axios.get(`${PROVINCES_API_URL}/p/${province_code}?depth=2`)
        const provinceData = response.data

        if (!provinceData || !provinceData.districts) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Districts retrieved successfully',
                data: []
            })
        }

        // Transform data để match với format cũ
        let districts = provinceData.districts.map(district => ({
            _id: `d${district.code}`,
            code: district.code.toString().padStart(3, '0'),
            name: district.name,
            full_name: district.name_with_type,
            code_name: district.slug,
            province_code: province_code,
            administrative_unit_id: getAdministrativeUnitId(district.type),
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }))

        // Apply search filter nếu có
        if (search) {
            districts = districts.filter(d =>
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.full_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        console.log(`Found ${districts.length} districts for province ${province_code} (using API data)`)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Districts retrieved successfully',
            data: districts
        })
    } catch (error) {
        console.error('❌ Error in getDistrictsByProvinceCode:', error)
        next(error)
    }
}

const getDistrictByCode = async (req, res, next) => {
    try {
        const { code } = req.params

        // Gọi API bên thứ 3 để lấy district theo code
        const response = await axios.get(`${PROVINCES_API_URL}/d/${code}`)
        const districtData = response.data

        if (!districtData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'District not found'
            })
        }

        // Transform data để match với format cũ
        const district = {
            _id: `d${districtData.code}`,
            code: districtData.code.toString().padStart(3, '0'),
            name: districtData.name,
            full_name: districtData.name_with_type,
            code_name: districtData.slug,
            province_code: districtData.province_code,
            administrative_unit_id: getAdministrativeUnitId(districtData.type),
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'District retrieved successfully',
            data: district
        })
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'District not found'
            })
        }
        next(error)
    }
}

// Ward controllers
const getWardsByDistrictCode = async (req, res, next) => {
    try {
        console.log(`📍 GET /api/v1/address/districts/${req.params.district_code}/wards called`)
        const { district_code } = req.params
        const { search } = req.query
        console.log('Query params:', { search })

        // Gọi API bên thứ 3 để lấy wards theo district code
        const response = await axios.get(`${PROVINCES_API_URL}/d/${district_code}?depth=2`)
        const districtData = response.data

        if (!districtData || !districtData.wards) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Wards retrieved successfully',
                data: []
            })
        }

        // Transform data để match với format cũ
        let wards = districtData.wards.map(ward => ({
            _id: `w${ward.code}`,
            code: ward.code.toString().padStart(5, '0'),
            name: ward.name,
            full_name: ward.name_with_type,
            code_name: ward.slug,
            district_code: district_code,
            administrative_unit_id: getAdministrativeUnitId(ward.type),
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }))

        // Apply search filter nếu có
        if (search) {
            wards = wards.filter(w =>
                w.name.toLowerCase().includes(search.toLowerCase()) ||
                w.full_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        console.log(`Found ${wards.length} wards for district ${district_code} (using API data)`)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Wards retrieved successfully',
            data: wards
        })
    } catch (error) {
        console.error('❌ Error in getWardsByDistrictCode:', error)
        next(error)
    }
}

const getWardByCode = async (req, res, next) => {
    try {
        console.log(`📍 GET /api/v1/address/wards/${req.params.code} called`)
        const { code } = req.params

        // Gọi API bên thứ 3 để lấy ward theo code
        const response = await axios.get(`${PROVINCES_API_URL}/w/${code}`)
        const wardData = response.data

        if (!wardData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Ward not found'
            })
        }

        // Transform data để match với format cũ
        const ward = {
            _id: `w${wardData.code}`,
            code: wardData.code.toString().padStart(5, '0'),
            name: wardData.name,
            full_name: wardData.name_with_type,
            code_name: wardData.slug,
            district_code: wardData.district_code,
            administrative_unit_id: getAdministrativeUnitId(wardData.type),
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ward retrieved successfully',
            data: ward
        })
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Ward not found'
            })
        }
        console.error('❌ Error in getWardByCode:', error)
        next(error)
    }
}

const seedAddressData = async (req, res, next) => {
    try {
        console.log('🌱 Address data seeding not needed - using external API')

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Address data seeding not needed - using external API'
        })
    } catch (error) {
        console.error('❌ Error in seedAddressData controller:', error)
        next(error)
    }
}

export const addressController = {
    getAllProvinces,
    getProvinceByCode,
    getDistrictsByProvinceCode,
    getDistrictByCode,
    getWardsByDistrictCode,
    getWardByCode,
    seedAddressData
}
