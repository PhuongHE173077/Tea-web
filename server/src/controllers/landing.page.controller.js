const { StatusCodes } = require("http-status-codes");
const landingPageService = require("~/services/landing.page.service");

// GET: Lấy thông tin landing page hiện tại
const getLandingPage = async (req, res, next) => {
    try {
        const landingPage = await landingPageService.getLandingPage();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Get landing page successfully",
            data: landingPage
        });
    } catch (error) {
        next(error);
    }
};

// POST: Tạo mới landing page
const createLandingPage = async (req, res, next) => {
    try {
        const newLandingPage = await landingPageService.createLandingPage(req.body);
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Landing page created successfully",
            data: newLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PUT: Cập nhật toàn bộ landing page
const updateLandingPage = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPage(req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Landing page updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật header section
const updateHeader = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('header', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Header section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật about section
const updateAboutSection = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('aboutSection', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "About section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật video section
const updateVideo = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('video', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Video section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật main section
const updateMainSection = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('mainSection', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Main section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật event section
const updateEventSection = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('eventSection', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Event section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// PATCH: Cập nhật carousel section
const updateCarousel = async (req, res, next) => {
    try {
        const updatedLandingPage = await landingPageService.updateLandingPageSection('carousel', req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Carousel section updated successfully",
            data: updatedLandingPage
        });
    } catch (error) {
        next(error);
    }
};

// DELETE: Xóa landing page
const deleteLandingPage = async (req, res, next) => {
    try {
        const result = await landingPageService.deleteLandingPage();
        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLandingPage,
    createLandingPage,
    updateLandingPage,
    updateHeader,
    updateAboutSection,
    updateVideo,
    updateMainSection,
    updateEventSection,
    updateCarousel,
    deleteLandingPage
};
