import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    BarChart3,
    ShieldCheck,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { DavusLogo } from '../components/UI';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Package className="w-6 h-6 text-davus-primary" />,
            title: "Controle de Estoque",
            description: "Gerencie entradas, saídas e níveis de estoque em tempo real com facilidade."
        },
        {
            icon: <ClipboardList className="w-6 h-6 text-davus-primary" />,
            title: "Gestão de Ativos",
            description: "Rastreamento completo de ativos, manutenções e histórico de movimentações."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-davus-primary" />,
            title: "Relatórios Detalhados",
            description: "Insights valiosos para tomada de decisão com relatórios personalizáveis."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-davus-primary" />,
            title: "Segurança e Auditoria",
            description: "Controle de acesso granular e registro de todas as atividades do sistema."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <DavusLogo className="h-16 w-auto" />
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-white dark:bg-gray-800 text-davus-primary font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-davus-primary"
                >
                    Área do Cliente
                </button>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-12 md:mb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                            Gestão Inteligente para <br />
                            <span className="text-davus-primary">Engenharia Moderna</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Otimize seus processos, controle seus recursos e eleve a produtividade da sua equipe com a solução completa SIS-DAVUS.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-davus-primary text-white font-bold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                Acessar Sistema
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-full hover:border-davus-primary hover:text-davus-primary transition-all duration-300">
                                Saiba Mais
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Alta Disponibilidade
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Suporte 24/7
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="md:w-1/2 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10"
                    >
                        {/* Abstract representation of the dashboard or a nice illustration */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs text-gray-400">SIS-DAVUS Dashboard</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <div className="text-davus-primary mb-2"><Package size={24} /></div>
                                    <div className="text-2xl font-bold">1,248</div>
                                    <div className="text-xs text-gray-500">Itens em Estoque</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                                    <div className="text-green-600 mb-2"><LayoutDashboard size={24} /></div>
                                    <div className="text-2xl font-bold">98%</div>
                                    <div className="text-xs text-gray-500">Eficiência Operacional</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-3/4"></div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-5/6"></div>
                            </div>
                        </div>
                    </motion.div>
                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-davus-primary/10 blur-3xl rounded-full -z-10"></div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos Poderosos</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Tudo o que você precisa para gerenciar sua engenharia em um só lugar.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-gray-800 dark:text-white">SIS-DAVUS</span>
                        <p className="text-sm text-gray-500 mt-1">© 2025 Davus Engenharia. Todos os direitos reservados.</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-davus-primary transition-colors">Termos</a>
                        <a href="#" className="text-gray-500 hover:text-davus-primary transition-colors">Privacidade</a>
                        <a href="#" className="text-gray-500 hover:text-davus-primary transition-colors">Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
