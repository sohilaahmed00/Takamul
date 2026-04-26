import { FormProvider } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/authStore";
import { useAddProduct } from "@/features/products/hooks/useAddProduct";
import { DirectProductForm } from "@/features/products/forms/DirectProductForm";
import { BranchedProductForm } from "@/features/products/forms/BranchedProductForm";
import { RawMaterialForm } from "@/features/products/forms/RawMaterialForm";
import { PreparedProductForm } from "@/features/products/forms/PreparedProductForm";
import { ProductType } from "@/features/products/types/products.types";

export default function AddProduct() {
  const { t } = useLanguage();
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

  const { productType, setProductType, isEditMode, isLoading, methods, summary, taxesData, mainCategories, productsDirect, productRawMatrial, units, navigate, onSubmit } = useAddProduct();

  const sharedFormProps = { taxesData, mainCategories, units, summary };

  return (
    <Card>
      <CardHeader className="max-md:flex max-md:flex-col">
        <CardTitle>{isEditMode ? "تعديل صنف" : "إضافة صنف جديد"}</CardTitle>
        <CardDescription>يمكنك إضافة صنف جديد بشكل دوري</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Product type tabs */}
        <Tabs value={productType} onValueChange={(val) => setProductType(val as ProductType)} className="w-full rounded-sm">
          <TabsList className="mb-8 w-full! h-fit!">
            {hasAnyPermission(["المنتجات.إضافة مباشرة", "المنتجات.إضافة"]) && (
              <TabsTrigger className="py-2!" value="Direct">
                الصنف المباشر
              </TabsTrigger>
            )}
            {hasAnyPermission(["المنتجات.إضافة متفرعة", "المنتجات.إضافة"]) && (
              <TabsTrigger className="py-2!" value="Branched">
                الصنف المتفرع
              </TabsTrigger>
            )}
            {hasAnyPermission(["المنتجات.إضافة جاهزة", "المنتجات.إضافة"]) && (
              <TabsTrigger className="py-2!" value="Prepared">
                الصنف المجهز
              </TabsTrigger>
            )}
            {hasAnyPermission(["المنتجات.إضافة مواد خام", "المنتجات.إضافة"]) && (
              <TabsTrigger className="py-2!" value="RawMatrial">
                الخامة
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, (errors) => {
              console.log("Form Errors:", errors);
            })}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {productType === "Direct" && <DirectProductForm {...sharedFormProps} />}

              {productType === "Branched" && <BranchedProductForm mainCategories={mainCategories} productsDirect={productsDirect} />}

              {productType === "Prepared" && <PreparedProductForm {...sharedFormProps} productRawMatrial={productRawMatrial} />}

              {productType === "RawMatrial" && <RawMaterialForm units={units} />}
            </div>

            <div className="flex flex-col-reverse lg:flex-row justify-between py-4 border px-3 gap-3 rounded border-gray-100">
              <Button size="lg" variant="destructive" type="button" className="w-full lg:w-auto px-8 h-12" onClick={() => navigate("/products")}>
                إلغاء
              </Button>
              <div className="flex flex-col-reverse lg:flex-row items-center gap-3 w-full lg:w-auto">
                <Button loading={isLoading} size="lg" type="submit" className="w-full lg:w-auto px-8 h-12 text-base">
                  حفظ البيانات
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
