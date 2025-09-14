import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Package, CirclePlusIcon, ChartBarDecreasing, Trash2Icon } from 'lucide-react';
import ImageUpload from './components/image-upload';
import DialogAddSku from './components/DialogAddSku';
import { ProductAdd } from './types';
import { ProductAttribute } from './types/enum';
import { fetchCategoriesAPIs } from '@/apis/category.apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Effect, Taste } from '../attribute/types';
import { fetchEffect, fetchTaste } from '@/apis/attribute.apis';
import TasteSelector from './components/DialogAddTaste';
import EffectSelector from './components/DialogAddEffect';
import DialogAddStep from './components/DialogAddStep';
import InputNumber from '@/components/InputNumber';
import { createNewProductAPIs } from '@/apis/product.apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { fetchTeaCategoryAPIs } from '@/apis/tea.category.apis';

export default function AddProduct() {
    const [product, setProduct] = useState<ProductAdd>({
        product_name: "",
        product_description: "",
        product_thumb: "",
        product_cover: "",
        product_basePrice: 0,
        product_images: [],
        product_brewing: [],
        product_attribute: [],
        tastes: [],
        effects: [],
        product_category: "",
        product_tea_category: [],
        isPublished: false
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [teaCategories, setTeaCategories] = useState<TeaCategory[]>([]);
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [effects, setEffects] = useState<Effect[]>([]);
    const [openAddSKU, setOpenAddSKU] = useState(false)
    const [openAddStep, setOpenAddStep] = useState(false)
    const navigate = useNavigate();

    // Helper function to check if a category is tea-related
    const isTeaCategory = (categoryName: string) => {
        const teaKeywords = ['trà', 'tea', 'chè', 'bạch trà', 'lục trà', 'hồng trà', 'ô long', 'oolong', 'trà xanh', 'trà đen'];
        return teaKeywords.some(keyword =>
            categoryName.toLowerCase().includes(keyword.toLowerCase())
        );
    };

    // Get selected category name
    const selectedCategory = categories.find(cat => cat._id === product.product_category);
    const isSelectedCategoryTea = selectedCategory ? isTeaCategory(selectedCategory.category_name) : false;

    useEffect(() => {
        fetchCategoriesAPIs().then(res => {
            setCategories(res.data)
        })
        fetchTaste().then(res => {
            setTastes(res.data)
        })
        fetchEffect().then(res => {
            setEffects(res.data)
        })
        fetchTeaCategoryAPIs().then(res => {
            setTeaCategories(res.data)
        })
    }, [])


    const handleSubmit = () => {
        // Check if tea category is required but not selected
        if (isSelectedCategoryTea && !product.product_tea_category) {
            alert("Vui lòng chọn loại trà cho sản phẩm!")
            return;
        }

        if (product.product_name === "" || product.product_description === "" || product.product_images.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin !")
        } else {
            console.log(product);

            createNewProductAPIs(product).then(res => {
                toast.success("Thêm sản phẩm mới thành công!")
                navigate("/products/list")
            })
        }
    }

    const handleDeleteAttribute = (item: any) => {
        const attributes = product.product_attribute.filter((attr: any) => attr !== item)
        setProduct(prev => ({ ...prev, product_attribute: attributes }))
    }


    return (
        <div className="min-h-screen bg-gradient-to-br  p-4 sm:p-6 lg:p-8 lg:pt-3">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 ">
                        <h1 className="text-3xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Product Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card className="shadow-lg border-0 colorDashboard">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <div className="p-1 bg-blue-100 rounded">
                                        <Package className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Thông Tin Cơ Bản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_name" className="text-sm font-medium">Tên Sản Phẩm
                                            <span className='text-red-500 text-sm'>*</span>
                                        </Label>
                                        <Input
                                            id="product_name"
                                            value={product.product_name}
                                            onChange={(e) => setProduct(prev => ({ ...prev, product_name: e.target.value }))}
                                            placeholder="Nhập tên sản phẩm"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="product_basePrint" className="text-sm font-medium">Giá cơ bản</Label>
                                        <InputNumber
                                            value={product.product_basePrice}
                                            onChange={(e) => setProduct(prev => ({ ...prev, product_basePrice: e }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product_description" className="text-sm font-medium">Mô Tả
                                        <span className='text-red-500 text-sm'>*</span>
                                    </Label>
                                    <Textarea
                                        id="product_description"
                                        value={product.product_description}
                                        onChange={(e) => setProduct(prev => ({ ...prev, product_description: e.target.value }))}
                                        placeholder="Nhập mô tả sản phẩm..."
                                        rows={4}
                                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <ImageUpload product={product} setProduct={setProduct} />
                                <div className='flex items-center justify-between'>
                                    <div className='text-5sm font-bold mb-2'>
                                        Bao bì
                                    </div>
                                    <Button className="text-sm mb-2" size='sm' onClick={() => setOpenAddSKU(true)}>
                                        <CirclePlusIcon className='w-4 h-4' />
                                        Thêm bao bì
                                    </Button>
                                </div>
                                {
                                    product.product_attribute.length > 0 && (
                                        <div className="grid grid-cols-2">
                                            {product.product_attribute.map((item, index) => (
                                                <div key={index} className="flex gap-4 mt-2">
                                                    <div className='flex gap-4 items-center '>
                                                        {item.name === ProductAttribute.BOX ? (
                                                            <img src="/icon/box.png" alt="" className="w-8 h-8" />
                                                        ) : (
                                                            <div className="relative w-8 h-8 flex items-center justify-center">
                                                                <img src="/icon/bag.png" alt="" className="w-8 h-8" />
                                                                <Badge className="absolute inset-0 flex items-center hover:bg-transparent font-bold justify-center bg-transparent text-black text-[7px]">
                                                                    {item.unit}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-red-500">
                                                            {
                                                                item.price.toLocaleString()
                                                            } VND
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ">
                                                        <Button size='sm' className='bg-transparent hover:bg-transparent text-red-500' onClick={() => handleDeleteAttribute(item)}>
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }

                                <DialogAddSku open={openAddSKU} setOpen={setOpenAddSKU} product={product} setProduct={setProduct} />

                            </CardContent>
                        </Card>
                        <Card className="shadow-lg border-0 colorDashboard">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                    <div className="flex">
                                        <div className="p-1 bg-blue-100 rounded">
                                            <ChartBarDecreasing className="h-4 w-4 " />
                                        </div>
                                        Cách pha trà:
                                    </div>
                                    <Button size='sm' onClick={() => setOpenAddStep(true)}>
                                        Tạo các bước
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DialogAddStep
                                    open={openAddStep}
                                    setOpen={setOpenAddStep}
                                    setProduct={setProduct}
                                    product={product}
                                />

                                {product.product_brewing.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {product.product_brewing.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-white shadow-sm"
                                            >
                                                <div className="flex gap-5">
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                                                        {index + 1}
                                                    </div>

                                                    <div className="flex-1 text-sm text-gray-700">
                                                        {item}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <Trash2Icon
                                                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-600"
                                                        onClick={() => {
                                                            const updatedSteps = product.product_brewing.filter(
                                                                (_, i) => i !== index
                                                            );
                                                            setProduct(prev => ({ ...prev, product_brewing: updatedSteps }))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </CardContent>

                        </Card>

                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Danh Mục</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm font-bold"> Thể loại</div>
                                <Select value={product.product_category} onValueChange={(e) => {
                                    setProduct(prev => ({ ...prev, product_category: e, product_tea_category: [] }))
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thể loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((item, index) => (
                                            <SelectItem key={index} value={item._id}>{item.category_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>


                                {product.product_category ? (isSelectedCategoryTea ? (
                                    <div className="space-y-3">
                                        <div className="text-sm font-bold">Loại trà</div>
                                        <div className="space-y-2 grid grid-cols-2 ">
                                            {teaCategories.map((teaCat) => (
                                                <div key={teaCat._id} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id={`tea-category-${teaCat._id}`}
                                                        name="tea-category"
                                                        value={teaCat._id}
                                                        checked={product.product_tea_category.includes(teaCat._id)}
                                                        onChange={(e) => setProduct(prev => ({ ...prev, product_tea_category: [e.target.value] }))}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <label
                                                        htmlFor={`tea-category-${teaCat._id}`}
                                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                                    >
                                                        {teaCat.tea_category_name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : <div className="space-y-3">
                                    <div className="text-sm font-bold">Loại trà</div>
                                    <div className="space-y-2 grid grid-cols-2">
                                        {teaCategories.map((teaCat) => (
                                            <div key={teaCat._id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`tea-category-${teaCat._id}`}
                                                    name="tea-category"
                                                    value={teaCat._id}
                                                    checked={product.product_tea_category.includes(teaCat._id)}
                                                    onChange={(e) => {
                                                        if (product.product_tea_category.includes(teaCat._id)) {
                                                            setProduct(prev => ({ ...prev, product_tea_category: prev.product_tea_category.filter((cat) => cat !== teaCat._id) }))
                                                            return;
                                                        }
                                                        setProduct(prev => ({ ...prev, product_tea_category: [...prev.product_tea_category, e.target.value] }))
                                                    }}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`tea-category-${teaCat._id}`}
                                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                                >
                                                    {teaCat.tea_category_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                ) : null
                                }
                            </CardContent>
                            <CardContent className="space-y-3">
                                <div className="text-sm font-bold"> Trạng thái</div>
                                <Select value={product.isPublished.toString()} onValueChange={(e) =>
                                    setProduct(prev => ({ ...prev, isPublished: e === "true" }))
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>

                                        <SelectItem value={"true"}>Có</SelectItem>
                                        <SelectItem value={"false"}>Không</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>

                            <div className='grid grid-cols-2'>
                                <CardContent className="space-y-3">
                                    <TasteSelector tastes={tastes} onSelect={(tastes) => setProduct(prev => ({ ...prev, tastes: tastes.map((t) => t._id) }))} />
                                    <div>
                                        {product.tastes.length > 0 && <h2 className="font-bold">Hương vị:</h2>}
                                        <ul className="list-disc ml-6">
                                            {product.tastes.map((t) => (
                                                <li key={t}>{tastes.find((taste) => taste._id === t)?.taste_name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardContent className="space-y-3">
                                    <EffectSelector effects={effects} onSelect={(effects) => setProduct(prev => ({ ...prev, effects: effects }))} />
                                    <div>
                                        {product.effects.length > 0 && <h2 className="font-bold">Tác dụng :</h2>}
                                        <ul className="list-disc ml-6">
                                            {product.effects.map((t) => (
                                                <li key={t}>{effects.find((effect) => effect._id === t)?.effect_name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>

                        {/* Actions */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                            <CardContent className="pt-6 space-y-3">
                                <Button
                                    onClick={() => handleSubmit()}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5">
                                    Lưu sản phẩm
                                </Button>
                                <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                                    Hủy bỏ
                                </Button>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >

    );
}