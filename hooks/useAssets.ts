import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetService } from '../services';
import { Asset, AssetFormValues } from '../types';
import { toast } from 'sonner';

export const useAssets = () => {
    const queryClient = useQueryClient();

    const assetsQuery = useQuery({
        queryKey: ['assets'],
        queryFn: AssetService.getAssets,
    });

    const locationsQuery = useQuery({
        queryKey: ['locations'],
        queryFn: AssetService.getLocations,
    });

    const createAssetMutation = useMutation({
        mutationFn: AssetService.createAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Ativo criado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao criar ativo');
        }
    });

    const transferAssetMutation = useMutation({
        mutationFn: ({ assetId, locationId }: { assetId: string, locationId: string }) =>
            AssetService.transferAsset(assetId, locationId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            // We can fetch the location name here if needed, or just show ID for now
            toast.success(`Ativo transferido com sucesso!`);
        },
        onError: () => {
            toast.error('Erro ao transferir ativo');
        }
    });

    return {
        assets: assetsQuery.data || [],
        locations: locationsQuery.data || [],
        isLoading: assetsQuery.isLoading || locationsQuery.isLoading,
        isError: assetsQuery.isError || locationsQuery.isError,
        createAsset: createAssetMutation.mutateAsync,
        transferAsset: transferAssetMutation.mutateAsync,
        isSubmitting: createAssetMutation.isPending || transferAssetMutation.isPending
    };
};
