import React, { useState, useEffect, useRef } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, X } from 'lucide-react'
import './create.order.css'
import OrderSummary from './components/OrderSummary'
import CustomerInfo from './components/CustomerInfo'
import ProductTable from './components/ProductTable'
import ProductSearchDropdown from './components/ProductSearchDropdown'
import { useProductSearch } from '@/hooks/useProductSearch'

// Interface cho tab đơn hàng
interface OrderTab {
    id: string
    name: string
    products: OrderProduct[]
    customerInfo?: CustomerInfos
    isActive: boolean
}

// Interface cho sản phẩm trong đơn hàng
interface OrderProduct {
    _id: string
    product_name: string
    product_thumb: string
    product_basePrice: number
    quantity: number
    size?: string
    price: number
    total: number
}

// Interface cho thông tin khách hàng
interface CustomerInfos {
    name: string
    phone: string
    email: string
    address: string
    note?: string
}

export default function CreateOrder() {
    const [tabs, setTabs] = useState<OrderTab[]>([
        {
            id: '1',
            name: 'Đơn hàng #1',
            products: [],
            isActive: true
        }
    ])
    const [activeTab, setActiveTab] = useState('1')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false)

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    // Custom hook cho product search
    const {
        searchResults,
        isSearching,
        searchError,
        hasSearched,
        clearSearch
    } = useProductSearch(searchQuery)

    // Load tabs từ localStorage khi component mount
    useEffect(() => {
        const savedTabs = localStorage.getItem('orderTabs')
        if (savedTabs) {
            const parsedTabs = JSON.parse(savedTabs)
            setTabs(parsedTabs)
            const activeTabData = parsedTabs.find((tab: OrderTab) => tab.isActive)
            if (activeTabData) {
                setActiveTab(activeTabData.id)
            }
        }
    }, [])

    // Lưu tabs vào localStorage mỗi khi tabs thay đổi
    useEffect(() => {
        localStorage.setItem('orderTabs', JSON.stringify(tabs))
    }, [tabs])

    // Effect để hiển thị/ẩn dropdown khi có search query
    useEffect(() => {
        setIsSearchDropdownVisible(searchQuery.trim().length > 0)
    }, [searchQuery])

    // Effect để đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchDropdownVisible(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Tạo tab mới
    const createNewTab = () => {
        const newTabId = Date.now().toString()
        const newTab: OrderTab = {
            id: newTabId,
            name: `Đơn hàng #${tabs.length + 1}`,
            products: [],
            isActive: false
        }

        // Cập nhật tabs: bỏ active của tab hiện tại và thêm tab mới
        const updatedTabs = tabs.map(tab => ({ ...tab, isActive: false }))
        updatedTabs.push({ ...newTab, isActive: true })

        setTabs(updatedTabs)
        setActiveTab(newTabId)
    }

    // Đóng tab
    const closeTab = (tabId: string) => {
        if (tabs.length === 1) return // Không cho phép đóng tab cuối cùng

        const updatedTabs = tabs.filter(tab => tab.id !== tabId)

        // Nếu đóng tab đang active, chuyển sang tab đầu tiên
        if (tabId === activeTab && updatedTabs.length > 0) {
            updatedTabs[0].isActive = true
            setActiveTab(updatedTabs[0].id)
        }

        setTabs(updatedTabs)
    }

    // Chuyển tab
    const switchTab = (tabId: string) => {
        const updatedTabs = tabs.map(tab => ({
            ...tab,
            isActive: tab.id === tabId
        }))
        setTabs(updatedTabs)
        setActiveTab(tabId)
    }

    // Handler cho search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        // Hiển thị dropdown khi có input
        if (value.trim()) {
            setIsSearchDropdownVisible(true)
        }
    }

    // Handler cho việc clear search
    const handleClearSearch = () => {
        setSearchQuery('')
        setIsSearchDropdownVisible(false)
        clearSearch()
        searchInputRef.current?.focus()
    }

    // Handler cho việc chọn sản phẩm từ search results
    const handleProductSelect = (product: Product) => {
        const currentTab = tabs.find(tab => tab.id === activeTab)
        if (!currentTab) return

        const existingProduct = currentTab.products.find(p => p._id === product._id)

        if (existingProduct) {
            // Nếu sản phẩm đã có, tăng số lượng
            const updatedProducts = currentTab.products.map(p => {
                if (p._id === product._id) {
                    const newQuantity = p.quantity + 1
                    return {
                        ...p,
                        quantity: newQuantity,
                        total: p.price * newQuantity
                    }
                }
                return p
            })

            const updatedTabs = tabs.map(t =>
                t.id === activeTab ? { ...t, products: updatedProducts } : t
            )
            setTabs(updatedTabs)
        } else {
            // Thêm sản phẩm mới
            const newOrderProduct: OrderProduct = {
                _id: product._id,
                product_name: product.product_name,
                product_thumb: product.product_thumb,
                product_basePrice: product.product_basePrice,
                quantity: 1,
                price: product.product_basePrice,
                total: product.product_basePrice
            }

            const updatedTabs = tabs.map(t =>
                t.id === activeTab ? { ...t, products: [...t.products, newOrderProduct] } : t
            )
            setTabs(updatedTabs)
        }

        // Clear search sau khi thêm sản phẩm
        handleClearSearch()
    }

    // Lấy tab hiện tại
    const currentTab = tabs.find(tab => tab.id === activeTab)

    return (
        <div className="h-screen flex flex-col bg-green-50">
            {/* Tabs */}
            <div className="flex pt-1 pl-2 ">
                <div className="relative" ref={searchContainerRef}>
                    <Search className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Nhập tên sản phẩm..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (searchQuery.trim()) {
                                setIsSearchDropdownVisible(true)
                            }
                        }}
                        className="pl-10 w-80"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={handleClearSearch}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}

                    {/* Search Dropdown */}
                    <ProductSearchDropdown
                        searchResults={searchResults}
                        isSearching={isSearching}
                        searchError={searchError}
                        hasSearched={hasSearched}
                        searchQuery={searchQuery}
                        onProductSelect={handleProductSelect}
                        isVisible={isSearchDropdownVisible}
                    />
                </div>
                <div className="flex  items-center px-6">
                    <Tabs value={activeTab} onValueChange={switchTab} className="flex-1">
                        <TabsList className="h-auto p-0 bg-transparent bo">
                            {tabs.map((tab) => (
                                <div key={tab.id} className="relative group">
                                    <TabsTrigger
                                        value={tab.id}
                                        className="relative pr-8 rounded-t-sm data-[state=active]:bg-white"
                                    >
                                        {tab.name}
                                    </TabsTrigger>
                                    {tabs.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                closeTab(tab.id)
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button size='sm'
                                onClick={() => createNewTab()}
                                className='bg-transparent text-black hover:bg-transparent'>
                                +
                            </Button>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 gap-3  flex overflow-hidden">
                {/* Bảng sản phẩm */}
                <div className="flex-1  flex flex-col">
                    <Tabs value={activeTab} className="flex-1 flex flex-col">
                        {tabs.map((tab) => (
                            <TabsContent
                                key={tab.id}
                                value={tab.id}
                                className="flex-1 bg-white  m-0 data-[state=inactive]:hidden"
                            >
                                <ProductTable
                                    products={tab.products}
                                    onProductsChange={(products) => {
                                        const updatedTabs = tabs.map(t =>
                                            t.id === tab.id ? { ...t, products } : t
                                        )
                                        setTabs(updatedTabs)
                                    }}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Sidebar bên phải */}
                <div className="w-[350px] flex flex-col ">
                    {currentTab && (
                        <>
                            <CustomerInfo
                                customerInfo={currentTab.customerInfo}
                                onCustomerInfoChange={(customerInfo) => {
                                    const updatedTabs = tabs.map(t =>
                                        t.id === currentTab.id ? { ...t, customerInfo } : t
                                    )
                                    setTabs(updatedTabs)
                                }}
                            />
                            <OrderSummary
                                products={currentTab.products}
                                onCreateOrder={() => { }}
                            />

                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
