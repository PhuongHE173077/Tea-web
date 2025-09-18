// Dữ liệu địa chỉ Việt Nam đầy đủ 63 tỉnh thành
// Bao gồm: Tỉnh/Thành phố, Quận/Huyện/Thị xã, Phường/Xã/Thị trấn

export const VIETNAM_PROVINCES = [
    // Thành phố trực thuộc trung ương
    {
        _id: "p01",
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
        _id: "p79",
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
        _id: "p48",
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
        _id: "p31",
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
        _id: "p92",
        code: "92",
        name: "Cần Thơ",
        full_name: "Thành phố Cần Thơ",
        code_name: "can_tho",
        administrative_unit_id: 1,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },

    // Miền Bắc
    {
        _id: "p02",
        code: "02",
        name: "Hà Giang",
        full_name: "Tỉnh Hà Giang",
        code_name: "ha_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p04",
        code: "04",
        name: "Cao Bằng",
        full_name: "Tỉnh Cao Bằng",
        code_name: "cao_bang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p06",
        code: "06",
        name: "Bắc Kạn",
        full_name: "Tỉnh Bắc Kạn",
        code_name: "bac_kan",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p08",
        code: "08",
        name: "Tuyên Quang",
        full_name: "Tỉnh Tuyên Quang",
        code_name: "tuyen_quang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p10",
        code: "10",
        name: "Lào Cai",
        full_name: "Tỉnh Lào Cai",
        code_name: "lao_cai",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p11",
        code: "11",
        name: "Điện Biên",
        full_name: "Tỉnh Điện Biên",
        code_name: "dien_bien",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p12",
        code: "12",
        name: "Lai Châu",
        full_name: "Tỉnh Lai Châu",
        code_name: "lai_chau",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p14",
        code: "14",
        name: "Sơn La",
        full_name: "Tỉnh Sơn La",
        code_name: "son_la",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p15",
        code: "15",
        name: "Yên Bái",
        full_name: "Tỉnh Yên Bái",
        code_name: "yen_bai",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p17",
        code: "17",
        name: "Hoà Bình",
        full_name: "Tỉnh Hoà Bình",
        code_name: "hoa_binh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p19",
        code: "19",
        name: "Thái Nguyên",
        full_name: "Tỉnh Thái Nguyên",
        code_name: "thai_nguyen",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p20",
        code: "20",
        name: "Lạng Sơn",
        full_name: "Tỉnh Lạng Sơn",
        code_name: "lang_son",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p22",
        code: "22",
        name: "Quảng Ninh",
        full_name: "Tỉnh Quảng Ninh",
        code_name: "quang_ninh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p24",
        code: "24",
        name: "Bắc Giang",
        full_name: "Tỉnh Bắc Giang",
        code_name: "bac_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p25",
        code: "25",
        name: "Phú Thọ",
        full_name: "Tỉnh Phú Thọ",
        code_name: "phu_tho",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p26",
        code: "26",
        name: "Vĩnh Phúc",
        full_name: "Tỉnh Vĩnh Phúc",
        code_name: "vinh_phuc",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p27",
        code: "27",
        name: "Bắc Ninh",
        full_name: "Tỉnh Bắc Ninh",
        code_name: "bac_ninh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p30",
        code: "30",
        name: "Hải Dương",
        full_name: "Tỉnh Hải Dương",
        code_name: "hai_duong",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p33",
        code: "33",
        name: "Hưng Yên",
        full_name: "Tỉnh Hưng Yên",
        code_name: "hung_yen",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p34",
        code: "34",
        name: "Thái Bình",
        full_name: "Tỉnh Thái Bình",
        code_name: "thai_binh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p35",
        code: "35",
        name: "Hà Nam",
        full_name: "Tỉnh Hà Nam",
        code_name: "ha_nam",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p36",
        code: "36",
        name: "Nam Định",
        full_name: "Tỉnh Nam Định",
        code_name: "nam_dinh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p37",
        code: "37",
        name: "Ninh Bình",
        full_name: "Tỉnh Ninh Bình",
        code_name: "ninh_binh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },

    // Miền Trung
    {
        _id: "p38",
        code: "38",
        name: "Thanh Hóa",
        full_name: "Tỉnh Thanh Hóa",
        code_name: "thanh_hoa",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p40",
        code: "40",
        name: "Nghệ An",
        full_name: "Tỉnh Nghệ An",
        code_name: "nghe_an",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p42",
        code: "42",
        name: "Hà Tĩnh",
        full_name: "Tỉnh Hà Tĩnh",
        code_name: "ha_tinh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p44",
        code: "44",
        name: "Quảng Bình",
        full_name: "Tỉnh Quảng Bình",
        code_name: "quang_binh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p45",
        code: "45",
        name: "Quảng Trị",
        full_name: "Tỉnh Quảng Trị",
        code_name: "quang_tri",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p46",
        code: "46",
        name: "Thừa Thiên Huế",
        full_name: "Tỉnh Thừa Thiên Huế",
        code_name: "thua_thien_hue",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p49",
        code: "49",
        name: "Quảng Nam",
        full_name: "Tỉnh Quảng Nam",
        code_name: "quang_nam",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p51",
        code: "51",
        name: "Quảng Ngãi",
        full_name: "Tỉnh Quảng Ngãi",
        code_name: "quang_ngai",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p52",
        code: "52",
        name: "Bình Định",
        full_name: "Tỉnh Bình Định",
        code_name: "binh_dinh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p54",
        code: "54",
        name: "Phú Yên",
        full_name: "Tỉnh Phú Yên",
        code_name: "phu_yen",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p56",
        code: "56",
        name: "Khánh Hòa",
        full_name: "Tỉnh Khánh Hòa",
        code_name: "khanh_hoa",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p58",
        code: "58",
        name: "Ninh Thuận",
        full_name: "Tỉnh Ninh Thuận",
        code_name: "ninh_thuan",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p60",
        code: "60",
        name: "Bình Thuận",
        full_name: "Tỉnh Bình Thuận",
        code_name: "binh_thuan",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p62",
        code: "62",
        name: "Kon Tum",
        full_name: "Tỉnh Kon Tum",
        code_name: "kon_tum",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p64",
        code: "64",
        name: "Gia Lai",
        full_name: "Tỉnh Gia Lai",
        code_name: "gia_lai",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p66",
        code: "66",
        name: "Đắk Lắk",
        full_name: "Tỉnh Đắk Lắk",
        code_name: "dak_lak",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p67",
        code: "67",
        name: "Đắk Nông",
        full_name: "Tỉnh Đắk Nông",
        code_name: "dak_nong",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p68",
        code: "68",
        name: "Lâm Đồng",
        full_name: "Tỉnh Lâm Đồng",
        code_name: "lam_dong",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },

    // Miền Nam
    {
        _id: "p70",
        code: "70",
        name: "Bình Phước",
        full_name: "Tỉnh Bình Phước",
        code_name: "binh_phuoc",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p72",
        code: "72",
        name: "Tây Ninh",
        full_name: "Tỉnh Tây Ninh",
        code_name: "tay_ninh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p74",
        code: "74",
        name: "Bình Dương",
        full_name: "Tỉnh Bình Dương",
        code_name: "binh_duong",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p75",
        code: "75",
        name: "Đồng Nai",
        full_name: "Tỉnh Đồng Nai",
        code_name: "dong_nai",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p77",
        code: "77",
        name: "Bà Rịa - Vũng Tàu",
        full_name: "Tỉnh Bà Rịa - Vũng Tàu",
        code_name: "ba_ria_vung_tau",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p80",
        code: "80",
        name: "Long An",
        full_name: "Tỉnh Long An",
        code_name: "long_an",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p82",
        code: "82",
        name: "Tiền Giang",
        full_name: "Tỉnh Tiền Giang",
        code_name: "tien_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p83",
        code: "83",
        name: "Bến Tre",
        full_name: "Tỉnh Bến Tre",
        code_name: "ben_tre",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p84",
        code: "84",
        name: "Trà Vinh",
        full_name: "Tỉnh Trà Vinh",
        code_name: "tra_vinh",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p86",
        code: "86",
        name: "Vĩnh Long",
        full_name: "Tỉnh Vĩnh Long",
        code_name: "vinh_long",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p87",
        code: "87",
        name: "Đồng Tháp",
        full_name: "Tỉnh Đồng Tháp",
        code_name: "dong_thap",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p89",
        code: "89",
        name: "An Giang",
        full_name: "Tỉnh An Giang",
        code_name: "an_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p91",
        code: "91",
        name: "Kiên Giang",
        full_name: "Tỉnh Kiên Giang",
        code_name: "kien_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p93",
        code: "93",
        name: "Hậu Giang",
        full_name: "Tỉnh Hậu Giang",
        code_name: "hau_giang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p94",
        code: "94",
        name: "Sóc Trăng",
        full_name: "Tỉnh Sóc Trăng",
        code_name: "soc_trang",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p95",
        code: "95",
        name: "Bạc Liêu",
        full_name: "Tỉnh Bạc Liêu",
        code_name: "bac_lieu",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "p96",
        code: "96",
        name: "Cà Mau",
        full_name: "Tỉnh Cà Mau",
        code_name: "ca_mau",
        administrative_unit_id: 2,
        is_active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Dữ liệu Quận/Huyện theo từng tỉnh thành
export const VIETNAM_DISTRICTS = {
    // Hà Nội (01)
    "01": [
        { _id: "d001", code: "001", name: "Ba Đình", full_name: "Quận Ba Đình", code_name: "ba_dinh", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d002", code: "002", name: "Hoàn Kiếm", full_name: "Quận Hoàn Kiếm", code_name: "hoan_kiem", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d003", code: "003", name: "Tây Hồ", full_name: "Quận Tây Hồ", code_name: "tay_ho", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d004", code: "004", name: "Long Biên", full_name: "Quận Long Biên", code_name: "long_bien", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d005", code: "005", name: "Cầu Giấy", full_name: "Quận Cầu Giấy", code_name: "cau_giay", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d006", code: "006", name: "Đống Đa", full_name: "Quận Đống Đa", code_name: "dong_da", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d007", code: "007", name: "Hai Bà Trưng", full_name: "Quận Hai Bà Trưng", code_name: "hai_ba_trung", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d008", code: "008", name: "Hoàng Mai", full_name: "Quận Hoàng Mai", code_name: "hoang_mai", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d009", code: "009", name: "Thanh Xuân", full_name: "Quận Thanh Xuân", code_name: "thanh_xuan", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d010", code: "010", name: "Sóc Sơn", full_name: "Huyện Sóc Sơn", code_name: "soc_son", province_code: "01", administrative_unit_id: 3, is_active: true },
        { _id: "d011", code: "011", name: "Đông Anh", full_name: "Huyện Đông Anh", code_name: "dong_anh", province_code: "01", administrative_unit_id: 3, is_active: true },
        { _id: "d012", code: "012", name: "Gia Lâm", full_name: "Huyện Gia Lâm", code_name: "gia_lam", province_code: "01", administrative_unit_id: 3, is_active: true },
        { _id: "d013", code: "013", name: "Nam Từ Liêm", full_name: "Quận Nam Từ Liêm", code_name: "nam_tu_liem", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d014", code: "014", name: "Bắc Từ Liêm", full_name: "Quận Bắc Từ Liêm", code_name: "bac_tu_liem", province_code: "01", administrative_unit_id: 2, is_active: true },
        { _id: "d015", code: "015", name: "Thanh Trì", full_name: "Huyện Thanh Trì", code_name: "thanh_tri", province_code: "01", administrative_unit_id: 3, is_active: true }
    ],

    // TP. Hồ Chí Minh (79)
    "79": [
        { _id: "d760", code: "760", name: "Quận 1", full_name: "Quận 1", code_name: "quan_1", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d761", code: "761", name: "Quận 2", full_name: "Quận 2", code_name: "quan_2", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d762", code: "762", name: "Quận 3", full_name: "Quận 3", code_name: "quan_3", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d763", code: "763", name: "Quận 4", full_name: "Quận 4", code_name: "quan_4", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d764", code: "764", name: "Quận 5", full_name: "Quận 5", code_name: "quan_5", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d765", code: "765", name: "Quận 6", full_name: "Quận 6", code_name: "quan_6", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d766", code: "766", name: "Quận 7", full_name: "Quận 7", code_name: "quan_7", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d767", code: "767", name: "Quận 8", full_name: "Quận 8", code_name: "quan_8", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d768", code: "768", name: "Quận 9", full_name: "Quận 9", code_name: "quan_9", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d769", code: "769", name: "Quận 10", full_name: "Quận 10", code_name: "quan_10", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d770", code: "770", name: "Quận 11", full_name: "Quận 11", code_name: "quan_11", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d771", code: "771", name: "Quận 12", full_name: "Quận 12", code_name: "quan_12", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d772", code: "772", name: "Thủ Đức", full_name: "Thành phố Thủ Đức", code_name: "thu_duc", province_code: "79", administrative_unit_id: 1, is_active: true },
        { _id: "d773", code: "773", name: "Gò Vấp", full_name: "Quận Gò Vấp", code_name: "go_vap", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d774", code: "774", name: "Bình Thạnh", full_name: "Quận Bình Thạnh", code_name: "binh_thanh", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d775", code: "775", name: "Tân Bình", full_name: "Quận Tân Bình", code_name: "tan_binh", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d776", code: "776", name: "Tân Phú", full_name: "Quận Tân Phú", code_name: "tan_phu", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d777", code: "777", name: "Phú Nhuận", full_name: "Quận Phú Nhuận", code_name: "phu_nhuan", province_code: "79", administrative_unit_id: 2, is_active: true },
        { _id: "d778", code: "778", name: "Bình Chánh", full_name: "Huyện Bình Chánh", code_name: "binh_chanh", province_code: "79", administrative_unit_id: 3, is_active: true },
        { _id: "d779", code: "779", name: "Hóc Môn", full_name: "Huyện Hóc Môn", code_name: "hoc_mon", province_code: "79", administrative_unit_id: 3, is_active: true },
        { _id: "d780", code: "780", name: "Củ Chi", full_name: "Huyện Củ Chi", code_name: "cu_chi", province_code: "79", administrative_unit_id: 3, is_active: true },
        { _id: "d781", code: "781", name: "Nhà Bè", full_name: "Huyện Nhà Bè", code_name: "nha_be", province_code: "79", administrative_unit_id: 3, is_active: true },
        { _id: "d782", code: "782", name: "Cần Giờ", full_name: "Huyện Cần Giờ", code_name: "can_gio", province_code: "79", administrative_unit_id: 3, is_active: true }
    ],

    // Đà Nẵng (48)
    "48": [
        { _id: "d490", code: "490", name: "Liên Chiểu", full_name: "Quận Liên Chiểu", code_name: "lien_chieu", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d491", code: "491", name: "Thanh Khê", full_name: "Quận Thanh Khê", code_name: "thanh_khe", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d492", code: "492", name: "Hải Châu", full_name: "Quận Hải Châu", code_name: "hai_chau", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d493", code: "493", name: "Sơn Trà", full_name: "Quận Sơn Trà", code_name: "son_tra", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d494", code: "494", name: "Ngũ Hành Sơn", full_name: "Quận Ngũ Hành Sơn", code_name: "ngu_hanh_son", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d495", code: "495", name: "Cẩm Lệ", full_name: "Quận Cẩm Lệ", code_name: "cam_le", province_code: "48", administrative_unit_id: 2, is_active: true },
        { _id: "d496", code: "496", name: "Hòa Vang", full_name: "Huyện Hòa Vang", code_name: "hoa_vang", province_code: "48", administrative_unit_id: 3, is_active: true },
        { _id: "d497", code: "497", name: "Hoàng Sa", full_name: "Huyện Hoàng Sa", code_name: "hoang_sa", province_code: "48", administrative_unit_id: 3, is_active: true }
    ],

    // Hải Phòng (31)
    "31": [
        { _id: "d310", code: "310", name: "Hồng Bàng", full_name: "Quận Hồng Bàng", code_name: "hong_bang", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d311", code: "311", name: "Ngô Quyền", full_name: "Quận Ngô Quyền", code_name: "ngo_quyen", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d312", code: "312", name: "Lê Chân", full_name: "Quận Lê Chân", code_name: "le_chan", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d313", code: "313", name: "Hải An", full_name: "Quận Hải An", code_name: "hai_an", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d314", code: "314", name: "Kiến An", full_name: "Quận Kiến An", code_name: "kien_an", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d315", code: "315", name: "Đồ Sơn", full_name: "Quận Đồ Sơn", code_name: "do_son", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d316", code: "316", name: "Dương Kinh", full_name: "Quận Dương Kinh", code_name: "duong_kinh", province_code: "31", administrative_unit_id: 2, is_active: true },
        { _id: "d317", code: "317", name: "Thuỷ Nguyên", full_name: "Huyện Thuỷ Nguyên", code_name: "thuy_nguyen", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d318", code: "318", name: "An Dương", full_name: "Huyện An Dương", code_name: "an_duong", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d319", code: "319", name: "An Lão", full_name: "Huyện An Lão", code_name: "an_lao", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d320", code: "320", name: "Kiến Thuỵ", full_name: "Huyện Kiến Thuỵ", code_name: "kien_thuy", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d321", code: "321", name: "Tiên Lãng", full_name: "Huyện Tiên Lãng", code_name: "tien_lang", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d322", code: "322", name: "Vĩnh Bảo", full_name: "Huyện Vĩnh Bảo", code_name: "vinh_bao", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d323", code: "323", name: "Cát Hải", full_name: "Huyện Cát Hải", code_name: "cat_hai", province_code: "31", administrative_unit_id: 3, is_active: true },
        { _id: "d324", code: "324", name: "Bạch Long Vĩ", full_name: "Huyện Bạch Long Vĩ", code_name: "bach_long_vi", province_code: "31", administrative_unit_id: 3, is_active: true }
    ],

    // Cần Thơ (92)
    "92": [
        { _id: "d920", code: "920", name: "Ninh Kiều", full_name: "Quận Ninh Kiều", code_name: "ninh_kieu", province_code: "92", administrative_unit_id: 2, is_active: true },
        { _id: "d921", code: "921", name: "Ô Môn", full_name: "Quận Ô Môn", code_name: "o_mon", province_code: "92", administrative_unit_id: 2, is_active: true },
        { _id: "d922", code: "922", name: "Bình Thuỷ", full_name: "Quận Bình Thuỷ", code_name: "binh_thuy", province_code: "92", administrative_unit_id: 2, is_active: true },
        { _id: "d923", code: "923", name: "Cái Răng", full_name: "Quận Cái Răng", code_name: "cai_rang", province_code: "92", administrative_unit_id: 2, is_active: true },
        { _id: "d924", code: "924", name: "Thốt Nốt", full_name: "Quận Thốt Nốt", code_name: "thot_not", province_code: "92", administrative_unit_id: 2, is_active: true },
        { _id: "d925", code: "925", name: "Vĩnh Thạnh", full_name: "Huyện Vĩnh Thạnh", code_name: "vinh_thanh", province_code: "92", administrative_unit_id: 3, is_active: true },
        { _id: "d926", code: "926", name: "Cờ Đỏ", full_name: "Huyện Cờ Đỏ", code_name: "co_do", province_code: "92", administrative_unit_id: 3, is_active: true },
        { _id: "d927", code: "927", name: "Phong Điền", full_name: "Huyện Phong Điền", code_name: "phong_dien", province_code: "92", administrative_unit_id: 3, is_active: true },
        { _id: "d928", code: "928", name: "Thới Lai", full_name: "Huyện Thới Lai", code_name: "thoi_lai", province_code: "92", administrative_unit_id: 3, is_active: true }
    ],

    // Hà Giang (02)
    "02": [
        { _id: "d020", code: "020", name: "Hà Giang", full_name: "Thành phố Hà Giang", code_name: "ha_giang_tp", province_code: "02", administrative_unit_id: 1, is_active: true },
        { _id: "d021", code: "021", name: "Đồng Văn", full_name: "Huyện Đồng Văn", code_name: "dong_van", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d022", code: "022", name: "Mèo Vạc", full_name: "Huyện Mèo Vạc", code_name: "meo_vac", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d023", code: "023", name: "Yên Minh", full_name: "Huyện Yên Minh", code_name: "yen_minh", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d024", code: "024", name: "Quản Bạ", full_name: "Huyện Quản Bạ", code_name: "quan_ba", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d025", code: "025", name: "Vị Xuyên", full_name: "Huyện Vị Xuyên", code_name: "vi_xuyen", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d026", code: "026", name: "Bắc Mê", full_name: "Huyện Bắc Mê", code_name: "bac_me", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d027", code: "027", name: "Hoàng Su Phì", full_name: "Huyện Hoàng Su Phì", code_name: "hoang_su_phi", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d028", code: "028", name: "Xín Mần", full_name: "Huyện Xín Mần", code_name: "xin_man", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d029", code: "029", name: "Bắc Quang", full_name: "Huyện Bắc Quang", code_name: "bac_quang", province_code: "02", administrative_unit_id: 3, is_active: true },
        { _id: "d030", code: "030", name: "Quang Bình", full_name: "Huyện Quang Bình", code_name: "quang_binh_hg", province_code: "02", administrative_unit_id: 3, is_active: true }
    ],

    // Cao Bằng (04)
    "04": [
        { _id: "d040", code: "040", name: "Cao Bằng", full_name: "Thành phố Cao Bằng", code_name: "cao_bang_tp", province_code: "04", administrative_unit_id: 1, is_active: true },
        { _id: "d041", code: "041", name: "Bảo Lâm", full_name: "Huyện Bảo Lâm", code_name: "bao_lam", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d042", code: "042", name: "Bảo Lạc", full_name: "Huyện Bảo Lạc", code_name: "bao_lac", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d043", code: "043", name: "Thông Nông", full_name: "Huyện Thông Nông", code_name: "thong_nong", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d044", code: "044", name: "Hà Quảng", full_name: "Huyện Hà Quảng", code_name: "ha_quang", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d045", code: "045", name: "Trà Lĩnh", full_name: "Huyện Trà Lĩnh", code_name: "tra_linh", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d046", code: "046", name: "Trùng Khánh", full_name: "Huyện Trùng Khánh", code_name: "trung_khanh", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d047", code: "047", name: "Nguyên Bình", full_name: "Huyện Nguyên Bình", code_name: "nguyen_binh", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d048", code: "048", name: "Hòa An", full_name: "Huyện Hòa An", code_name: "hoa_an", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d049", code: "049", name: "Quảng Uyên", full_name: "Huyện Quảng Uyên", code_name: "quang_uyen", province_code: "04", administrative_unit_id: 3, is_active: true },
        { _id: "d050", code: "050", name: "Phục Hoà", full_name: "Huyện Phục Hoà", code_name: "phuc_hoa", province_code: "04", administrative_unit_id: 3, is_active: true }
    ],

    // Bắc Kạn (06)
    "06": [
        { _id: "d060", code: "060", name: "Bắc Kạn", full_name: "Thành phố Bắc Kạn", code_name: "bac_kan_tp", province_code: "06", administrative_unit_id: 1, is_active: true },
        { _id: "d061", code: "061", name: "Pác Nặm", full_name: "Huyện Pác Nặm", code_name: "pac_nam", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d062", code: "062", name: "Ba Bể", full_name: "Huyện Ba Bể", code_name: "ba_be", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d063", code: "063", name: "Ngân Sơn", full_name: "Huyện Ngân Sơn", code_name: "ngan_son", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d064", code: "064", name: "Bạch Thông", full_name: "Huyện Bạch Thông", code_name: "bach_thong", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d065", code: "065", name: "Chợ Đồn", full_name: "Huyện Chợ Đồn", code_name: "cho_don", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d066", code: "066", name: "Chợ Mới", full_name: "Huyện Chợ Mới", code_name: "cho_moi", province_code: "06", administrative_unit_id: 3, is_active: true },
        { _id: "d067", code: "067", name: "Na Rì", full_name: "Huyện Na Rì", code_name: "na_ri", province_code: "06", administrative_unit_id: 3, is_active: true }
    ],

    // Tuyên Quang (08)
    "08": [
        { _id: "d080", code: "080", name: "Tuyên Quang", full_name: "Thành phố Tuyên Quang", code_name: "tuyen_quang_tp", province_code: "08", administrative_unit_id: 1, is_active: true },
        { _id: "d081", code: "081", name: "Lâm Bình", full_name: "Huyện Lâm Bình", code_name: "lam_binh", province_code: "08", administrative_unit_id: 3, is_active: true },
        { _id: "d082", code: "082", name: "Na Hang", full_name: "Huyện Na Hang", code_name: "na_hang", province_code: "08", administrative_unit_id: 3, is_active: true },
        { _id: "d083", code: "083", name: "Chiêm Hóa", full_name: "Huyện Chiêm Hóa", code_name: "chiem_hoa", province_code: "08", administrative_unit_id: 3, is_active: true },
        { _id: "d084", code: "084", name: "Hàm Yên", full_name: "Huyện Hàm Yên", code_name: "ham_yen", province_code: "08", administrative_unit_id: 3, is_active: true },
        { _id: "d085", code: "085", name: "Yên Sơn", full_name: "Huyện Yên Sơn", code_name: "yen_son", province_code: "08", administrative_unit_id: 3, is_active: true },
        { _id: "d086", code: "086", name: "Sơn Dương", full_name: "Huyện Sơn Dương", code_name: "son_duong", province_code: "08", administrative_unit_id: 3, is_active: true }
    ],

    // Lào Cai (10)
    "10": [
        { _id: "d100", code: "100", name: "Lào Cai", full_name: "Thành phố Lào Cai", code_name: "lao_cai_tp", province_code: "10", administrative_unit_id: 1, is_active: true },
        { _id: "d101", code: "101", name: "Bát Xát", full_name: "Huyện Bát Xát", code_name: "bat_xat", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d102", code: "102", name: "Mường Khương", full_name: "Huyện Mường Khương", code_name: "muong_khuong", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d103", code: "103", name: "Si Ma Cai", full_name: "Huyện Si Ma Cai", code_name: "si_ma_cai", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d104", code: "104", name: "Bắc Hà", full_name: "Huyện Bắc Hà", code_name: "bac_ha", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d105", code: "105", name: "Bảo Thắng", full_name: "Huyện Bảo Thắng", code_name: "bao_thang", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d106", code: "106", name: "Bảo Yên", full_name: "Huyện Bảo Yên", code_name: "bao_yen", province_code: "10", administrative_unit_id: 3, is_active: true },
        { _id: "d107", code: "107", name: "Sa Pa", full_name: "Thị xã Sa Pa", code_name: "sa_pa", province_code: "10", administrative_unit_id: 4, is_active: true },
        { _id: "d108", code: "108", name: "Văn Bàn", full_name: "Huyện Văn Bàn", code_name: "van_ban", province_code: "10", administrative_unit_id: 3, is_active: true }
    ],

    // Điện Biên (11)
    "11": [
        { _id: "d110", code: "110", name: "Điện Biên Phủ", full_name: "Thành phố Điện Biên Phủ", code_name: "dien_bien_phu", province_code: "11", administrative_unit_id: 1, is_active: true },
        { _id: "d111", code: "111", name: "Mường Lay", full_name: "Thị xã Mường Lay", code_name: "muong_lay", province_code: "11", administrative_unit_id: 4, is_active: true },
        { _id: "d112", code: "112", name: "Mường Nhé", full_name: "Huyện Mường Nhé", code_name: "muong_nhe", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d113", code: "113", name: "Mường Chà", full_name: "Huyện Mường Chà", code_name: "muong_cha", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d114", code: "114", name: "Tủa Chùa", full_name: "Huyện Tủa Chùa", code_name: "tua_chua", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d115", code: "115", name: "Tuần Giáo", full_name: "Huyện Tuần Giáo", code_name: "tuan_giao", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d116", code: "116", name: "Điện Biên", full_name: "Huyện Điện Biên", code_name: "dien_bien", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d117", code: "117", name: "Điện Biên Đông", full_name: "Huyện Điện Biên Đông", code_name: "dien_bien_dong", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d118", code: "118", name: "Mường Ảng", full_name: "Huyện Mường Ảng", code_name: "muong_ang", province_code: "11", administrative_unit_id: 3, is_active: true },
        { _id: "d119", code: "119", name: "Nậm Pồ", full_name: "Huyện Nậm Pồ", code_name: "nam_po", province_code: "11", administrative_unit_id: 3, is_active: true }
    ],

    // Lai Châu (12)
    "12": [
        { _id: "d120", code: "120", name: "Lai Châu", full_name: "Thành phố Lai Châu", code_name: "lai_chau_tp", province_code: "12", administrative_unit_id: 1, is_active: true },
        { _id: "d121", code: "121", name: "Tam Đường", full_name: "Huyện Tam Đường", code_name: "tam_duong", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d122", code: "122", name: "Mường Tè", full_name: "Huyện Mường Tè", code_name: "muong_te", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d123", code: "123", name: "Sìn Hồ", full_name: "Huyện Sìn Hồ", code_name: "sin_ho", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d124", code: "124", name: "Phong Thổ", full_name: "Huyện Phong Thổ", code_name: "phong_tho", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d125", code: "125", name: "Than Uyên", full_name: "Huyện Than Uyên", code_name: "than_uyen", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d126", code: "126", name: "Tân Uyên", full_name: "Huyện Tân Uyên", code_name: "tan_uyen", province_code: "12", administrative_unit_id: 3, is_active: true },
        { _id: "d127", code: "127", name: "Nậm Nhùn", full_name: "Huyện Nậm Nhùn", code_name: "nam_nhun", province_code: "12", administrative_unit_id: 3, is_active: true }
    ],

    // Sơn La (14)
    "14": [
        { _id: "d140", code: "140", name: "Sơn La", full_name: "Thành phố Sơn La", code_name: "son_la_tp", province_code: "14", administrative_unit_id: 1, is_active: true },
        { _id: "d141", code: "141", name: "Quỳnh Nhai", full_name: "Huyện Quỳnh Nhai", code_name: "quynh_nhai", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d142", code: "142", name: "Thuận Châu", full_name: "Huyện Thuận Châu", code_name: "thuan_chau", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d143", code: "143", name: "Mường La", full_name: "Huyện Mường La", code_name: "muong_la", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d144", code: "144", name: "Bắc Yên", full_name: "Huyện Bắc Yên", code_name: "bac_yen", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d145", code: "145", name: "Phù Yên", full_name: "Huyện Phù Yên", code_name: "phu_yen_sl", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d146", code: "146", name: "Mộc Châu", full_name: "Huyện Mộc Châu", code_name: "moc_chau", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d147", code: "147", name: "Yên Châu", full_name: "Huyện Yên Châu", code_name: "yen_chau", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d148", code: "148", name: "Mai Sơn", full_name: "Huyện Mai Sơn", code_name: "mai_son", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d149", code: "149", name: "Sông Mã", full_name: "Huyện Sông Mã", code_name: "song_ma", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d150", code: "150", name: "Sốp Cộp", full_name: "Huyện Sốp Cộp", code_name: "sop_cop", province_code: "14", administrative_unit_id: 3, is_active: true },
        { _id: "d151", code: "151", name: "Vân Hồ", full_name: "Huyện Vân Hồ", code_name: "van_ho", province_code: "14", administrative_unit_id: 3, is_active: true }
    ],

    // Yên Bái (15)
    "15": [
        { _id: "d1500", code: "150", name: "Yên Bái", full_name: "Thành phố Yên Bái", code_name: "yen_bai", province_code: "15", administrative_unit_id: 1, is_active: true },
        { _id: "d1501", code: "151", name: "Nghĩa Lộ", full_name: "Thị xã Nghĩa Lộ", code_name: "nghia_lo", province_code: "15", administrative_unit_id: 4, is_active: true },
        { _id: "d1502", code: "152", name: "Lục Yên", full_name: "Huyện Lục Yên", code_name: "luc_yen", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1503", code: "153", name: "Văn Yên", full_name: "Huyện Văn Yên", code_name: "van_yen", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1504", code: "154", name: "Mù Căng Chải", full_name: "Huyện Mù Căng Chải", code_name: "mu_cang_chai", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1505", code: "155", name: "Trấn Yên", full_name: "Huyện Trấn Yên", code_name: "tran_yen", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1506", code: "156", name: "Trạm Tấu", full_name: "Huyện Trạm Tấu", code_name: "tram_tau", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1507", code: "157", name: "Văn Chấn", full_name: "Huyện Văn Chấn", code_name: "van_chan", province_code: "15", administrative_unit_id: 3, is_active: true },
        { _id: "d1508", code: "158", name: "Yên Bình", full_name: "Huyện Yên Bình", code_name: "yen_binh", province_code: "15", administrative_unit_id: 3, is_active: true }
    ],

    // Hoà Bình (17)
    "17": [
        { _id: "d1509", code: "170", name: "Hòa Bình", full_name: "Thành phố Hòa Bình", code_name: "hoa_binh", province_code: "17", administrative_unit_id: 1, is_active: true },
        { _id: "d1510", code: "171", name: "Đà Bắc", full_name: "Huyện Đà Bắc", code_name: "da_bac", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1511", code: "172", name: "Kỳ Sơn", full_name: "Huyện Kỳ Sơn", code_name: "ky_son", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1512", code: "173", name: "Lương Sơn", full_name: "Huyện Lương Sơn", code_name: "luong_son", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1513", code: "174", name: "Kim Bôi", full_name: "Huyện Kim Bôi", code_name: "kim_boi", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1514", code: "175", name: "Cao Phong", full_name: "Huyện Cao Phong", code_name: "cao_phong", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1515", code: "176", name: "Tân Lạc", full_name: "Huyện Tân Lạc", code_name: "tan_lac", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1516", code: "177", name: "Mai Châu", full_name: "Huyện Mai Châu", code_name: "mai_chau", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1517", code: "178", name: "Lạc Sơn", full_name: "Huyện Lạc Sơn", code_name: "lac_son", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1518", code: "179", name: "Yên Thủy", full_name: "Huyện Yên Thủy", code_name: "yen_thuy", province_code: "17", administrative_unit_id: 3, is_active: true },
        { _id: "d1519", code: "180", name: "Lạc Thủy", full_name: "Huyện Lạc Thủy", code_name: "lac_thuy", province_code: "17", administrative_unit_id: 3, is_active: true }
    ],

    // Thái Nguyên (19)
    "19": [
        { _id: "d1520", code: "190", name: "Thái Nguyên", full_name: "Thành phố Thái Nguyên", code_name: "thai_nguyen", province_code: "19", administrative_unit_id: 1, is_active: true },
        { _id: "d1521", code: "191", name: "Sông Công", full_name: "Thành phố Sông Công", code_name: "song_cong", province_code: "19", administrative_unit_id: 1, is_active: true },
        { _id: "d1522", code: "192", name: "Định Hóa", full_name: "Huyện Định Hóa", code_name: "dinh_hoa", province_code: "19", administrative_unit_id: 3, is_active: true },
        { _id: "d1523", code: "193", name: "Phú Lương", full_name: "Huyện Phú Lương", code_name: "phu_luong", province_code: "19", administrative_unit_id: 3, is_active: true },
        { _id: "d1524", code: "194", name: "Đồng Hỷ", full_name: "Huyện Đồng Hỷ", code_name: "dong_hy", province_code: "19", administrative_unit_id: 3, is_active: true },
        { _id: "d1525", code: "195", name: "Võ Nhai", full_name: "Huyện Võ Nhai", code_name: "vo_nhai", province_code: "19", administrative_unit_id: 3, is_active: true },
        { _id: "d1526", code: "196", name: "Đại Từ", full_name: "Huyện Đại Từ", code_name: "dai_tu", province_code: "19", administrative_unit_id: 3, is_active: true },
        { _id: "d1527", code: "197", name: "Phú Bình", full_name: "Thị xã Phú Bình", code_name: "phu_binh", province_code: "19", administrative_unit_id: 4, is_active: true },
        { _id: "d1528", code: "198", name: "Phổ Yên", full_name: "Thị xã Phổ Yên", code_name: "pho_yen", province_code: "19", administrative_unit_id: 4, is_active: true }
    ]
};

// Dữ liệu Phường/Xã theo từng quận/huyện
export const VIETNAM_WARDS = {
    // Quận Ba Đình, Hà Nội (001)
    "001": [
        { _id: "w00001", code: "00001", name: "Phúc Xá", full_name: "Phường Phúc Xá", code_name: "phuc_xa", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00002", code: "00002", name: "Trúc Bạch", full_name: "Phường Trúc Bạch", code_name: "truc_bach", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00003", code: "00003", name: "Vĩnh Phúc", full_name: "Phường Vĩnh Phúc", code_name: "vinh_phuc", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00004", code: "00004", name: "Cống Vị", full_name: "Phường Cống Vị", code_name: "cong_vi", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00005", code: "00005", name: "Liễu Giai", full_name: "Phường Liễu Giai", code_name: "lieu_giai", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00006", code: "00006", name: "Nguyễn Trung Trực", full_name: "Phường Nguyễn Trung Trực", code_name: "nguyen_trung_truc", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00007", code: "00007", name: "Quán Thánh", full_name: "Phường Quán Thánh", code_name: "quan_thanh", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00008", code: "00008", name: "Ngọc Hà", full_name: "Phường Ngọc Hà", code_name: "ngoc_ha", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00009", code: "00009", name: "Điện Biên", full_name: "Phường Điện Biên", code_name: "dien_bien", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00010", code: "00010", name: "Đội Cấn", full_name: "Phường Đội Cấn", code_name: "doi_can", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00011", code: "00011", name: "Ngọc Khánh", full_name: "Phường Ngọc Khánh", code_name: "ngoc_khanh", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00012", code: "00012", name: "Kim Mã", full_name: "Phường Kim Mã", code_name: "kim_ma", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00013", code: "00013", name: "Giảng Võ", full_name: "Phường Giảng Võ", code_name: "giang_vo", district_code: "001", administrative_unit_id: 4, is_active: true },
        { _id: "w00014", code: "00014", name: "Thành Công", full_name: "Phường Thành Công", code_name: "thanh_cong", district_code: "001", administrative_unit_id: 4, is_active: true }
    ],

    // Quận Hoàn Kiếm, Hà Nội (002)
    "002": [
        { _id: "w00015", code: "00015", name: "Phúc Tân", full_name: "Phường Phúc Tân", code_name: "phuc_tan", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00016", code: "00016", name: "Đồng Xuân", full_name: "Phường Đồng Xuân", code_name: "dong_xuan", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00017", code: "00017", name: "Hàng Mã", full_name: "Phường Hàng Mã", code_name: "hang_ma", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00018", code: "00018", name: "Hàng Buồm", full_name: "Phường Hàng Buồm", code_name: "hang_buom", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00019", code: "00019", name: "Hàng Đào", full_name: "Phường Hàng Đào", code_name: "hang_dao", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00020", code: "00020", name: "Hàng Bồ", full_name: "Phường Hàng Bồ", code_name: "hang_bo", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00021", code: "00021", name: "Cửa Đông", full_name: "Phường Cửa Đông", code_name: "cua_dong", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00022", code: "00022", name: "Lý Thái Tổ", full_name: "Phường Lý Thái Tổ", code_name: "ly_thai_to", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00023", code: "00023", name: "Hàng Bạc", full_name: "Phường Hàng Bạc", code_name: "hang_bac", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00024", code: "00024", name: "Hàng Gai", full_name: "Phường Hàng Gai", code_name: "hang_gai", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00025", code: "00025", name: "Chương Dương", full_name: "Phường Chương Dương", code_name: "chuong_duong", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00026", code: "00026", name: "Hàng Trống", full_name: "Phường Hàng Trống", code_name: "hang_trong", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00027", code: "00027", name: "Cửa Nam", full_name: "Phường Cửa Nam", code_name: "cua_nam", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00028", code: "00028", name: "Hàng Bông", full_name: "Phường Hàng Bông", code_name: "hang_bong", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00029", code: "00029", name: "Tràng Tiền", full_name: "Phường Tràng Tiền", code_name: "trang_tien", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00030", code: "00030", name: "Trần Hưng Đạo", full_name: "Phường Trần Hưng Đạo", code_name: "tran_hung_dao", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00031", code: "00031", name: "Phan Chu Trinh", full_name: "Phường Phan Chu Trinh", code_name: "phan_chu_trinh", district_code: "002", administrative_unit_id: 4, is_active: true },
        { _id: "w00032", code: "00032", name: "Hàng Bài", full_name: "Phường Hàng Bài", code_name: "hang_bai", district_code: "002", administrative_unit_id: 4, is_active: true }
    ],

    // Quận 1, TP.HCM (760)
    "760": [
        { _id: "w76001", code: "76001", name: "Tân Định", full_name: "Phường Tân Định", code_name: "tan_dinh", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76002", code: "76002", name: "Đa Kao", full_name: "Phường Đa Kao", code_name: "da_kao", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76003", code: "76003", name: "Bến Nghé", full_name: "Phường Bến Nghé", code_name: "ben_nghe", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76004", code: "76004", name: "Bến Thành", full_name: "Phường Bến Thành", code_name: "ben_thanh", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76005", code: "76005", name: "Nguyễn Thái Bình", full_name: "Phường Nguyễn Thái Bình", code_name: "nguyen_thai_binh", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76006", code: "76006", name: "Phạm Ngũ Lão", full_name: "Phường Phạm Ngũ Lão", code_name: "pham_ngu_lao", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76007", code: "76007", name: "Cầu Ông Lãnh", full_name: "Phường Cầu Ông Lãnh", code_name: "cau_ong_lanh", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76008", code: "76008", name: "Cô Giang", full_name: "Phường Cô Giang", code_name: "co_giang", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76009", code: "76009", name: "Nguyễn Cư Trinh", full_name: "Phường Nguyễn Cư Trinh", code_name: "nguyen_cu_trinh", district_code: "760", administrative_unit_id: 4, is_active: true },
        { _id: "w76010", code: "76010", name: "Cầu Kho", full_name: "Phường Cầu Kho", code_name: "cau_kho", district_code: "760", administrative_unit_id: 4, is_active: true }
    ]
};
