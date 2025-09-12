import axiosCustomize from "@/services/axios.customize";

// API endpoints
const LANDING_PAGE_ENDPOINTS = {
    GET_LANDING_PAGE: '/landing-page',
    CREATE_LANDING_PAGE: '/landing-page',
    UPDATE_LANDING_PAGE: '/landing-page',
    DELETE_LANDING_PAGE: '/landing-page',
    UPDATE_HEADER: '/landing-page/header',
    UPDATE_ABOUT: '/landing-page/about',
    UPDATE_VIDEO: '/landing-page/video',
    UPDATE_MAIN_SECTION: '/landing-page/main-section',
    UPDATE_EVENT_SECTION: '/landing-page/event-section',
    UPDATE_CAROUSEL: '/landing-page/carousel',
} as const;

// Get landing page
export const getLandingPageAPI = async () => {
    return await axiosCustomize.get(LANDING_PAGE_ENDPOINTS.GET_LANDING_PAGE);
};

// Create landing page
export const createLandingPageAPI = async (data: LandingPageFormData) => {
    return await axiosCustomize.post(LANDING_PAGE_ENDPOINTS.CREATE_LANDING_PAGE, data);
};

// Update entire landing page
export const updateLandingPageAPI = async (data: LandingPageFormData) => {
    return await axiosCustomize.put(LANDING_PAGE_ENDPOINTS.UPDATE_LANDING_PAGE, data);
};

// Delete landing page
export const deleteLandingPageAPI = async () => {
    return await axiosCustomize.delete(LANDING_PAGE_ENDPOINTS.DELETE_LANDING_PAGE);
};

// Update header section
export const updateHeaderAPI = async (data: Partial<LandingPageHeader>) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_HEADER, data);
};

// Update about section
export const updateAboutSectionAPI = async (data: Partial<LandingPageAboutSection>) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_ABOUT, data);
};

// Update video section
export const updateVideoAPI = async (data: Partial<LandingPageVideo>) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_VIDEO, data);
};

// Update main section
export const updateMainSectionAPI = async (data: LandingPageMainSectionItem[]) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_MAIN_SECTION, data);
};

// Update event section
export const updateEventSectionAPI = async (data: Partial<LandingPageEventSection>) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_EVENT_SECTION, data);
};

// Update carousel section
export const updateCarouselAPI = async (data: Partial<LandingPageCarousel>) => {
    return await axiosCustomize.patch(LANDING_PAGE_ENDPOINTS.UPDATE_CAROUSEL, data);
};
