import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { movementService } from '@/services/movementService';
import { formatDateTime, formatCurrency } from '@/lib/utils';

const movementTypeLabels = {
  IN: 'Entrada',
  OUT: 'Saída',
  ADJUSTMENT: 'Ajuste',
  RETURN: 'Devolução',
  LOSS: 'Perda',
  TRANSFER: 'Transferência',
};

const movementTypeColors = {
  IN: 'success',
  OUT: 'destructive',
  ADJUSTMENT: 'warning',
  RETURN: 'success',
  LOSS: 'destructive',
  TRANSFER: 'secondary',
};

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadMovements();
  }, [page]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const response = await movementService.getAll({ page, limit: 20 });
      setMovements(response.movements);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading movements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações</h1>
          <p className="text-muted-foreground">
            Histórico de entradas e saídas de produtos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      {/* Movements List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium">Produto</th>
                  <th className="text-center py-3 px-4 font-medium">Tipo</th>
                  <th className="text-right py-3 px-4 font-medium">Quantidade</th>
                  <th className="text-right py-3 px-4 font-medium">Valor Unit.</th>
                  <th className="text-right py-3 px-4 font-medium">Valor Total</th>
                  <th className="text-left py-3 px-4 font-medium">Usuário</th>
                  <th className="text-left py-3 px-4 font-medium">Observação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-muted-foreground">
                      Nenhuma movimentação registrada
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {formatDateTime(movement.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{movement.product?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {movement.product?.code}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={movementTypeColors[movement.type]}>
                          {movementTypeLabels[movement.type]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {movement.type === 'IN' || movement.type === 'RETURN' ? '+' : '-'}
                        {movement.quantity} {movement.product?.unit}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {movement.unitPrice ? formatCurrency(movement.unitPrice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {movement.totalPrice ? formatCurrency(movement.totalPrice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {movement.user?.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {movement.observation || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Página {pagination.page} de {pagination.pages} ({pagination.total} movimentações)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
