
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Wrench, HardHat, FileText, Printer, QrCode } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/UI';
import { AssetService } from '@/api/services';
import { Asset } from '@/types/types';

export const AssetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (assetId: string) => {
    setLoading(true);
    const [a, h] = await Promise.all([
      AssetService.getAssetById(assetId),
      AssetService.getAssetHistory(assetId)
    ]);
    if (a) setAsset(a);
    setHistory(h);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Carregando informações do ativo...</div>;
  if (!asset) return <div className="p-8 text-center">Ativo não encontrado. <Button variant="link" onClick={() => navigate('/app/assets')}>Voltar</Button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/assets')}>
          <ArrowLeft size={20} className="dark:text-gray-200" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-davus-dark dark:text-white flex items-center gap-3">
            {asset.name}
            <Badge variant="outline" className="text-sm font-mono">{asset.asset_tag}</Badge>
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Hub de Gerenciamento do Patrimônio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Info & Actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="bg-gray-100 dark:bg-gray-800 h-48 flex items-center justify-center rounded-t-lg">
                {asset.image ? (
                  <img src={asset.image} alt={asset.name} className="h-full object-cover" />
                ) : (
                  <Wrench size={48} className="text-gray-300" />
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Status</span>
                  <Badge variant={asset.status === 'AVAILABLE' ? 'success' : 'warning'}>{asset.status}</Badge>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Marca</span>
                  <span className="font-medium dark:text-gray-200">{asset.brand}</span>
                </div>
                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Local Atual</span>
                  <span className="font-medium flex items-center gap-1 dark:text-gray-200"><MapPin size={14} /> {asset.location_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Valor Compra</span>
                  <span className="font-medium dark:text-gray-200">
                    {asset.purchase_value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ações Rápidas</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex flex-col h-20 gap-2 hover:bg-davus-primary/5 hover:border-davus-primary">
                <MapPin size={20} /> Transferir
              </Button>
              <Button variant="outline" className="flex flex-col h-20 gap-2 hover:bg-davus-primary/5 hover:border-davus-primary">
                <HardHat size={20} /> Cautela
              </Button>
              <Button variant="outline" className="flex flex-col h-20 gap-2 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600">
                <Wrench size={20} /> Manutenção
              </Button>
              <Button variant="outline" className="flex flex-col h-20 gap-2 hover:bg-davus-primary/5 hover:border-davus-primary">
                <Printer size={20} /> Etiqueta
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Timeline & Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Data Aquisição</p>
                  <p className="font-bold text-davus-dark dark:text-gray-100">15/09/2023</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <QrCode size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Etiqueta</p>
                  <p className="font-bold text-davus-dark dark:text-gray-100">Ativa</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 pl-6 py-2">
                {history.map((h, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-davus-primary border-2 border-white dark:border-gray-800" />
                    <p className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('pt-BR')}</p>
                    <h4 className="text-sm font-bold text-davus-dark dark:text-gray-100">{h.action}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{h.details}</p>
                  </div>
                ))}
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                  <p className="text-xs text-gray-400">--/--/----</p>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">Cadastro Inicial</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
