// Ship Configuration Types
export interface ShipConfig {
    _id: string;
    freeShippingThreshold: number;
    shippingFee: number;
    isActive: boolean;
    description?: string;
    createdBy: {
        _id: string;
        usr_name: string;
        usr_email: string;
    };
    updatedBy?: {
        _id: string;
        usr_name: string;
        usr_email: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    formattedShippingFee?: string;
    formattedFreeShippingThreshold?: string;
}

// Create Ship Config Request
export interface CreateShipConfigRequest {
    freeShippingThreshold: number;
    shippingFee: number;
    isActive?: boolean;
    description?: string;
}

// Update Ship Config Request
export interface UpdateShipConfigRequest {
    freeShippingThreshold?: number;
    shippingFee?: number;
    isActive?: boolean;
    description?: string;
}

// Ship Config Form Data
export interface ShipConfigFormData {
    freeShippingThreshold: number;
    shippingFee: number;
    isActive: boolean;
    description: string;
}

// Get Ship Configs Query Parameters
export interface GetShipConfigsParams {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
    sort_by?: 'createdAt' | 'updatedAt' | 'freeShippingThreshold' | 'shippingFee';
    sort_order?: 'asc' | 'desc';
}

// Ship Configs Response
export interface ShipConfigsResponse {
    success: boolean;
    message: string;
    data: ShipConfig[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    };
}

// Single Ship Config Response
export interface ShipConfigResponse {
    success: boolean;
    message: string;
    data: ShipConfig;
}

// Calculate Shipping Fee Request
export interface CalculateShippingFeeRequest {
    orderValue: number;
}

// Calculate Shipping Fee Response
export interface CalculateShippingFeeResponse {
    success: boolean;
    message: string;
    data: {
        orderValue: number;
        shippingFee: number;
        freeShippingThreshold: number;
        isFreeShipping: boolean;
        totalAmount: number;
    };
}

// Toggle Status Request
export interface ToggleShipConfigStatusRequest {
    isActive: boolean;
}

// API Response Base
export interface ApiResponse {
    success: boolean;
    message: string;
}

// Error Response
export interface ErrorResponse {
    success: false;
    message: string;
    statusCode?: number;
    stack?: string;
}

// Ship Config Table Column
export interface ShipConfigTableColumn {
    key: keyof ShipConfig | 'actions';
    title: string;
    sortable?: boolean;
    render?: (value: any, record: ShipConfig) => React.ReactNode;
}

// Ship Config Filter Options
export interface ShipConfigFilterOptions {
    isActive: Array<{
        label: string;
        value: boolean | 'all';
    }>;
    sortBy: Array<{
        label: string;
        value: string;
    }>;
    sortOrder: Array<{
        label: string;
        value: 'asc' | 'desc';
    }>;
}

// Ship Config Actions
export type ShipConfigAction = 'view' | 'edit' | 'delete' | 'toggle-status';

// Ship Config Modal State
export interface ShipConfigModalState {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view' | 'delete';
    config?: ShipConfig;
}

// Ship Config Form Validation Errors
export interface ShipConfigFormErrors {
    freeShippingThreshold?: string;
    shippingFee?: string;
    description?: string;
    general?: string;
}

// Ship Config Loading States
export interface ShipConfigLoadingStates {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    toggle: boolean;
    calculate: boolean;
}

// Ship Config Store State (for Redux/Zustand)
export interface ShipConfigState {
    configs: ShipConfig[];
    activeConfig: ShipConfig | null;
    loading: ShipConfigLoadingStates;
    error: string | null;
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    };
    filters: GetShipConfigsParams;
    modal: ShipConfigModalState;
}
