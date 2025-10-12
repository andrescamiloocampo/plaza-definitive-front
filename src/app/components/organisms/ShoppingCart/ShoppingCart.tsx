"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useOrderStore } from "@/app/store/OrderStore";
import { useCreateOrder } from "@/app/hooks/useOrders";

export const Cart = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const {
    items,
    restaurant,
    removeItem,
    updateQuantity,
    clearOrder,
    getTotal,
    getTotalItems,
    getOrderPayload,
  } = useOrderStore();

  const { mutateAsync: createOrder, isPending: isSubmitting } = useCreateOrder(token!);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(dishId);
      toast.info("Producto eliminado del carrito");
    } else {
      updateQuantity(dishId, newQuantity);
    }
  };

  const handleSubmitOrder = async () => {
  // 🧾 Validaciones previas
  if (!token) {
    toast.error("Debes iniciar sesión para hacer un pedido");
    router.push("/login");
    return;
  }

  if (!restaurant) {
    toast.error("No se ha seleccionado un restaurante");
    return;
  }

  const payload = getOrderPayload();

  if (!payload || items.length === 0) {
    toast.warning("Tu carrito está vacío");
    return;
  }

  try {
    console.log("Payload a enviar:", payload);
    
    await createOrder(payload);

    toast.success("¡Orden creada exitosamente!");
    clearOrder();
    router.push("/dashboard");

  } catch (error: any) {
    console.error("Error al crear la orden:", error);    
    if (error.message?.includes("orden activa")) {
      toast.warning("Ya tienes una orden activa. Finalízala antes de crear una nueva.");
    } else if (error.message?.includes("No autorizado")) {
      toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");
      router.push("/login");
    } else {
      toast.error("Ocurrió un error al crear la orden");
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">        
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Volver</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
          {restaurant && (
            <p className="text-gray-600 mt-2">
              Ordenando de:{" "}
              <span className="font-semibold">{restaurant.name}</span>
            </p>
          )}
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              Agrega algunos platos para comenzar tu orden
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Explorar Restaurantes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.category.name}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.info("Producto eliminado del carrito");
                        }}
                        className="text-red-500 hover:text-red-700 transition p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} c/u
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  clearOrder();
                  toast.info("Carrito vaciado");
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Vaciar Carrito
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Resumen de Orden
                </h2>

                {restaurant && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-1">Restaurante</p>
                    <p className="font-semibold text-gray-900">
                      {restaurant.name}
                    </p>
                    <p className="text-sm text-gray-500">{restaurant.address}</p>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Items ({getTotalItems()})</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Domicilio</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Confirmar Orden
                    </>
                  )}
                </button>

                {restaurant && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Tu orden será preparada y enviada por{" "}
                      <span className="font-semibold">{restaurant.name}</span>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
