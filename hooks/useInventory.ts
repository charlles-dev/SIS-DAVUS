import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryService } from '../services';
import { Product, StockMovement, UnitType } from '../types';
import { toast } from 'sonner';

export const useInventory = () => {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: InventoryService.getProducts,
    });

    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: InventoryService.getCategories,
    });

    const createProductMutation = useMutation({
        mutationFn: InventoryService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Produto criado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao criar produto');
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: InventoryService.updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Produto atualizado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao atualizar produto');
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: InventoryService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Produto excluído com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao excluir produto');
        }
    });

    const createMovementMutation = useMutation({
        mutationFn: ({ productId, type, quantity, notes }: { productId: string, type: 'IN' | 'OUT', quantity: number, notes: string }) =>
            InventoryService.createMovement(productId, type, quantity, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Movimentação registrada com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao registrar movimentação');
        }
    });

    const getProductMovements = async (productId: string) => {
        return InventoryService.getProductMovements(productId);
    };

    return {
        products: productsQuery.data || [],
        categories: categoriesQuery.data || [],
        isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
        isError: productsQuery.isError || categoriesQuery.isError,
        createProduct: createProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        deleteProduct: deleteProductMutation.mutateAsync,
        createMovement: createMovementMutation.mutateAsync,
        getProductMovements,
        isSubmitting: createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending || createMovementMutation.isPending
    };
};
