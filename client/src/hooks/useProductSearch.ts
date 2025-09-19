import { useState, useEffect, useCallback } from 'react'
import { fetchProductsAPIs } from '@/apis/product.apis'
import { useDebounce } from './useDebounce'

interface UseProductSearchResult {
    searchResults: Product[]
    isSearching: boolean
    searchError: string | null
    hasSearched: boolean
    clearSearch: () => void
}

/**
 * Custom hook để search sản phẩm với debounce
 * @param searchQuery - Query string để search
 * @param delay - Thời gian delay cho debounce (mặc định 400ms)
 * @returns Object chứa kết quả search và các state
 */
export function useProductSearch(searchQuery: string, delay: number = 400): UseProductSearchResult {
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    // Debounce search query
    const debouncedSearchQuery = useDebounce(searchQuery, delay)

    // Function để search sản phẩm
    const searchProducts = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            setHasSearched(false)
            setSearchError(null)
            return
        }

        setIsSearching(true)
        setSearchError(null)

        try {
            const response = await fetchProductsAPIs({
                page: 1,
                size: 20, // Giới hạn kết quả search
                search: query.trim()
            })

            setSearchResults(response.data || [])
            setHasSearched(true)
        } catch (error) {
            console.error('Lỗi khi search sản phẩm:', error)
            setSearchError('Có lỗi xảy ra khi tìm kiếm sản phẩm')
            setSearchResults([])
            setHasSearched(true)
        } finally {
            setIsSearching(false)
        }
    }, [])

    // Effect để thực hiện search khi debounced query thay đổi
    useEffect(() => {
        searchProducts(debouncedSearchQuery)
    }, [debouncedSearchQuery, searchProducts])

    // Function để clear search
    const clearSearch = useCallback(() => {
        setSearchResults([])
        setHasSearched(false)
        setSearchError(null)
        setIsSearching(false)
    }, [])

    return {
        searchResults,
        isSearching,
        searchError,
        hasSearched,
        clearSearch
    }
}
