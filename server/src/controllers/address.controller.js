import { StatusCodes } from "http-status-codes"
import { addressService } from "~/services/address.service"

// Mock Data cho testing
// Mock Data cho testing

const MOCK_PROVINCES = [
    {
        _id: "p1",
        code: "01",
        name: "Hà Nội",
        full_name: "Thành phố Hà Nội",
        code_name: "ha_noi",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p2",
        code: "79",
        name: "TP. Hồ Chí Minh",
        full_name: "Thành phố Hồ Chí Minh",
        code_name: "tp_ho_chi_minh",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p3",
        code: "48",
        name: "Đà Nẵng",
        full_name: "Thành phố Đà Nẵng",
        code_name: "da_nang",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p4",
        code: "31",
        name: "Hải Phòng",
        full_name: "Thành phố Hải Phòng",
        code_name: "hai_phong",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p5",
        code: "92",
        name: "Cần Thơ",
        full_name: "Thành phố Cần Thơ",
        code_name: "can_tho",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p6",
        code: "82",
        name: "Buôn Ma Thuột",
        full_name: "Thành phố Buôn Ma Thuột",
        code_name: "buon_ma_thuot",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p7",
        code: "45",
        name: "Vinh",
        full_name: "Thành phố Vinh",
        code_name: "vinh",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p8",
        code: "68",
        name: "Thái Nguyên",
        full_name: "Thành phố Thái Nguyên",
        code_name: "thai_nguyen",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p9",
        code: "58",
        name: "Nha Trang",
        full_name: "Thành phố Nha Trang",
        code_name: "nha_trang",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p10",
        code: "52",
        name: "Pleiku",
        full_name: "Thành phố Pleiku",
        code_name: "pleiku",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

const MOCK_DISTRICTS = {
    "01": [ // Hà Nội - đầy đủ hơn các quận / huyện chính
        {
            _id: "d1",
            code: "001",
            name: "Ba Đình",
            full_name: "Quận Ba Đình",
            code_name: "ba_dinh",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d2",
            code: "002",
            name: "Hoàn Kiếm",
            full_name: "Quận Hoàn Kiếm",
            code_name: "hoan_kiem",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d3",
            code: "003",
            name: "Tây Hồ",
            full_name: "Quận Tây Hồ",
            code_name: "tay_ho",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d4",
            code: "004",
            name: "Long Biên",
            full_name: "Quận Long Biên",
            code_name: "long_bien",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d5",
            code: "005",
            name: "Cầu Giấy",
            full_name: "Quận Cầu Giấy",
            code_name: "cau_giay",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d6",
            code: "006",
            name: "Nam Từ Liêm",
            full_name: "Quận Nam Từ Liêm",
            code_name: "nam_tu_liem",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d7",
            code: "007",
            name: "Bắc Từ Liêm",
            full_name: "Quận Bắc Từ Liêm",
            code_name: "bac_tu_liem",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d8",
            code: "008",
            name: "Thanh Xuân",
            full_name: "Quận Thanh Xuân",
            code_name: "thanh_xuan",
            province_code: "01",
            administrative_unit_id_num: 2,
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d9",
            code: "009",
            name: "Hoàng Mai",
            full_name: "Quận Hoàng Mai",
            code_name: "hoang_mai",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d10",
            code: "010",
            name: "Đống Đa",
            full_name: "Quận Đống Đa",
            code_name: "dong_da",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d11",
            code: "011",
            name: "Hai Bà Trưng",
            full_name: "Quận Hai Bà Trưng",
            code_name: "hai_ba_trung",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d12",
            code: "012",
            name: "Thanh Trì",
            full_name: "Huyện Thanh Trì",
            code_name: "thanh_tri",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d13",
            code: "013",
            name: "Sóc Sơn",
            full_name: "Huyện Sóc Sơn",
            code_name: "soc_son",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d14",
            code: "014",
            name: "Đông Anh",
            full_name: "Huyện Đông Anh",
            code_name: "dong_anh",
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d15",
            code: "015",
            name: "Hoàn Mai", // giả lập nếu có
            full_name: "Huyện Hoàn Mai",
            code_name: "hoan_mai_huyen", 
            province_code: "01",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        // ... có thể thêm Huyện khác như Hoài Đức, Quốc Oai, Phúc Thọ, Mỹ Đức, Ba Vì, Chương Mỹ, Thanh Oai,...
    ],
    "79": [ // TP.HCM
        {
            _id: "d20",
            code: "760",
            name: "Quận 1",
            full_name: "Quận 1",
            code_name: "quan_1",
            province_code: "79",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "d21",
            code: "761",
            name: "Quận 2",
            full_name: "Quận 2",
            code_name: "quan_2",
            province_code: "79",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        // ... thêm các quận khác của TP.HCM
    ],
    "48": [ // Đà Nẵng
        {
            _id: "d30",
            code: "490",
            name: "Quận Hải Châu",
            full_name: "Quận Hải Châu",
            code_name: "hai_chau",
            province_code: "48",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    "31": [ // Hải Phòng
        {
            _id: "d40",
            code: "310",
            name: "Quận Hồng Bàng",
            full_name: "Quận Hồng Bàng",
            code_name: "hong_bang",
            province_code: "31",
            administrative_unit_id: 2,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
    // ... có thể thêm districts cho các thành phố khác
}

const MOCK_WARDS = {
    // Hà Nội quận Ba Đình (một số wards mẫu)
    "001": [ 
        {
            _id: "w1",
            code: "00001",
            name: "Phường Phúc Xá",
            full_name: "Phường Phúc Xá",
            code_name: "phuc_xa",
            district_code: "001",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w2",
            code: "00002",
            name: "Phường Trúc Bạch",
            full_name: "Phường Trúc Bạch",
            code_name: "truc_bach",
            district_code: "001",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w3",
            code: "00003",
            name: "Phường Vĩnh Phúc",
            full_name: "Phường Vĩnh Phúc",
            code_name: "vinh_phuc",
            district_code: "001",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w4",
            code: "00004",
            name: "Phường Liễu Giai",
            full_name: "Phường Liễu Giai",
            code_name: "lieu_giai",
            district_code: "001",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    // Hà Nội quận Hoàng Mai
    "009": [
        {
            _id: "w10",
            code: "00090",
            name: "Phường Hoàng Liệt",
            full_name: "Phường Hoàng Liệt",
            code_name: "hoang_liet",
            district_code: "009",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w11",
            code: "00091",
            name: "Phường Đại Kim",
            full_name: "Phường Đại Kim",
            code_name: "dai_kim",
            district_code: "009",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    // Hà Nội huyện Đông Anh
    "014": [
        {
            _id: "w20",
            code: "00140",
            name: "Thị trấn Đông Anh",
            full_name: "Thị trấn Đông Anh",
            code_name: "thi_tran_dong_anh",
            district_code: "014",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w21",
            code: "00141",
            name: "Xã Cổ Loa",
            full_name: "Xã Cổ Loa",
            code_name: "co_loa",
            district_code: "014",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: "w22",
            code: "00142",
            name: "Xã Võng La",
            full_name: "Xã Võng La",
            code_name: "vong_la",
            district_code: "014",
            administrative_unit_id: 3,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
    // ... thêm wards/xã cho các quận/huyện khác
}


const getAllProvinces = async (req, res, next) => {
    try {
        console.log('📍 GET /api/v1/address/provinces called')
        const { search, is_active } = req.query
        console.log('Query params:', { search, is_active })

        // Sử dụng mock data thay vì database
        let provinces = [...MOCK_PROVINCES]

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

        console.log(`Found ${provinces.length} provinces (using mock data)`)

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

        // Sử dụng mock data thay vì database
        const province = MOCK_PROVINCES.find(p => p.code === code)

        if (!province) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Province not found'
            })
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Province retrieved successfully',
            data: province
        })
    } catch (error) {
        next(error)
    }
}

const getDistrictsByProvinceCode = async (req, res, next) => {
    try {
        const { province_code } = req.params
        const { search } = req.query
        
        // Sử dụng mock data thay vì database
        let districts = MOCK_DISTRICTS[province_code] || []

        // Apply search filter nếu có
        if (search) {
            districts = districts.filter(d =>
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.full_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        console.log(`Found ${districts.length} districts for province ${province_code} (using mock data)`)
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Districts retrieved successfully',
            data: districts
        })
    } catch (error) {
        next(error)
    }
}

const getDistrictByCode = async (req, res, next) => {
    try {
        const { code } = req.params

        // Tìm district trong tất cả provinces
        let district = null
        for (const provinceCode in MOCK_DISTRICTS) {
            district = MOCK_DISTRICTS[provinceCode].find(d => d.code === code)
            if (district) break
        }

        if (!district) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'District not found'
            })
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'District retrieved successfully',
            data: district
        })
    } catch (error) {
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

        // Sử dụng mock data thay vì database
        let wards = MOCK_WARDS[district_code] || []

        // Apply search filter nếu có
        if (search) {
            wards = wards.filter(w =>
                w.name.toLowerCase().includes(search.toLowerCase()) ||
                w.full_name.toLowerCase().includes(search.toLowerCase())
            )
        }

        console.log(`Found ${wards.length} wards for district ${district_code} (using mock data)`)

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

        // Tìm ward trong tất cả districts
        let ward = null
        for (const districtCode in MOCK_WARDS) {
            ward = MOCK_WARDS[districtCode].find(w => w.code === code)
            if (ward) break
        }

        if (!ward) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Ward not found'
            })
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ward retrieved successfully',
            data: ward
        })
    } catch (error) {
        console.error('❌ Error in getWardByCode:', error)
        next(error)
    }
}

const seedAddressData = async (req, res, next) => {
    try {
        console.log('🌱 Starting address data seeding from API...')
        await addressService.seedAddressData()

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Address data seeded successfully'
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
