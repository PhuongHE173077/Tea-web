const { StatusCodes } = require("http-status-codes");
const LandingPage = require("~/models/landing.page.model");
const ApiError = require("~/utils/ApiError").default;

const getLandingPage = async () => {
    try {
        // Lấy landing page đầu tiên (giả sử chỉ có 1 landing page)
        const landingPage = await LandingPage.findOne().lean();
        
        if (!landingPage) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Landing page not found");
        }
        
        return landingPage;
    } catch (error) {
        throw error;
    }
};

const createLandingPage = async (data) => {
    try {
        // Kiểm tra xem đã có landing page chưa
        const existingLandingPage = await LandingPage.findOne().lean();
        
        if (existingLandingPage) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Landing page already exists. Use update instead.");
        }
        
        const newLandingPage = await LandingPage.create(data);
        return newLandingPage;
    } catch (error) {
        throw error;
    }
};

const updateLandingPage = async (data) => {
    try {
        // Tìm landing page hiện tại
        const existingLandingPage = await LandingPage.findOne();
        
        if (!existingLandingPage) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Landing page not found");
        }
        
        // Cập nhật landing page
        const updatedLandingPage = await LandingPage.findByIdAndUpdate(
            existingLandingPage._id,
            data,
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        return updatedLandingPage;
    } catch (error) {
        throw error;
    }
};

const updateLandingPageSection = async (section, data) => {
    try {
        const existingLandingPage = await LandingPage.findOne();
        
        if (!existingLandingPage) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Landing page not found");
        }
        
        // Tạo object update với section cụ thể
        const updateData = {};
        updateData[section] = data;
        
        const updatedLandingPage = await LandingPage.findByIdAndUpdate(
            existingLandingPage._id,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        return updatedLandingPage;
    } catch (error) {
        throw error;
    }
};

const deleteLandingPage = async () => {
    try {
        const existingLandingPage = await LandingPage.findOne();
        
        if (!existingLandingPage) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Landing page not found");
        }
        
        await LandingPage.findByIdAndDelete(existingLandingPage._id);
        
        return { message: "Landing page deleted successfully" };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getLandingPage,
    createLandingPage,
    updateLandingPage,
    updateLandingPageSection,
    deleteLandingPage
};
