import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"
import { Province, District, Ward } from "~/models/address.model"

const getAllProvinces = async (filters = {}) => {
    try {
        const { search, is_active = true } = filters
        
        let query = {}
        if (is_active !== undefined) {
            query.is_active = is_active
        }
        
        let provinces
        if (search) {
            provinces = await Province.searchByName(search)
        } else {
            provinces = await Province.findActive()
        }
        
        return provinces
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getProvinceByCode = async (code) => {
    try {
        const province = await Province.findByCode(code)
        
        if (!province) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Province not found')
        }
        
        return province
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getDistrictsByProvinceCode = async (provinceCode, filters = {}) => {
    try {
        const { search } = filters
        
        // Verify province exists
        const province = await Province.findByCode(provinceCode)
        if (!province) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Province not found')
        }
        
        let districts
        if (search) {
            districts = await District.searchByName(provinceCode, search)
        } else {
            districts = await District.findByProvinceCode(provinceCode)
        }
        
        return districts
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

const getDistrictByCode = async (code) => {
    try {
        const district = await District.findByCode(code)
        
        if (!district) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'District not found')
        }
        
        return district
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

// Ward services
const getWardsByDistrictCode = async (districtCode, filters = {}) => {
    try {
        const { search } = filters

        let query = { district_code: districtCode, is_active: true }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { full_name: { $regex: search, $options: 'i' } },
                { code_name: { $regex: search, $options: 'i' } }
            ]
        }

        const wards = await Ward.find(query).sort({ name: 1 })
        return wards
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving wards')
    }
}

const getWardByCode = async (code) => {
    try {
        const ward = await Ward.findOne({ code, is_active: true })

        if (!ward) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ward not found')
        }

        return ward
    } catch (error) {
        if (error instanceof ApiError) throw error
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving ward')
    }
}

// Seed data function - để import dữ liệu ban đầu
const seedAddressData = async () => {
    try {
        // Check if data already exists
        const provinceCount = await Province.countDocuments()
        if (provinceCount > 0) {
            console.log('Address data already exists, skipping seed')
            return
        }
        
        // Sample data - trong thực tế có thể import từ file JSON hoặc API khác
        const sampleProvinces = [
            {
                code: "01",
                name: "Hà Nội",
                name_en: "Ha Noi",
                full_name: "Thành phố Hà Nội",
                full_name_en: "Ha Noi City",
                code_name: "ha_noi",
                administrative_unit_id: 1,
                administrative_region_id: 1
            },
            {
                code: "79",
                name: "Hồ Chí Minh",
                name_en: "Ho Chi Minh",
                full_name: "Thành phố Hồ Chí Minh",
                full_name_en: "Ho Chi Minh City",
                code_name: "ho_chi_minh",
                administrative_unit_id: 1,
                administrative_region_id: 2
            },
            {
                code: "48",
                name: "Đà Nẵng",
                name_en: "Da Nang",
                full_name: "Thành phố Đà Nẵng",
                full_name_en: "Da Nang City",
                code_name: "da_nang",
                administrative_unit_id: 1,
                administrative_region_id: 3
            },
            {
                code: "92",
                name: "Cần Thơ",
                name_en: "Can Tho",
                full_name: "Thành phố Cần Thơ",
                full_name_en: "Can Tho City",
                code_name: "can_tho",
                administrative_unit_id: 1,
                administrative_region_id: 4
            },
            {
                code: "31",
                name: "Hải Phòng",
                name_en: "Hai Phong",
                full_name: "Thành phố Hải Phòng",
                full_name_en: "Hai Phong City",
                code_name: "hai_phong",
                administrative_unit_id: 1,
                administrative_region_id: 1
            }
        ]
        
        const sampleDistricts = [
            // Hà Nội
            { code: "001", name: "Ba Đình", full_name: "Quận Ba Đình", code_name: "ba_dinh", province_code: "01", administrative_unit_id: 2 },
            { code: "002", name: "Hoàn Kiếm", full_name: "Quận Hoàn Kiếm", code_name: "hoan_kiem", province_code: "01", administrative_unit_id: 2 },
            { code: "003", name: "Tây Hồ", full_name: "Quận Tây Hồ", code_name: "tay_ho", province_code: "01", administrative_unit_id: 2 },
            { code: "004", name: "Long Biên", full_name: "Quận Long Biên", code_name: "long_bien", province_code: "01", administrative_unit_id: 2 },
            { code: "005", name: "Cầu Giấy", full_name: "Quận Cầu Giấy", code_name: "cau_giay", province_code: "01", administrative_unit_id: 2 },
            { code: "006", name: "Đống Đa", full_name: "Quận Đống Đa", code_name: "dong_da", province_code: "01", administrative_unit_id: 2 },
            { code: "007", name: "Hai Bà Trưng", full_name: "Quận Hai Bà Trưng", code_name: "hai_ba_trung", province_code: "01", administrative_unit_id: 2 },
            { code: "008", name: "Hoàng Mai", full_name: "Quận Hoàng Mai", code_name: "hoang_mai", province_code: "01", administrative_unit_id: 2 },
            { code: "009", name: "Thanh Xuân", full_name: "Quận Thanh Xuân", code_name: "thanh_xuan", province_code: "01", administrative_unit_id: 2 },
            { code: "013", name: "Nam Từ Liêm", full_name: "Quận Nam Từ Liêm", code_name: "nam_tu_liem", province_code: "01", administrative_unit_id: 2 },
            { code: "014", name: "Bắc Từ Liêm", full_name: "Quận Bắc Từ Liêm", code_name: "bac_tu_liem", province_code: "01", administrative_unit_id: 2 },
            
            // TP.HCM
            { code: "760", name: "Quận 1", full_name: "Quận 1", code_name: "quan_1", province_code: "79", administrative_unit_id: 2 },
            { code: "761", name: "Quận 12", full_name: "Quận 12", code_name: "quan_12", province_code: "79", administrative_unit_id: 2 },
            { code: "762", name: "Gò Vấp", full_name: "Quận Gò Vấp", code_name: "go_vap", province_code: "79", administrative_unit_id: 2 },
            { code: "763", name: "Bình Thạnh", full_name: "Quận Bình Thạnh", code_name: "binh_thanh", province_code: "79", administrative_unit_id: 2 },
            { code: "764", name: "Tân Bình", full_name: "Quận Tân Bình", code_name: "tan_binh", province_code: "79", administrative_unit_id: 2 },
            { code: "765", name: "Tân Phú", full_name: "Quận Tân Phú", code_name: "tan_phu", province_code: "79", administrative_unit_id: 2 },
            { code: "766", name: "Phú Nhuận", full_name: "Quận Phú Nhuận", code_name: "phu_nhuan", province_code: "79", administrative_unit_id: 2 },
            { code: "767", name: "Thủ Đức", full_name: "Thành phố Thủ Đức", code_name: "thu_duc", province_code: "79", administrative_unit_id: 1 },
            { code: "768", name: "Quận 3", full_name: "Quận 3", code_name: "quan_3", province_code: "79", administrative_unit_id: 2 },
            { code: "769", name: "Quận 10", full_name: "Quận 10", code_name: "quan_10", province_code: "79", administrative_unit_id: 2 },
            { code: "770", name: "Quận 11", full_name: "Quận 11", code_name: "quan_11", province_code: "79", administrative_unit_id: 2 },
            
            // Đà Nẵng
            { code: "490", name: "Hải Châu", full_name: "Quận Hải Châu", code_name: "hai_chau", province_code: "48", administrative_unit_id: 2 },
            { code: "491", name: "Thanh Khê", full_name: "Quận Thanh Khê", code_name: "thanh_khe", province_code: "48", administrative_unit_id: 2 },
            { code: "492", name: "Sơn Trà", full_name: "Quận Sơn Trà", code_name: "son_tra", province_code: "48", administrative_unit_id: 2 },
            { code: "493", name: "Ngũ Hành Sơn", full_name: "Quận Ngũ Hành Sơn", code_name: "ngu_hanh_son", province_code: "48", administrative_unit_id: 2 },
            { code: "494", name: "Liên Chiểu", full_name: "Quận Liên Chiểu", code_name: "lien_chieu", province_code: "48", administrative_unit_id: 2 },
            { code: "495", name: "Cẩm Lệ", full_name: "Quận Cẩm Lệ", code_name: "cam_le", province_code: "48", administrative_unit_id: 2 },
            
            // Cần Thơ
            { code: "916", name: "Ninh Kiều", full_name: "Quận Ninh Kiều", code_name: "ninh_kieu", province_code: "92", administrative_unit_id: 2 },
            { code: "917", name: "Ô Môn", full_name: "Quận Ô Môn", code_name: "o_mon", province_code: "92", administrative_unit_id: 2 },
            { code: "918", name: "Bình Thuỷ", full_name: "Quận Bình Thuỷ", code_name: "binh_thuy", province_code: "92", administrative_unit_id: 2 },
            { code: "919", name: "Cái Răng", full_name: "Quận Cái Răng", code_name: "cai_rang", province_code: "92", administrative_unit_id: 2 },
            { code: "923", name: "Thốt Nốt", full_name: "Quận Thốt Nốt", code_name: "thot_not", province_code: "92", administrative_unit_id: 2 },
            
            // Hải Phòng
            { code: "303", name: "Lê Chân", full_name: "Quận Lê Chân", code_name: "le_chan", province_code: "31", administrative_unit_id: 2 },
            { code: "304", name: "Hải An", full_name: "Quận Hải An", code_name: "hai_an", province_code: "31", administrative_unit_id: 2 },
            { code: "305", name: "Kiến An", full_name: "Quận Kiến An", code_name: "kien_an", province_code: "31", administrative_unit_id: 2 },
            { code: "306", name: "Hồng Bàng", full_name: "Quận Hồng Bàng", code_name: "hong_bang", province_code: "31", administrative_unit_id: 2 },
            { code: "307", name: "Ngô Quyền", full_name: "Quận Ngô Quyền", code_name: "ngo_quyen", province_code: "31", administrative_unit_id: 2 }
        ]
        
        // Insert provinces
        await Province.insertMany(sampleProvinces)
        console.log(`Inserted ${sampleProvinces.length} provinces`)
        
        // Insert districts
        await District.insertMany(sampleDistricts)
        console.log(`Inserted ${sampleDistricts.length} districts`)
        
        console.log('Address data seeded successfully')
    } catch (error) {
        console.error('Error seeding address data:', error)
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to seed address data')
    }
}

export const addressService = {
    getAllProvinces,
    getProvinceByCode,
    getDistrictsByProvinceCode,
    getDistrictByCode,
    getWardsByDistrictCode,
    getWardByCode,
    seedAddressData
}
