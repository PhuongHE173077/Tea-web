/**
 * Ship API Examples
 * 
 * Các ví dụ về cách sử dụng Ship Management API
 * Chạy file này để test các endpoints
 */

const BASE_URL = 'http://localhost:3000/api/v1/ship';

// Mock data cho testing
const sampleShipConfig = {
    freeShippingThreshold: 500000,
    shippingFee: 30000,
    isActive: true,
    description: 'Cấu hình ship tiêu chuẩn - Miễn phí ship cho đơn hàng từ 500k'
};

const sampleUpdateData = {
    freeShippingThreshold: 600000,
    shippingFee: 25000,
    description: 'Cấu hình ship đã cập nhật - Miễn phí ship cho đơn hàng từ 600k'
};

/**
 * 1. Lấy cấu hình ship đang active (Public API)
 */
const getActiveShipConfig = async () => {
    try {
        const response = await fetch(`${BASE_URL}/active`);
        const data = await response.json();
        
        console.log('✅ Get Active Ship Config:');
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error getting active ship config:', error.message);
    }
};

/**
 * 2. Tính phí ship cho đơn hàng (Public API)
 */
const calculateShippingFee = async (orderValue) => {
    try {
        const response = await fetch(`${BASE_URL}/calculate-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderValue })
        });
        
        const data = await response.json();
        
        console.log(`✅ Calculate Shipping Fee for ${orderValue.toLocaleString('vi-VN')} VND:`);
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error calculating shipping fee:', error.message);
    }
};

/**
 * 3. Tạo cấu hình ship mới (Admin API)
 */
const createShipConfig = async (accessToken) => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${accessToken}`
            },
            body: JSON.stringify(sampleShipConfig)
        });
        
        const data = await response.json();
        
        console.log('✅ Create Ship Config:');
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error creating ship config:', error.message);
    }
};

/**
 * 4. Lấy danh sách cấu hình ship (Admin API)
 */
const getShipConfigs = async (accessToken, queryParams = {}) => {
    try {
        const params = new URLSearchParams(queryParams);
        const response = await fetch(`${BASE_URL}?${params}`, {
            headers: {
                'Cookie': `accessToken=${accessToken}`
            }
        });
        
        const data = await response.json();
        
        console.log('✅ Get Ship Configs:');
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error getting ship configs:', error.message);
    }
};

/**
 * 5. Cập nhật cấu hình ship (Admin API)
 */
const updateShipConfig = async (accessToken, configId) => {
    try {
        const response = await fetch(`${BASE_URL}/${configId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${accessToken}`
            },
            body: JSON.stringify(sampleUpdateData)
        });
        
        const data = await response.json();
        
        console.log('✅ Update Ship Config:');
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error updating ship config:', error.message);
    }
};

/**
 * 6. Bật/tắt trạng thái cấu hình ship (Admin API)
 */
const toggleShipConfigStatus = async (accessToken, configId, isActive) => {
    try {
        const response = await fetch(`${BASE_URL}/${configId}/toggle-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${accessToken}`
            },
            body: JSON.stringify({ isActive })
        });
        
        const data = await response.json();
        
        console.log(`✅ Toggle Ship Config Status (${isActive ? 'Active' : 'Inactive'}):`);
        console.log(JSON.stringify(data, null, 2));
        
        return data;
    } catch (error) {
        console.error('❌ Error toggling ship config status:', error.message);
    }
};

/**
 * Demo function - chạy tất cả examples
 */
const runDemo = async () => {
    console.log('🚀 Ship API Examples Demo\n');
    
    // 1. Test public APIs
    console.log('=== PUBLIC APIs ===');
    await getActiveShipConfig();
    console.log('\n');
    
    // Test với các giá trị đơn hàng khác nhau
    const orderValues = [200000, 500000, 800000];
    for (const orderValue of orderValues) {
        await calculateShippingFee(orderValue);
        console.log('\n');
    }
    
    // 2. Test admin APIs (cần access token)
    console.log('=== ADMIN APIs (Cần Access Token) ===');
    console.log('⚠️  Để test admin APIs, bạn cần:');
    console.log('1. Đăng nhập với tài khoản admin');
    console.log('2. Lấy access token từ cookie');
    console.log('3. Gọi các functions với token:');
    console.log('   - createShipConfig(accessToken)');
    console.log('   - getShipConfigs(accessToken)');
    console.log('   - updateShipConfig(accessToken, configId)');
    console.log('   - toggleShipConfigStatus(accessToken, configId, true/false)');
    
    console.log('\n🎉 Demo completed!');
};

// Export functions để có thể import và sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getActiveShipConfig,
        calculateShippingFee,
        createShipConfig,
        getShipConfigs,
        updateShipConfig,
        toggleShipConfigStatus,
        runDemo
    };
}

// Chạy demo nếu file được execute trực tiếp
if (typeof require !== 'undefined' && require.main === module) {
    runDemo();
}
