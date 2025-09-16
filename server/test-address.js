// Simple test script to check address functionality
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 8081

// Middleware
app.use(cors())
app.use(express.json())

// Sample data
const provinces = [
    {
        _id: "1",
        code: "01",
        name: "Hà Nội",
        full_name: "Thành phố Hà Nội",
        code_name: "ha_noi",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "2", 
        code: "79",
        name: "Hồ Chí Minh",
        full_name: "Thành phố Hồ Chí Minh",
        code_name: "ho_chi_minh",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "3",
        code: "48", 
        name: "Đà Nẵng",
        full_name: "Thành phố Đà Nẵng",
        code_name: "da_nang",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

const districts = [
    // Hà Nội
    {
        _id: "d1",
        code: "001",
        name: "Ba Đình", 
        full_name: "Quận Ba Đình",
        code_name: "ba_dinh",
        province_code: "01",
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
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // TP.HCM
    {
        _id: "d4",
        code: "760",
        name: "Quận 1",
        full_name: "Quận 1",
        code_name: "quan_1",
        province_code: "79",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "d5",
        code: "763",
        name: "Bình Thạnh",
        full_name: "Quận Bình Thạnh",
        code_name: "binh_thanh",
        province_code: "79", 
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Đà Nẵng
    {
        _id: "d6",
        code: "490",
        name: "Hải Châu",
        full_name: "Quận Hải Châu",
        code_name: "hai_chau",
        province_code: "48",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

const wards = [
    // Ba Đình - Hà Nội
    {
        _id: "w1",
        code: "00001",
        name: "Phúc Xá",
        full_name: "Phường Phúc Xá",
        code_name: "phuc_xa",
        district_code: "001",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "w2",
        code: "00002",
        name: "Trúc Bạch",
        full_name: "Phường Trúc Bạch",
        code_name: "truc_bach",
        district_code: "001",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "w3",
        code: "00003",
        name: "Vĩnh Phúc",
        full_name: "Phường Vĩnh Phúc",
        code_name: "vinh_phuc",
        district_code: "001",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Hoàn Kiếm - Hà Nội
    {
        _id: "w4",
        code: "00004",
        name: "Chương Dương",
        full_name: "Phường Chương Dương",
        code_name: "chuong_duong",
        district_code: "002",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "w5",
        code: "00005",
        name: "Cửa Đông",
        full_name: "Phường Cửa Đông",
        code_name: "cua_dong",
        district_code: "002",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Quận 1 - TP.HCM
    {
        _id: "w6",
        code: "26734",
        name: "Tân Định",
        full_name: "Phường Tân Định",
        code_name: "tan_dinh",
        district_code: "760",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "w7",
        code: "26737",
        name: "Đa Kao",
        full_name: "Phường Đa Kao",
        code_name: "da_kao",
        district_code: "760",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "w8",
        code: "26740",
        name: "Bến Nghé",
        full_name: "Phường Bến Nghé",
        code_name: "ben_nghe",
        district_code: "760",
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

// Routes
app.get('/api/v1/address/provinces', (req, res) => {
    console.log('📍 GET /api/v1/address/provinces called')
    
    res.json({
        success: true,
        message: 'Provinces retrieved successfully',
        data: provinces
    })
})

app.get('/api/v1/address/provinces/:province_code/districts', (req, res) => {
    const { province_code } = req.params
    console.log(`📍 GET /api/v1/address/provinces/${province_code}/districts called`)
    
    const provinceDistricts = districts.filter(d => d.province_code === province_code)
    
    res.json({
        success: true,
        message: 'Districts retrieved successfully',
        data: provinceDistricts
    })
})

app.get('/api/v1/address/provinces/:code', (req, res) => {
    const { code } = req.params
    console.log(`📍 GET /api/v1/address/provinces/${code} called`)
    
    const province = provinces.find(p => p.code === code)
    
    if (!province) {
        return res.status(404).json({
            success: false,
            message: 'Province not found'
        })
    }
    
    res.json({
        success: true,
        message: 'Province retrieved successfully',
        data: province
    })
})

app.get('/api/v1/address/districts/:code', (req, res) => {
    const { code } = req.params
    console.log(`📍 GET /api/v1/address/districts/${code} called`)

    const district = districts.find(d => d.code === code)

    if (!district) {
        return res.status(404).json({
            success: false,
            message: 'District not found'
        })
    }

    res.json({
        success: true,
        message: 'District retrieved successfully',
        data: district
    })
})

app.get('/api/v1/address/districts/:district_code/wards', (req, res) => {
    const { district_code } = req.params
    console.log(`📍 GET /api/v1/address/districts/${district_code}/wards called`)

    const districtWards = wards.filter(w => w.district_code === district_code)

    res.json({
        success: true,
        message: 'Wards retrieved successfully',
        data: districtWards
    })
})

app.get('/api/v1/address/wards/:code', (req, res) => {
    const { code } = req.params
    console.log(`📍 GET /api/v1/address/wards/${code} called`)

    const ward = wards.find(w => w.code === code)

    if (!ward) {
        return res.status(404).json({
            success: false,
            message: 'Ward not found'
        })
    }

    res.json({
        success: true,
        message: 'Ward retrieved successfully',
        data: ward
    })
})

// Health check
app.get('/api/v1/status', (req, res) => {
    res.json({ 
        message: 'Address API test server is ready',
        timestamp: new Date().toISOString()
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Address Test Server running on http://localhost:${PORT}`)
    console.log(`📍 Test endpoints:`)
    console.log(`   GET http://localhost:${PORT}/api/v1/address/provinces`)
    console.log(`   GET http://localhost:${PORT}/api/v1/address/provinces/01/districts`)
    console.log(`   GET http://localhost:${PORT}/api/v1/address/districts/001/wards`)
    console.log(`   GET http://localhost:${PORT}/api/v1/status`)
})
