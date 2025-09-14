import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getLandingPageAPI,
    updateHeaderAPI,
    updateAboutSectionAPI,
    updateVideoAPI,
    updateMainSectionAPI,
    updateEventSectionAPI,
    updateCarouselAPI,
    createLandingPageAPI,
    deleteLandingPageAPI
} from '@/apis/landing-page.apis';

export const useLandingPage = () => {
    const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch landing page data
    const fetchLandingPage = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getLandingPageAPI();
            setLandingPage(response.data.data);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể tải dữ liệu landing page';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update header section
    const updateHeader = async (data: Partial<LandingPageHeader>) => {
        try {
            setLoading(true);
            const response = await updateHeaderAPI(data);
            setLandingPage(response.data.data);
            toast.success('Cập nhật header thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật header';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update about section
    const updateAboutSection = async (data: Partial<LandingPageAboutSection>) => {
        try {
            setLoading(true);
            const response = await updateAboutSectionAPI(data);
            setLandingPage(response.data.data);
            toast.success('Cập nhật phần giới thiệu thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật phần giới thiệu';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update video section
    const updateVideo = async (data: Partial<LandingPageVideo>) => {
        try {
            setLoading(true);
            const response = await updateVideoAPI(data);
            setLandingPage(response.data.data);
            toast.success('Cập nhật video thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật video';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update main section
    const updateMainSection = async (data: LandingPageMainSectionItem[]) => {
        try {
            setLoading(true);
            const response = await updateMainSectionAPI(data);
            setLandingPage(response.data.data);
            toast.success('Cập nhật phần chính thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật phần chính';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update event section
    const updateEventSection = async (data: Partial<LandingPageEventSection>) => {
        try {
            setLoading(true);

            const dataUpdate = {
                ...data,
                subSection: data.subSection?.map(sub => ({
                    title: sub.title,
                    detail: sub.detail
                }))
            }

            const response = await updateEventSectionAPI(dataUpdate);
            setLandingPage(response.data.data);
            toast.success('Cập nhật phần sự kiện thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật phần sự kiện';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update carousel section
    const updateCarousel = async (data: Partial<LandingPageCarousel>) => {
        try {
            setLoading(true);
            const response = await updateCarouselAPI(data);
            setLandingPage(response.data.data);
            toast.success('Cập nhật carousel thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể cập nhật carousel';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create landing page
    const createLandingPage = async (data: LandingPageFormData) => {
        try {
            setLoading(true);
            const response = await createLandingPageAPI(data);
            setLandingPage(response.data.data);
            toast.success('Tạo landing page thành công!');
            return response.data.data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể tạo landing page';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete landing page
    const deleteLandingPage = async () => {
        try {
            setLoading(true);
            await deleteLandingPageAPI();
            setLandingPage(null);
            toast.success('Xóa landing page thành công!');
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể xóa landing page';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchLandingPage();
    }, []);

    return {
        landingPage,
        loading,
        error,
        fetchLandingPage,
        updateHeader,
        updateAboutSection,
        updateVideo,
        updateMainSection,
        updateEventSection,
        updateCarousel,
        createLandingPage,
        deleteLandingPage
    };
};
