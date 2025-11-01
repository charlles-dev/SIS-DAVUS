import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';

const statusLabels = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  DISCONTINUED: 'Descontinuado',
};

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  DISCONTINUED: 'destructive',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({ page, limit: 10, search });
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock === 0) {
      return { label: 'Sem estoque', color: 'destructive' };
    }
    if (product.currentStock <= product.minStock) {
      return { label: 'Estoque baixo', color: 'warning' };
    }
    return { label: 'Estoque OK', color: 'success' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos por nome, código ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Código</th>
                  <th className="text-left py-3 px-4 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 font-medium">Categoria</th>
                  <th className="text-right py-3 px-4 font-medium">Estoque</th>
                  <th className="text-right py-3 px-4 font-medium">Preço</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                  <th className="text-center py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-muted-foreground">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{product.code}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-xs">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {product.category?.name || '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div>
                            <p className="font-semibold">
                              {product.currentStock} {product.unit}
                            </p>
                            <Badge variant={stockStatus.color} className="text-xs">
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(product.costPrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={statusColors[product.status]}>
                            {statusLabels[product.status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm">
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Página {pagination.page} de {pagination.pages} ({pagination.total} produtos)
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
