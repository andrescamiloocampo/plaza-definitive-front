"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getDishesByRestaurantId } from "@/app/datasources";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "@/app/store/OrderStore";
import { CartButton, ConflictModal } from "@/app/components/molecules";
import { AlertLabel } from "@/app/components/atoms";

interface DishCategory {
  name: string;
}

interface DishModel {
  id: number;
  name: string;
  category: DishCategory;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  restaurantId: number;
}

interface RestaurantMenuProps {
  params: Promise<{
    id: number;
  }>;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
}

export default function RestaurantMenu({
  restaurantAddress,
  restaurantPhone,
  params,
}: RestaurantMenuProps) {
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get("name") || "Restaurante sin nombre";
  const { data: session } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const { id } = React.use(params);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingDish, setPendingDish] = useState<DishModel | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const page = 0;
  const size = 20;

  const { restaurant, addItem, clearOrder, canAddFromRestaurant } = useOrderStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dishes", id, page],
    queryFn: async () => await getDishesByRestaurantId(id, page, size, token),
    enabled: !!token,
  });

  const dishes: DishModel[] = data || [];
  const categories = ["Todos", ...new Set(dishes.map((dish) => dish.category.name))];

  const filteredDishes =
    selectedCategory === "Todos"
      ? dishes
      : dishes.filter((dish) => dish.category.name === selectedCategory);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = (dish: DishModel) => {
    const restaurantInfo = {
      id,
      name: restaurantName,
      address: restaurantAddress,
      phone: restaurantPhone,
    };

    if (!canAddFromRestaurant(id)) {
      setPendingDish(dish);
      setShowConflictModal(true);
      return;
    }

    addItem(dish, restaurantInfo);
  };

  const handleClearAndAdd = () => {
    if (pendingDish) {
      clearOrder();

      const restaurantInfo = {
        id,
        name: restaurantName,
        address: restaurantAddress,
        phone: restaurantPhone,
      };

      addItem(pendingDish, restaurantInfo);
      setShowConflictModal(false);
      setPendingDish(null);
    }
  };

  const handleCancelConflict = () => {
    setShowConflictModal(false);
    setPendingDish(null);
  };

  const goBack = () => {
    router.push("/dashboard");
  };

  // Detecta el scroll para aplicar el efecto glass
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">      
      <div
        className={`sticky top-[80px] z-20 backdrop-blur-md bg-white/70 transition-all duration-300 ${
          isScrolled ? "shadow-md bg-white/80" : "shadow-sm bg-white/60"
        }`}
      >
        {/* Header principal */}
        <div className="max-w-6xl mx-auto px-4 py-4 border-b border-white/30">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Volver</span>
            </button>

            <CartButton />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{restaurantName}</h1>
            <p className="text-gray-600 text-sm mt-1">{restaurantAddress}</p>
            <AlertLabel
              show={!!restaurant && restaurant.id !== id}
              restaurantName={restaurant?.name}
            />
          </div>
        </div>

        {/* Categorías */}
        {!isLoading && !error && dishes.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error al cargar el menú</p>
              <p className="text-red-600 text-sm mt-1">
                No se pudo cargar el menú. Por favor intenta nuevamente.
              </p>
              <button
                onClick={() => refetch()}
                className="text-red-700 underline text-sm mt-2 hover:text-red-800"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && dishes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay platos disponibles
            </h3>
            <p className="text-gray-600">
              Este restaurante aún no ha agregado platos a su menú.
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredDishes.length === 0 &&
          dishes.length > 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay platos en esta categoría
              </h3>
              <p className="text-gray-600">Intenta seleccionar otra categoría.</p>
            </div>
          )}
        
        {!isLoading && !error && filteredDishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    {dish.category.name}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {dish.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-purple-600">
                      {formatPrice(dish.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(dish)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConflictModal && (
        <ConflictModal
          currentRestaurant={restaurant?.name}
          newRestaurant={restaurantName}
          onCancel={handleCancelConflict}
          onConfirm={handleClearAndAdd}
        />
      )}
    </div>
  );
}
