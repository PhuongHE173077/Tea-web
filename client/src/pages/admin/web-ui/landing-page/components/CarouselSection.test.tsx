import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CarouselSection } from './CarouselSection'
import { AddCarouselItemDialog } from './AddCarouselItemDialog'

// Mock toast
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    }
}))

// Mock API
jest.mock('@/apis', () => ({
    uploadSingleImage: jest.fn().mockResolvedValue('https://example.com/uploaded-image.jpg')
}))

const mockCarouselData: LandingPageCarousel = {
    title: "Test Carousel",
    detail: "Test carousel description",
    carouselList: [
        {
            title: "Test Item 1",
            detail: "Test item 1 description",
            imageCover: "https://example.com/image1.jpg",
            tab: "Category 1"
        }
    ],
    isActive: true
}

describe('CarouselSection', () => {
    const mockOnUpdate = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders carousel section with data', () => {
        render(
            <CarouselSection 
                data={mockCarouselData}
                onUpdate={mockOnUpdate}
                loading={false}
            />
        )

        expect(screen.getByDisplayValue('Test Carousel')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test carousel description')).toBeInTheDocument()
        expect(screen.getByText('Test Item 1')).toBeInTheDocument()
    })

    test('opens add dialog when clicking add button', () => {
        render(
            <CarouselSection 
                data={mockCarouselData}
                onUpdate={mockOnUpdate}
                loading={false}
            />
        )

        const addButton = screen.getByText('Thêm mục mới')
        fireEvent.click(addButton)

        expect(screen.getByText('Thêm mục Carousel mới')).toBeInTheDocument()
    })

    test('submits form with valid data', async () => {
        mockOnUpdate.mockResolvedValue({})

        render(
            <CarouselSection 
                data={mockCarouselData}
                onUpdate={mockOnUpdate}
                loading={false}
            />
        )

        const submitButton = screen.getByText('Lưu thay đổi')
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockOnUpdate).toHaveBeenCalledWith(mockCarouselData)
        })
    })

    test('shows validation error for empty required fields', async () => {
        const emptyData = { ...mockCarouselData, title: '', detail: '' }
        
        render(
            <CarouselSection 
                data={emptyData}
                onUpdate={mockOnUpdate}
                loading={false}
            />
        )

        const submitButton = screen.getByText('Lưu thay đổi')
        fireEvent.click(submitButton)

        // Should not call onUpdate due to validation
        expect(mockOnUpdate).not.toHaveBeenCalled()
    })
})

describe('AddCarouselItemDialog', () => {
    const mockOnAdd = jest.fn()
    const mockOnOpenChange = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders dialog when open', () => {
        render(
            <AddCarouselItemDialog 
                open={true}
                onOpenChange={mockOnOpenChange}
                onAdd={mockOnAdd}
            />
        )

        expect(screen.getByText('Thêm mục Carousel mới')).toBeInTheDocument()
        expect(screen.getByLabelText('Tiêu đề *')).toBeInTheDocument()
        expect(screen.getByLabelText('Hình ảnh *')).toBeInTheDocument()
    })

    test('does not render when closed', () => {
        render(
            <AddCarouselItemDialog 
                open={false}
                onOpenChange={mockOnOpenChange}
                onAdd={mockOnAdd}
            />
        )

        expect(screen.queryByText('Thêm mục Carousel mới')).not.toBeInTheDocument()
    })

    test('adds item with valid data', async () => {
        render(
            <AddCarouselItemDialog 
                open={true}
                onOpenChange={mockOnOpenChange}
                onAdd={mockOnAdd}
            />
        )

        // Fill form
        fireEvent.change(screen.getByLabelText('Tiêu đề *'), {
            target: { value: 'New Item' }
        })
        fireEvent.change(screen.getByPlaceholderText('https://example.com/image.jpg'), {
            target: { value: 'https://example.com/new-image.jpg' }
        })

        // Submit
        fireEvent.click(screen.getByText('Thêm mục'))

        await waitFor(() => {
            expect(mockOnAdd).toHaveBeenCalledWith({
                title: 'New Item',
                detail: '',
                imageCover: 'https://example.com/new-image.jpg',
                tab: ''
            })
        })
    })

    test('shows validation error for missing required fields', () => {
        render(
            <AddCarouselItemDialog 
                open={true}
                onOpenChange={mockOnOpenChange}
                onAdd={mockOnAdd}
            />
        )

        // Try to submit without filling required fields
        fireEvent.click(screen.getByText('Thêm mục'))

        // Should not call onAdd due to validation
        expect(mockOnAdd).not.toHaveBeenCalled()
    })
})
