'use client';

import { ReactElement, useState } from "react";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  useDishes,
  useCreateDish,
  useUpdateDish,
  useToggleDishState,
  useDishesPaginated,
} from "@/app/helpers/hooks/useDishes";
import { DishCard } from "../../molecules/DishCard/DishCard";
import { Dish } from "@/app/models";
import { DishesViewModel } from "./DishesView.model";
import { DishEditModal } from "../DishEditModal/DishEditModal";
import { DishCreateModal } from "../DishCreateModal/DishCreateModal";
import { toast } from "react-toastify";
import { Pagination } from "../../molecules";

export const DishesView = ({
  selectedRestaurant,
}: DishesViewModel): ReactElement => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [page, setPage] = useState(0);
  const pageSize = 6;

  const { data, isLoading, isError } = useDishesPaginated(
    selectedRestaurant.id,
    token,
    page,
    pageSize
  );

  const dishes: Dish[] = Array.isArray(data) ? data : data?.dishes || [];
  const totalPages = data?.totalPages ?? 0;

  const createDishMutation = useCreateDish(selectedRestaurant.id);
  const updateDishMutation = useUpdateDish(selectedRestaurant.id);
  const toggleDishStateMutation = useToggleDishState(selectedRestaurant.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleCreateDish = () => setShowCreateModal(true);

  const handleEdit = (id: number) => {
    const dish = dishes.find((d) => d.id === id) || null;
    setSelectedDish(dish);
    setShowEditModal(true);
  };

  const handleCreate = async (dishData: Partial<Dish>) => {    
    try {
      await createDishMutation.mutateAsync({
        id: 0,
        name: dishData.name!,
        description: dishData.description!,
        price: dishData.price!,
        categoryId: dishData.category ?? 0,
        imageUrl: dishData.imageUrl!,
        active: dishData.active ?? true,
        restaurantId: selectedRestaurant.id,
      });
      toast.success("Plato creado correctamente");
      setShowCreateModal(false);
    } catch (error) {
      toast.error("Error al crear el plato");
      console.error(error);
    }
  };

  const handleSaveEdit = async (dishData: Partial<Dish>) => {
    if (!selectedDish) return;
    try {
      await updateDishMutation.mutateAsync({
        id: selectedDish.id,
        data: {
          description: dishData.description ?? selectedDish.description,
          price: dishData.price ?? selectedDish.price,
        },
      });
      toast.success("Plato actualizado correctamente");
      setShowEditModal(false);
    } catch (error) {
      toast.error("Error al actualizar el plato");
      console.error(error);
    }
  };

  const handleToggleActive = async (id: number) => {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;

    try {
      await toggleDishStateMutation.mutateAsync({
        id,
        state: !dish.active,
      });
      toast.success(
        `Plato ${dish.active ? "desactivado" : "activado"} correctamente`
      );
    } catch (error) {
      toast.error("Error al cambiar el estado del plato");
      console.error(error);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Cargando platos...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error al cargar platos.</p>;

  return (
    <div className="space-y-6">
      {selectedRestaurant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium">
            Gestionando platos de:{" "}
            <span className="font-bold">{selectedRestaurant.name}</span>
          </p>
        </div>
      )}

      <button
        onClick={handleCreateDish}
        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Crear Nuevo Plato
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
      
      
        <Pagination
          page={page}
          hasNext={page < totalPages - 1}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />      
      
      <DishCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      <DishEditModal
        isOpen={showEditModal}
        dish={selectedDish}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
