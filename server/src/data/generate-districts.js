// Script để generate dữ liệu quận/huyện cho các tỉnh còn lại
// Dữ liệu mẫu dựa trên cấu trúc hành chính thực tế Việt Nam

const remainingProvinces = {
    // Yên Bái (15)
    "15": [
        { name: "Yên Bái", full_name: "Thành phố Yên Bái", type: "tp" },
        { name: "Nghĩa Lộ", full_name: "Thị xã Nghĩa Lộ", type: "tx" },
        { name: "Lục Yên", full_name: "Huyện Lục Yên", type: "huyen" },
        { name: "Văn Yên", full_name: "Huyện Văn Yên", type: "huyen" },
        { name: "Mù Căng Chải", full_name: "Huyện Mù Căng Chải", type: "huyen" },
        { name: "Trấn Yên", full_name: "Huyện Trấn Yên", type: "huyen" },
        { name: "Trạm Tấu", full_name: "Huyện Trạm Tấu", type: "huyen" },
        { name: "Văn Chấn", full_name: "Huyện Văn Chấn", type: "huyen" },
        { name: "Yên Bình", full_name: "Huyện Yên Bình", type: "huyen" }
    ],

    // Hoà Bình (17)
    "17": [
        { name: "Hòa Bình", full_name: "Thành phố Hòa Bình", type: "tp" },
        { name: "Đà Bắc", full_name: "Huyện Đà Bắc", type: "huyen" },
        { name: "Kỳ Sơn", full_name: "Huyện Kỳ Sơn", type: "huyen" },
        { name: "Lương Sơn", full_name: "Huyện Lương Sơn", type: "huyen" },
        { name: "Kim Bôi", full_name: "Huyện Kim Bôi", type: "huyen" },
        { name: "Cao Phong", full_name: "Huyện Cao Phong", type: "huyen" },
        { name: "Tân Lạc", full_name: "Huyện Tân Lạc", type: "huyen" },
        { name: "Mai Châu", full_name: "Huyện Mai Châu", type: "huyen" },
        { name: "Lạc Sơn", full_name: "Huyện Lạc Sơn", type: "huyen" },
        { name: "Yên Thủy", full_name: "Huyện Yên Thủy", type: "huyen" },
        { name: "Lạc Thủy", full_name: "Huyện Lạc Thủy", type: "huyen" }
    ],

    // Thái Nguyên (19)
    "19": [
        { name: "Thái Nguyên", full_name: "Thành phố Thái Nguyên", type: "tp" },
        { name: "Sông Công", full_name: "Thành phố Sông Công", type: "tp" },
        { name: "Định Hóa", full_name: "Huyện Định Hóa", type: "huyen" },
        { name: "Phú Lương", full_name: "Huyện Phú Lương", type: "huyen" },
        { name: "Đồng Hỷ", full_name: "Huyện Đồng Hỷ", type: "huyen" },
        { name: "Võ Nhai", full_name: "Huyện Võ Nhai", type: "huyen" },
        { name: "Đại Từ", full_name: "Huyện Đại Từ", type: "huyen" },
        { name: "Phú Bình", full_name: "Thị xã Phú Bình", type: "tx" },
        { name: "Phổ Yên", full_name: "Thị xã Phổ Yên", type: "tx" }
    ],

    // Lạng Sơn (20)
    "20": [
        { name: "Lạng Sơn", full_name: "Thành phố Lạng Sơn", type: "tp" },
        { name: "Tràng Định", full_name: "Huyện Tràng Định", type: "huyen" },
        { name: "Bình Gia", full_name: "Huyện Bình Gia", type: "huyen" },
        { name: "Văn Lãng", full_name: "Huyện Văn Lãng", type: "huyen" },
        { name: "Cao Lộc", full_name: "Huyện Cao Lộc", type: "huyen" },
        { name: "Văn Quan", full_name: "Huyện Văn Quan", type: "huyen" },
        { name: "Bắc Sơn", full_name: "Huyện Bắc Sơn", type: "huyen" },
        { name: "Hữu Lũng", full_name: "Huyện Hữu Lũng", type: "huyen" },
        { name: "Chi Lăng", full_name: "Huyện Chi Lăng", type: "huyen" },
        { name: "Lộc Bình", full_name: "Huyện Lộc Bình", type: "huyen" },
        { name: "Đình Lập", full_name: "Huyện Đình Lập", type: "huyen" }
    ],

    // Quảng Ninh (22)
    "22": [
        { name: "Hạ Long", full_name: "Thành phố Hạ Long", type: "tp" },
        { name: "Móng Cái", full_name: "Thành phố Móng Cái", type: "tp" },
        { name: "Cẩm Phả", full_name: "Thành phố Cẩm Phả", type: "tp" },
        { name: "Uông Bí", full_name: "Thành phố Uông Bí", type: "tp" },
        { name: "Bình Liêu", full_name: "Huyện Bình Liêu", type: "huyen" },
        { name: "Tiên Yên", full_name: "Huyện Tiên Yên", type: "huyen" },
        { name: "Đầm Hà", full_name: "Huyện Đầm Hà", type: "huyen" },
        { name: "Hải Hà", full_name: "Huyện Hải Hà", type: "huyen" },
        { name: "Ba Chẽ", full_name: "Huyện Ba Chẽ", type: "huyen" },
        { name: "Vân Đồn", full_name: "Huyện Vân Đồn", type: "huyen" },
        { name: "Hoành Bồ", full_name: "Huyện Hoành Bồ", type: "huyen" },
        { name: "Đông Triều", full_name: "Thị xã Đông Triều", type: "tx" },
        { name: "Quảng Yên", full_name: "Thị xã Quảng Yên", type: "tx" },
        { name: "Cô Tô", full_name: "Huyện Cô Tô", type: "huyen" }
    ]
};

// Function để generate code cho districts
function generateDistrictsCode() {
    let result = '';
    let districtId = 1500; // Start from 1500 to avoid conflicts

    for (const [provinceCode, districts] of Object.entries(remainingProvinces)) {
        result += `\n    // Province ${provinceCode}\n`;
        result += `    "${provinceCode}": [\n`;
        
        districts.forEach((district, index) => {
            const code = (parseInt(provinceCode) * 10 + index).toString().padStart(3, '0');
            const adminUnitId = district.type === 'tp' ? 1 : district.type === 'tx' ? 4 : 3;
            
            result += `        { _id: "d${districtId}", code: "${code}", name: "${district.name}", full_name: "${district.full_name}", code_name: "${district.name.toLowerCase().replace(/\s+/g, '_').replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e').replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o').replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')}", province_code: "${provinceCode}", administrative_unit_id: ${adminUnitId}, is_active: true }`;
            
            if (index < districts.length - 1) {
                result += ',';
            }
            result += '\n';
            districtId++;
        });
        
        result += '    ],';
    }
    
    return result;
}

console.log(generateDistrictsCode());
