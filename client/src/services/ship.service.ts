import axiosCustomize from "./axios.customize";
import {
    ShipConfig,
    ShipConfigsResponse,
    ShipConfigResponse,
    CreateShipConfigRequest,
    UpdateShipConfigRequest,
    GetShipConfigsParams,
    CalculateShippingFeeRequest,
    CalculateShippingFeeResponse,
    ToggleShipConfigStatusRequest,
    ApiResponse
} from "@/types/ship";

// API endpoints
const SHIP_ENDPOINTS = {
    BASE: '/ship',
    ACTIVE: '/ship/active',
    CALCULATE_FEE: '/ship/calculate-fee',
    TOGGLE_STATUS: (id: string) => `/ship/${id}/toggle-status`,
    BY_ID: (id: string) => `/ship/${id}`,
} as const;

/**
 * Get all ship configurations with pagination and filters
 */
export const getShipConfigs = async (params?: GetShipConfigsParams): Promise<ShipConfigsResponse> => {
    const response = await axiosCustomize.get<ShipConfigsResponse>(SHIP_ENDPOINTS.BASE, {
        params
    });
    return response.data;
};

/**
 * Get active ship configuration (public API)
 */
export const getActiveShipConfig = async (): Promise<ShipConfigResponse> => {
    const response = await axiosCustomize.get<ShipConfigResponse>(SHIP_ENDPOINTS.ACTIVE);
    return response.data;
};

/**
 * Get ship configuration by ID
 */
export const getShipConfigById = async (id: string): Promise<ShipConfigResponse> => {
    const response = await axiosCustomize.get<ShipConfigResponse>(SHIP_ENDPOINTS.BY_ID(id));
    return response.data;
};

/**
 * Create new ship configuration
 */
export const createShipConfig = async (data: CreateShipConfigRequest): Promise<ShipConfigResponse> => {
    const response = await axiosCustomize.post<ShipConfigResponse>(SHIP_ENDPOINTS.BASE, data);
    return response.data;
};

/**
 * Update ship configuration
 */
export const updateShipConfig = async (
    id: string, 
    data: UpdateShipConfigRequest
): Promise<ShipConfigResponse> => {
    const response = await axiosCustomize.put<ShipConfigResponse>(SHIP_ENDPOINTS.BY_ID(id), data);
    return response.data;
};

/**
 * Delete ship configuration
 */
export const deleteShipConfig = async (id: string): Promise<ApiResponse> => {
    const response = await axiosCustomize.delete<ApiResponse>(SHIP_ENDPOINTS.BY_ID(id));
    return response.data;
};

/**
 * Toggle ship configuration status (active/inactive)
 */
export const toggleShipConfigStatus = async (
    id: string, 
    data: ToggleShipConfigStatusRequest
): Promise<ShipConfigResponse> => {
    const response = await axiosCustomize.patch<ShipConfigResponse>(
        SHIP_ENDPOINTS.TOGGLE_STATUS(id), 
        data
    );
    return response.data;
};

/**
 * Calculate shipping fee for order (public API)
 */
export const calculateShippingFee = async (
    data: CalculateShippingFeeRequest
): Promise<CalculateShippingFeeResponse> => {
    const response = await axiosCustomize.post<CalculateShippingFeeResponse>(
        SHIP_ENDPOINTS.CALCULATE_FEE, 
        data
    );
    return response.data;
};

// Utility functions for formatting
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatCurrencyShort = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
};

// Helper function to format ship config for display
export const formatShipConfigForDisplay = (config: ShipConfig): ShipConfig => {
    return {
        ...config,
        formattedShippingFee: formatCurrencyShort(config.shippingFee),
        formattedFreeShippingThreshold: formatCurrencyShort(config.freeShippingThreshold),
    };
};

// Helper function to validate ship config data
export const validateShipConfigData = (data: CreateShipConfigRequest | UpdateShipConfigRequest) => {
    const errors: Record<string, string> = {};

    if ('freeShippingThreshold' in data && data.freeShippingThreshold !== undefined) {
        if (data.freeShippingThreshold < 0) {
            errors.freeShippingThreshold = 'Ngưỡng miễn phí ship phải >= 0';
        }
    }

    if ('shippingFee' in data && data.shippingFee !== undefined) {
        if (data.shippingFee < 0) {
            errors.shippingFee = 'Phí ship phải >= 0';
        }
    }

    if ('description' in data && data.description && data.description.length > 500) {
        errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Export all ship service functions
export const shipService = {
    getShipConfigs,
    getActiveShipConfig,
    getShipConfigById,
    createShipConfig,
    updateShipConfig,
    deleteShipConfig,
    toggleShipConfigStatus,
    calculateShippingFee,
    formatCurrency,
    formatCurrencyShort,
    formatShipConfigForDisplay,
    validateShipConfigData,
};

export default shipService;
