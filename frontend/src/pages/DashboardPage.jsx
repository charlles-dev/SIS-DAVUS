import { useEffect, useState } from 'react';
import { Package, TrendingDown, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardService } from '@/services/dashboardService';
import { formatCurrency, formatDateTime } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, description, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

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

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await dashboardService.getOverview();
      setData(response);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de controle de estoque e patrimônio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Produtos"
          value={data?.products.total || 0}
          icon={Package}
          description={`${data?.products.active || 0} ativos`}
        />
        <StatCard
          title="Estoque Baixo"
          value={data?.products.lowStock || 0}
          icon={TrendingDown}
          description="Produtos abaixo do mínimo"
        />
        <StatCard
          title="Sem Estoque"
          value={data?.products.outOfStock || 0}
          icon={AlertTriangle}
          description="Produtos zerados"
        />
        <StatCard
          title="Patrimônio"
          value={formatCurrency(data?.assets.totalValue || 0)}
          icon={Building2}
          description={`${data?.assets.total || 0} itens`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentMovements?.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{movement.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {movement.user?.name} • {formatDateTime(movement.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{movement.quantity}</span>
                    <Badge variant={movementTypeColors[movement.type]}>
                      {movementTypeLabels[movement.type]}
                    </Badge>
                  </div>
                </div>
              ))}
              {!data?.recentMovements?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma movimentação registrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.lowStockProducts?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Código: {product.code}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {product.current_stock} {product.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mín: {product.min_stock}
                    </p>
                  </div>
                </div>
              ))}
              {!data?.lowStockProducts?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todos os produtos com estoque adequado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
