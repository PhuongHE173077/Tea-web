import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Star, ImageIcon, Package, CirclePlusIcon, ChartBarDecreasing, DeleteIcon, Trash2Icon } from 'lucide-react';
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
import { fetchProductBySlug, updateProductAPIs } from '@/apis/product.apis';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProduct() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

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
        isPublished: false
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [effects, setEffects] = useState<Effect[]>([]);
    const [openAddSKU, setOpenAddSKU] = useState(false);
    const [openAddStep, setOpenAddStep] = useState(false);

    // Load dữ liệu ban đầu
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load categories, tastes, effects
                const [categoriesRes, tastesRes, effectsRes] = await Promise.all([
                    fetchCategoriesAPIs(),
                    fetchTaste(),
                    fetchEffect()
                ]);

                setCategories(categoriesRes.data);
                setTastes(tastesRes.data);
                setEffects(effectsRes.data);

                // Load product data nếu có slug
                if (slug) {
                    const productRes = await fetchProductBySlug(slug);
                    const productData = productRes.data;
                    setOriginalProduct(productData);

                    // Transform product data để phù hợp với ProductAdd interface
                    setProduct({
                        product_name: productData.product_name || "",
                        product_description: productData.product_description || "",
                        product_thumb: productData.product_thumb || "",
                        product_cover: productData.product_cover || "",
                        product_basePrice: productData.product_basePrice || 0,
                        product_images: productData.product_images || [],
                        product_brewing: productData.product_brewing || [],
                        product_attribute: (productData.product_attribute || []).map((attr: any) => ({
                            name: attr.name || "",
                            unit: attr.unit || "",
                            price: typeof attr.price === 'string' ? parseFloat(attr.price) : attr.price || 0,
                            image: attr.image || ""
                        })),
                        tastes: (productData as any).product_taste?.map((t: any) => t._id || t) || [],
                        effects: (productData as any).product_effects?.map((e: any) => e._id || e) || [],
                        product_category: typeof productData.product_category === 'object'
                            ? productData.product_category._id
                            : productData.product_category || "",
                        isPublished: productData.isPublished || false
                    });
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Có lỗi xảy ra khi tải dữ liệu!');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [slug]);

    const handleSubmit = async () => {
        if (product.product_name === "" || product.product_description === "" || product.product_images.length === 0) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (!originalProduct?._id) {
            toast.error("Không tìm thấy ID sản phẩm!");
            return;
        }

        try {
            // Transform data để gửi lên server
            const updateData = {
                ...product,
                product_taste: product.tastes,
                product_effects: product.effects
            };

            await updateProductAPIs(originalProduct._id, updateData);
            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/products/list");
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
        }
    };

    const handleDeleteAttribute = (item: any) => {
        const attributes = product.product_attribute.filter((attr: any) => attr !== item);
        setProduct(prev => ({ ...prev, product_attribute: attributes }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 lg:p-8 lg:pt-3">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Đang tải dữ liệu...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!originalProduct) {
        return (
            <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 lg:p-8 lg:pt-3">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-red-500">Không tìm thấy sản phẩm!</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 lg:p-8 lg:pt-3">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">Cập Nhật Sản Phẩm</h1>
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

                        {/* Brewing Steps Card */}
                        <Card className="shadow-lg border-0 colorDashboard">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                    <div className="flex">
                                        <div className="p-1 bg-blue-100 rounded">
                                            <ChartBarDecreasing className="h-4 w-4" />
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
                                                    <DeleteIcon
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

                    {/* Right Column - Categories and Actions */}
                    <div className="space-y-6">
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Danh Mục</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm font-bold">Thể loại</div>
                                <Select value={product.product_category} onValueChange={(e) => {
                                    setProduct(prev => ({ ...prev, product_category: e }))
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
                            </CardContent>
                            <CardContent className="space-y-3">
                                <div className="text-sm font-bold">Trạng thái</div>
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
                                    {product.effects.length > 0 && <h2 className="font-bold">Tác dụng:</h2>}
                                    <ul className="list-disc ml-6">
                                        {product.effects.map((t) => (
                                            <li key={t}>{effects.find((effect) => effect._id === t)?.effect_name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                            <CardContent className="pt-6 space-y-3">
                                <Button
                                    onClick={() => handleSubmit()}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5">
                                    Cập nhật sản phẩm
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-200 hover:bg-gray-50"
                                    onClick={() => navigate("/products/list")}
                                >
                                    Hủy bỏ
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
