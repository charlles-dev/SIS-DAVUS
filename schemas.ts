import { z } from 'zod';
import { AssetStatus, MaintenanceStatus } from './types';

export const assetSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  brand: z.string().min(2, "Marca é obrigatória"),
  asset_tag: z.string().min(3, "Tag do ativo é obrigatória"),
  location_id: z.string().min(1, "Localização é obrigatória"),
  status: z.nativeEnum(AssetStatus),
  purchase_value: z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, "Valor inválido"),
  image: z.any().optional(), 
});

export const maintenanceSchema = z.object({
  asset_id: z.string().min(1, "Selecione um ativo"),
  vendor: z.string().min(3, "Fornecedor obrigatório"),
  description: z.string().min(10, "Descreva o problema com detalhes"),
  cost: z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, "Custo inválido"),
  status: z.nativeEnum(MaintenanceStatus).optional(),
});

export const checkoutSchema = z.object({
  asset_id: z.string().min(1, "Selecione um ativo"),
  worker_name: z.string().min(3, "Nome do funcionário obrigatório"),
  expected_return: z.string().min(1, "Data prevista é obrigatória"),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
