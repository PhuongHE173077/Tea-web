const { StatusCodes } = require("http-status-codes");
const CompanyInfo = require("~/models/company.info.model");
const { default: ApiError } = require("~/utils/ApiError");

/**
 * Lấy danh sách thông tin công ty với phân trang và tìm kiếm
 * @param {Object} query - Query parameters
 * @param {number} query.page - Số trang (mặc định: 1)
 * @param {number} query.limit - Số lượng item mỗi trang (mặc định: 10)
 * @param {string} query.search - Từ khóa tìm kiếm
 * @param {string} query.sortBy - Trường để sắp xếp (mặc định: createdAt)
 * @param {string} query.sortOrder - Thứ tự sắp xếp (asc/desc, mặc định: desc)
 * @returns {Object} Danh sách company info với thông tin phân trang
 */
const getAllCompanyInfos = async (query = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            filter: customFilter = {}
        } = query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Tạo filter cho tìm kiếm
        let filter = { ...customFilter };
        if (search) {
            const searchFilter = {
                $or: [
                    { company_name: { $regex: search, $options: 'i' } },
                    { company_description: { $regex: search, $options: 'i' } },
                    { company_address: { $regex: search, $options: 'i' } },
                    { company_email: { $regex: search, $options: 'i' } },
                    { company_phone: { $regex: search, $options: 'i' } }
                ]
            };

            // Nếu đã có filter khác, combine với search filter
            if (Object.keys(filter).length > 0) {
                filter = { $and: [filter, searchFilter] };
            } else {
                filter = searchFilter;
            }
        }

        // Tạo sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Thực hiện query
        const [companyInfos, total] = await Promise.all([
            CompanyInfo.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            CompanyInfo.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limitNumber);

        return {
            data: companyInfos,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        };
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi lấy danh sách thông tin công ty: ${error.message}`);
    }
};

/**
 * Lấy thông tin chi tiết một công ty theo ID
 * @param {string} id - ID của company info
 * @returns {Object} Thông tin chi tiết company info
 */
const getCompanyInfoById = async (id) => {
    try {
        const companyInfo = await CompanyInfo.findById(id).lean();

        if (!companyInfo) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy thông tin công ty");
        }

        return companyInfo;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi lấy thông tin công ty: ${error.message}`);
    }
};

/**
 * Tạo mới thông tin công ty
 * @param {Object} data - Dữ liệu company info
 * @returns {Object} Company info vừa được tạo
 */
const createCompanyInfo = async (data) => {
    try {
        // Kiểm tra xem đã có company info với tên này chưa
        const existingCompanyInfo = await CompanyInfo.findOne({
            company_name: data.company_name
        }).lean();

        if (existingCompanyInfo) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Tên công ty đã tồn tại");
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await CompanyInfo.findOne({
            company_email: data.company_email
        }).lean();

        if (existingEmail) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Email công ty đã tồn tại");
        }

        const newCompanyInfo = new CompanyInfo(data);
        const savedCompanyInfo = await newCompanyInfo.save();

        return savedCompanyInfo.toObject();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi tạo thông tin công ty: ${error.message}`);
    }
};

/**
 * Cập nhật thông tin công ty
 * @param {string} id - ID của company info
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Object} Company info đã được cập nhật
 */
const updateCompanyInfo = async (id, data) => {
    try {
        // Kiểm tra company info có tồn tại không
        const existingCompanyInfo = await CompanyInfo.findById(id);
        if (!existingCompanyInfo) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy thông tin công ty");
        }

        // Kiểm tra tên công ty đã tồn tại chưa (nếu có thay đổi)
        if (data.company_name && data.company_name !== existingCompanyInfo.company_name) {
            const duplicateName = await CompanyInfo.findOne({
                company_name: data.company_name,
                _id: { $ne: id }
            }).lean();

            if (duplicateName) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Tên công ty đã tồn tại");
            }
        }

        // Kiểm tra email đã tồn tại chưa (nếu có thay đổi)
        if (data.company_email && data.company_email !== existingCompanyInfo.company_email) {
            const duplicateEmail = await CompanyInfo.findOne({
                company_email: data.company_email,
                _id: { $ne: id }
            }).lean();

            if (duplicateEmail) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Email công ty đã tồn tại");
            }
        }

        const updatedCompanyInfo = await CompanyInfo.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).lean();

        return updatedCompanyInfo;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi cập nhật thông tin công ty: ${error.message}`);
    }
};

/**
 * Xóa thông tin công ty
 * @param {string} id - ID của company info
 * @returns {Object} Thông báo xóa thành công
 */
const deleteCompanyInfo = async (id) => {
    try {
        const companyInfo = await CompanyInfo.findById(id);
        if (!companyInfo) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy thông tin công ty");
        }

        await CompanyInfo.findByIdAndDelete(id);

        return {
            message: "Xóa thông tin công ty thành công",
            deletedId: id
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi xóa thông tin công ty: ${error.message}`);
    }
};

/**
 * Lấy thông tin công ty duy nhất (single company info)
 * @returns {Object} Thông tin công ty duy nhất
 */
const getSingleCompanyInfo = async () => {
    try {
        // Lấy company info đầu tiên (vì chỉ có 1 company info duy nhất)
        const companyInfo = await CompanyInfo.findOne().lean();

        if (!companyInfo) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy thông tin công ty");
        }

        return companyInfo;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi lấy thông tin công ty: ${error.message}`);
    }
};

/**
 * Lấy thống kê tổng quan về company info
 * @returns {Object} Thống kê tổng quan
 */
const getCompanyInfoStats = async () => {
    try {
        const [total, activeCompanies] = await Promise.all([
            CompanyInfo.countDocuments(),
            CompanyInfo.countDocuments({
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
            })
        ]);

        return {
            total,
            activeCompanies,
            inactiveCompanies: total - activeCompanies
        };
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi khi lấy thống kê: ${error.message}`);
    }
};

module.exports = {
    getAllCompanyInfos,
    getCompanyInfoById,
    getSingleCompanyInfo,
    createCompanyInfo,
    updateCompanyInfo,
    deleteCompanyInfo,
    getCompanyInfoStats
};
