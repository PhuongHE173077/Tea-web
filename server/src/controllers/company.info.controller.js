const { StatusCodes } = require("http-status-codes");
const companyInfoService = require("~/services/company.info.service");

/**
 * Lấy danh sách thông tin công ty với phân trang và tìm kiếm
 * GET /api/company-info
 */
const getAllCompanyInfos = async (req, res, next) => {
    try {
        const result = await companyInfoService.getAllCompanyInfos(req.query);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy danh sách thông tin công ty thành công",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy thông tin chi tiết một công ty theo ID
 * GET /api/company-info/:id
 */
const getCompanyInfoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyInfo = await companyInfoService.getCompanyInfoById(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy thông tin công ty thành công",
            data: companyInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy thông tin công ty duy nhất (single company info)
 * GET /api/company-info/single
 */
const getSingleCompanyInfo = async (req, res, next) => {
    try {
        const companyInfo = await companyInfoService.getSingleCompanyInfo();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy thông tin công ty thành công",
            data: companyInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Tạo mới thông tin công ty
 * POST /api/company-info
 */
const createCompanyInfo = async (req, res, next) => {
    try {
        const newCompanyInfo = await companyInfoService.createCompanyInfo(req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Tạo thông tin công ty thành công",
            data: newCompanyInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cập nhật thông tin công ty
 * PUT /api/company-info/:id
 */
const updateCompanyInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCompanyInfo = await companyInfoService.updateCompanyInfo(id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật thông tin công ty thành công",
            data: updatedCompanyInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Xóa thông tin công ty
 * DELETE /api/company-info/:id
 */
const deleteCompanyInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await companyInfoService.deleteCompanyInfo(id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message,
            data: {
                deletedId: result.deletedId
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy thống kê tổng quan về company info
 * GET /api/company-info/stats
 */
const getCompanyInfoStats = async (req, res, next) => {
    try {
        const stats = await companyInfoService.getCompanyInfoStats();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy thống kê thành công",
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cập nhật trạng thái social media của công ty
 * PATCH /api/company-info/:id/social-status
 */
const updateSocialMediaStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { platform, isActive } = req.body;

        // Validate platform
        const validPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'shopee', 'zalo'];
        if (!validPlatforms.includes(platform)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Platform không hợp lệ"
            });
        }

        // Validate isActive
        if (typeof isActive !== 'boolean') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "isActive phải là boolean"
            });
        }

        const updateData = {};
        updateData[`company_${platform}.isActive`] = isActive;

        const updatedCompanyInfo = await companyInfoService.updateCompanyInfo(id, updateData);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Cập nhật trạng thái ${platform} thành công`,
            data: updatedCompanyInfo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Tìm kiếm công ty theo từ khóa
 * GET /api/company-info/search
 */
const searchCompanyInfos = async (req, res, next) => {
    try {
        const { q: search, ...otherQuery } = req.query;

        if (!search || search.trim() === '') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Từ khóa tìm kiếm không được để trống"
            });
        }

        const queryWithSearch = {
            ...otherQuery,
            search: search.trim()
        };

        const result = await companyInfoService.getAllCompanyInfos(queryWithSearch);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Tìm kiếm thông tin công ty với từ khóa "${search}" thành công`,
            data: result.data,
            pagination: result.pagination,
            searchQuery: search
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy danh sách công ty có social media active
 * GET /api/company-info/active-social
 */
const getCompaniesWithActiveSocial = async (req, res, next) => {
    try {
        const { platform } = req.query;

        let filter = {};
        if (platform) {
            const validPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'linkedin', 'shopee', 'zalo'];
            if (!validPlatforms.includes(platform)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Platform không hợp lệ"
                });
            }
            filter[`company_${platform}.isActive`] = true;
        } else {
            // Lấy tất cả công ty có ít nhất 1 social media active
            filter = {
                $or: [
                    { 'company_facebook.isActive': true },
                    { 'company_instagram.isActive': true },
                    { 'company_youtube.isActive': true },
                    { 'company_tiktok.isActive': true },
                    { 'company_twitter.isActive': true },
                    { 'company_linkedin.isActive': true },
                    { 'company_shopee.isActive': true },
                    { 'company_zalo.isActive': true }
                ]
            };
        }

        const queryWithFilter = {
            ...req.query,
            filter
        };

        const result = await companyInfoService.getAllCompanyInfos(queryWithFilter);

        res.status(StatusCodes.OK).json({
            success: true,
            message: platform
                ? `Lấy danh sách công ty có ${platform} active thành công`
                : "Lấy danh sách công ty có social media active thành công",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCompanyInfos,
    getCompanyInfoById,
    getSingleCompanyInfo,
    createCompanyInfo,
    updateCompanyInfo,
    deleteCompanyInfo,
    getCompanyInfoStats,
    updateSocialMediaStatus,
    searchCompanyInfos,
    getCompaniesWithActiveSocial
};
