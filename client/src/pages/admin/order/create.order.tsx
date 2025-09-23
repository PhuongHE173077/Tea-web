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
import ProductAttributeDialog from './components/ProductAttributeDialog'
import { useProductSearch } from '@/hooks/useProductSearch'
import { OrderProduct, OrderTab, SelectedProductAttribute } from './types'
import { createOrderAPIs } from '@/apis/order.apis'

// Interface cho tab đơn hàng


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

    // State cho dialog chọn thuộc tính
    const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false)
    const [selectedProductForAttributes, setSelectedProductForAttributes] = useState<Product | null>(null)

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
        // Kiểm tra xem sản phẩm có thuộc tính hay không
        const hasAttributes = product.product_attribute && product.product_attribute.length > 0

        if (hasAttributes) {
            // Nếu có thuộc tính, hiển thị dialog để chọn
            setSelectedProductForAttributes(product)
            setIsAttributeDialogOpen(true)
        } else {
            // Nếu không có thuộc tính, thêm trực tiếp vào đơn hàng
            addProductToOrder(product, [], product.product_basePrice)
        }

        // Clear search sau khi chọn sản phẩm
        handleClearSearch()
    }

    // Hàm thêm sản phẩm vào đơn hàng
    const addProductToOrder = (
        product: Product,
        selectedAttributes: SelectedProductAttribute[],
        finalPrice: number
    ) => {
        const currentTab = tabs.find(tab => tab.id === activeTab)
        if (!currentTab) return

        // Tạo key duy nhất cho sản phẩm dựa trên ID và thuộc tính đã chọn
        const attributeKey = selectedAttributes
            .map(attr => `${attr.name}-${attr.unit}`)
            .sort()
            .join('|')
        const productKey = `${product._id}${attributeKey ? `-${attributeKey}` : ''}`

        // Kiểm tra xem sản phẩm với thuộc tính này đã có trong đơn hàng chưa
        const existingProductIndex = currentTab.products.findIndex(p => {
            const existingAttributeKey = (p.selectedAttributes || [])
                .map(attr => `${attr.name}-${attr.unit}`)
                .sort()
                .join('|')
            const existingProductKey = `${p._id}${existingAttributeKey ? `-${existingAttributeKey}` : ''}`
            return existingProductKey === productKey
        })

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm với thuộc tính này đã có, tăng số lượng
            const updatedProducts = [...currentTab.products]
            const existingProduct = updatedProducts[existingProductIndex]
            const newQuantity = existingProduct.quantity + 1

            updatedProducts[existingProductIndex] = {
                ...existingProduct,
                quantity: newQuantity,
                total: finalPrice * newQuantity
            }

            const updatedTabs = tabs.map(t =>
                t.id === activeTab ? { ...t, products: updatedProducts } : t
            )
            setTabs(updatedTabs)
        } else {
            // Thêm sản phẩm mới với thuộc tính đã chọn
            const attributeDisplayName = selectedAttributes.length > 0
                ? selectedAttributes.map(attr => `${attr.name} (${attr.unit})`).join(', ')
                : undefined

            const newOrderProduct: OrderProduct = {
                _id: product._id,
                product_name: product.product_name,
                product_thumb: product.product_thumb,
                product_basePrice: product.product_basePrice,
                selectedAttributes: selectedAttributes.length > 0 ? selectedAttributes : undefined,
                quantity: 1,
                price: finalPrice,
                total: finalPrice,
                attributeDisplayName
            }

            const updatedTabs = tabs.map(t =>
                t.id === activeTab ? { ...t, products: [...t.products, newOrderProduct] } : t
            )
            setTabs(updatedTabs)
        }
    }

    // Handler cho việc xác nhận chọn thuộc tính
    const handleAttributeConfirm = (selectedAttributes: SelectedProductAttribute[], finalPrice: number) => {
        if (selectedProductForAttributes) {
            addProductToOrder(selectedProductForAttributes, selectedAttributes, finalPrice)
        }
        setIsAttributeDialogOpen(false)
        setSelectedProductForAttributes(null)
    }

    // Handler cho việc đóng dialog thuộc tính
    const handleAttributeDialogClose = () => {
        setIsAttributeDialogOpen(false)
        setSelectedProductForAttributes(null)
    }

    // Lấy tab hiện tại
    const currentTab = tabs.find(tab => tab.id === activeTab)

    // const createOrder = async () => {
    //     const dataAddOrder = {
    //         customer_info: currentTab?.customerInfo,
    //         cart_items: currentTab?.products,
    //         discount_code: '',
    //         shipping_address: currentTab?.customerInfo?.address,
    //         payment_method: 'cod'
    //     }
    //     await createOrderAPIs(dataAddOrder)
    // }

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
                                orderTab={currentTab}
                            />

                        </>
                    )}
                </div>
            </div>

            {/* Dialog chọn thuộc tính sản phẩm */}
            {selectedProductForAttributes && (
                <ProductAttributeDialog
                    isOpen={isAttributeDialogOpen}
                    onClose={handleAttributeDialogClose}
                    product={selectedProductForAttributes}
                    onConfirm={handleAttributeConfirm}
                />
            )}
        </div>
    )
}
