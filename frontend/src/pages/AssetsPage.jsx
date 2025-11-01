import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

const statusLabels = {
  ACTIVE: 'Ativo',
  MAINTENANCE: 'Manutenção',
  INACTIVE: 'Inativo',
  DISPOSED: 'Descartado',
};

const statusColors = {
  ACTIVE: 'success',
  MAINTENANCE: 'warning',
  INACTIVE: 'secondary',
  DISPOSED: 'destructive',
};

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/assets');
      setAssets(response.data.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patrimônio</h1>
          <p className="text-muted-foreground">
            Gerencie os bens patrimoniais da empresa
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Patrimônio
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        ) : assets.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum patrimônio cadastrado
          </div>
        ) : (
          assets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">
                      {asset.code}
                    </p>
                  </div>
                  <Badge variant={statusColors[asset.status]}>
                    {statusLabels[asset.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {asset.description && (
                    <p className="text-muted-foreground">{asset.description}</p>
                  )}
                  
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Atual:</span>
                      <span className="font-semibold">
                        {formatCurrency(asset.currentValue || 0)}
                      </span>
                    </div>
                    
                    {asset.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Localização:</span>
                        <span>{asset.location}</span>
                      </div>
                    )}
                    
                    {asset.responsible && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Responsável:</span>
                        <span>{asset.responsible}</span>
                      </div>
                    )}
                    
                    {asset.purchaseDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Compra:</span>
                        <span>{formatDate(asset.purchaseDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
