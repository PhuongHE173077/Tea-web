// Dữ liệu đầy đủ quận/huyện cho tất cả các tỉnh còn lại

const allRemainingDistricts = `
    // Lạng Sơn (20)
    "20": [
        { _id: "d1529", code: "200", name: "Lạng Sơn", full_name: "Thành phố Lạng Sơn", code_name: "lang_son", province_code: "20", administrative_unit_id: 1, is_active: true },
        { _id: "d1530", code: "201", name: "Tràng Định", full_name: "Huyện Tràng Định", code_name: "trang_dinh", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1531", code: "202", name: "Bình Gia", full_name: "Huyện Bình Gia", code_name: "binh_gia", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1532", code: "203", name: "Văn Lãng", full_name: "Huyện Văn Lãng", code_name: "van_lang", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1533", code: "204", name: "Cao Lộc", full_name: "Huyện Cao Lộc", code_name: "cao_loc", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1534", code: "205", name: "Văn Quan", full_name: "Huyện Văn Quan", code_name: "van_quan", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1535", code: "206", name: "Bắc Sơn", full_name: "Huyện Bắc Sơn", code_name: "bac_son", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1536", code: "207", name: "Hữu Lũng", full_name: "Huyện Hữu Lũng", code_name: "huu_lung", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1537", code: "208", name: "Chi Lăng", full_name: "Huyện Chi Lăng", code_name: "chi_lang", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1538", code: "209", name: "Lộc Bình", full_name: "Huyện Lộc Bình", code_name: "loc_binh", province_code: "20", administrative_unit_id: 3, is_active: true },
        { _id: "d1539", code: "210", name: "Đình Lập", full_name: "Huyện Đình Lập", code_name: "dinh_lap", province_code: "20", administrative_unit_id: 3, is_active: true }
    ],

    // Quảng Ninh (22)
    "22": [
        { _id: "d1540", code: "220", name: "Hạ Long", full_name: "Thành phố Hạ Long", code_name: "ha_long", province_code: "22", administrative_unit_id: 1, is_active: true },
        { _id: "d1541", code: "221", name: "Móng Cái", full_name: "Thành phố Móng Cái", code_name: "mong_cai", province_code: "22", administrative_unit_id: 1, is_active: true },
        { _id: "d1542", code: "222", name: "Cẩm Phả", full_name: "Thành phố Cẩm Phả", code_name: "cam_pha", province_code: "22", administrative_unit_id: 1, is_active: true },
        { _id: "d1543", code: "223", name: "Uông Bí", full_name: "Thành phố Uông Bí", code_name: "uong_bi", province_code: "22", administrative_unit_id: 1, is_active: true },
        { _id: "d1544", code: "224", name: "Bình Liêu", full_name: "Huyện Bình Liêu", code_name: "binh_lieu", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1545", code: "225", name: "Tiên Yên", full_name: "Huyện Tiên Yên", code_name: "tien_yen", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1546", code: "226", name: "Đầm Hà", full_name: "Huyện Đầm Hà", code_name: "dam_ha", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1547", code: "227", name: "Hải Hà", full_name: "Huyện Hải Hà", code_name: "hai_ha", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1548", code: "228", name: "Ba Chẽ", full_name: "Huyện Ba Chẽ", code_name: "ba_che", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1549", code: "229", name: "Vân Đồn", full_name: "Huyện Vân Đồn", code_name: "van_don", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1550", code: "230", name: "Hoành Bồ", full_name: "Huyện Hoành Bồ", code_name: "hoanh_bo", province_code: "22", administrative_unit_id: 3, is_active: true },
        { _id: "d1551", code: "231", name: "Đông Triều", full_name: "Thị xã Đông Triều", code_name: "dong_trieu", province_code: "22", administrative_unit_id: 4, is_active: true },
        { _id: "d1552", code: "232", name: "Quảng Yên", full_name: "Thị xã Quảng Yên", code_name: "quang_yen", province_code: "22", administrative_unit_id: 4, is_active: true },
        { _id: "d1553", code: "233", name: "Cô Tô", full_name: "Huyện Cô Tô", code_name: "co_to", province_code: "22", administrative_unit_id: 3, is_active: true }
    ],

    // Bắc Giang (24)
    "24": [
        { _id: "d2400", code: "240", name: "Bắc Giang", full_name: "Thành phố Bắc Giang", code_name: "bac_giang_tp", province_code: "24", administrative_unit_id: 1, is_active: true },
        { _id: "d2401", code: "241", name: "Yên Thế", full_name: "Huyện Yên Thế", code_name: "yen_the", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2402", code: "242", name: "Tân Yên", full_name: "Huyện Tân Yên", code_name: "tan_yen", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2403", code: "243", name: "Lạng Giang", full_name: "Huyện Lạng Giang", code_name: "lang_giang", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2404", code: "244", name: "Lục Nam", full_name: "Huyện Lục Nam", code_name: "luc_nam", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2405", code: "245", name: "Lục Ngạn", full_name: "Huyện Lục Ngạn", code_name: "luc_ngan", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2406", code: "246", name: "Sơn Động", full_name: "Huyện Sơn Động", code_name: "son_dong", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2407", code: "247", name: "Yên Dũng", full_name: "Huyện Yên Dũng", code_name: "yen_dung", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2408", code: "248", name: "Việt Yên", full_name: "Huyện Việt Yên", code_name: "viet_yen", province_code: "24", administrative_unit_id: 3, is_active: true },
        { _id: "d2409", code: "249", name: "Hiệp Hòa", full_name: "Huyện Hiệp Hòa", code_name: "hiep_hoa", province_code: "24", administrative_unit_id: 3, is_active: true }
    ],

    // Phú Thọ (25)
    "25": [
        { _id: "d2500", code: "250", name: "Việt Trì", full_name: "Thành phố Việt Trì", code_name: "viet_tri", province_code: "25", administrative_unit_id: 1, is_active: true },
        { _id: "d2501", code: "251", name: "Phú Thọ", full_name: "Thị xã Phú Thọ", code_name: "phu_tho_tx", province_code: "25", administrative_unit_id: 4, is_active: true },
        { _id: "d2502", code: "252", name: "Đoan Hùng", full_name: "Huyện Đoan Hùng", code_name: "doan_hung", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2503", code: "253", name: "Hạ Hoà", full_name: "Huyện Hạ Hoà", code_name: "ha_hoa", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2504", code: "254", name: "Thanh Ba", full_name: "Huyện Thanh Ba", code_name: "thanh_ba", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2505", code: "255", name: "Phù Ninh", full_name: "Huyện Phù Ninh", code_name: "phu_ninh", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2506", code: "256", name: "Yên Lập", full_name: "Huyện Yên Lập", code_name: "yen_lap", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2507", code: "257", name: "Cẩm Khê", full_name: "Huyện Cẩm Khê", code_name: "cam_khe", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2508", code: "258", name: "Tam Nông", full_name: "Huyện Tam Nông", code_name: "tam_nong", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2509", code: "259", name: "Lâm Thao", full_name: "Huyện Lâm Thao", code_name: "lam_thao", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2510", code: "260", name: "Thanh Sơn", full_name: "Huyện Thanh Sơn", code_name: "thanh_son", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2511", code: "261", name: "Thanh Thuỷ", full_name: "Huyện Thanh Thuỷ", code_name: "thanh_thuy", province_code: "25", administrative_unit_id: 3, is_active: true },
        { _id: "d2512", code: "262", name: "Tân Sơn", full_name: "Huyện Tân Sơn", code_name: "tan_son", province_code: "25", administrative_unit_id: 3, is_active: true }
    ]
`;

console.log(allRemainingDistricts);
