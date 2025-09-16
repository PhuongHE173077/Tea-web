const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 8081

// Middleware
app.use(cors())
app.use(express.json())

// Mock data
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

const districts = {
    "01": [
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
        }
    ],
    "79": [
        {
            _id: "d3",
            code: "760",
            name: "Quận 1",
            full_name: "Quận 1",
            code_name: "quan_1",
            province_code: "79",
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
}

const wards = {
    "001": [
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
        }
    ],
    "002": [
        {
            _id: "w2",
            code: "00002",
            name: "Hàng Bạc",
            full_name: "Phường Hàng Bạc",
            code_name: "hang_bac",
            district_code: "002",
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
}

// Routes
app.get('/api/v1/status', (req, res) => {
    res.json({ message: 'Test server is ready' })
})

// Address routes
app.get('/api/v1/address/provinces', (req, res) => {
    console.log('📍 GET /api/v1/address/provinces called')
    res.json({
        success: true,
        message: 'Provinces retrieved successfully',
        data: provinces
    })
})

app.get('/api/v1/address/provinces/:code/districts', (req, res) => {
    const { code } = req.params
    console.log(`📍 GET /api/v1/address/provinces/${code}/districts called`)
    
    const provinceDistricts = districts[code] || []
    res.json({
        success: true,
        message: 'Districts retrieved successfully',
        data: provinceDistricts
    })
})

app.get('/api/v1/address/districts/:code/wards', (req, res) => {
    const { code } = req.params
    console.log(`📍 GET /api/v1/address/districts/${code}/wards called`)
    
    const districtWards = wards[code] || []
    res.json({
        success: true,
        message: 'Wards retrieved successfully',
        data: districtWards
    })
})

// Order routes
app.post('/api/v1/orders', (req, res) => {
    console.log('🛒 POST /api/v1/orders called')
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    
    try {
        const { customer_info, cart_items, discount_code, shipping_address, payment_method } = req.body
        
        // Validate required fields
        if (!customer_info || !cart_items || cart_items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: customer_info and cart_items'
            })
        }
        
        // Validate shipping address structure
        if (shipping_address) {
            console.log('Shipping address structure:', JSON.stringify(shipping_address, null, 2))
            
            if (shipping_address.province && typeof shipping_address.province === 'object') {
                console.log('✅ Province has correct structure:', shipping_address.province)
            }
            if (shipping_address.district && typeof shipping_address.district === 'object') {
                console.log('✅ District has correct structure:', shipping_address.district)
            }
            if (shipping_address.ward && typeof shipping_address.ward === 'object') {
                console.log('✅ Ward has correct structure:', shipping_address.ward)
            }
        }
        
        // Calculate total
        const subtotal = cart_items.reduce((total, item) => {
            const itemPrice = item.attribute ? item.attribute.price : item.price
            return total + (itemPrice * item.quantity)
        }, 0)
        
        // Mock order response
        const mockOrder = {
            _id: 'order_' + Date.now(),
            order_trackingNumber: 'TRK' + Date.now(),
            order_status: 'pending',
            order_checkout: {
                subtotal: subtotal,
                shipping_fee: 30000,
                total: subtotal + 30000
            },
            order_shipping: shipping_address,
            customer_info: customer_info,
            cart_items: cart_items,
            payment_method: payment_method || 'cod',
            createdAt: new Date().toISOString()
        }
        
        console.log('✅ Order created successfully:', mockOrder._id)
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order_id: mockOrder._id,
                tracking_number: mockOrder.order_trackingNumber,
                total: mockOrder.order_checkout.total,
                status: mockOrder.order_status
            }
        })
        
    } catch (error) {
        console.error('❌ Error creating order:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`)
    console.log('📍 Address endpoints available')
    console.log('🛒 Order endpoints available')
})
