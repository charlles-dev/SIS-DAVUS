import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x && x !== 'app');

    const breadcrumbNameMap: Record<string, string> = {
        dashboard: 'Dashboard',
        inventory: 'Estoque',
        movements: 'Movimentações',
        purchases: 'Compras',
        assets: 'Patrimônio',
        checkouts: 'Cautelas',
        locations: 'Locais',
        'bulk-print': 'Impressão',
        admin: 'Usuários',
        'admin-tools': 'Ferramentas',
        reports: 'Relatórios',
        profile: 'Perfil',
        'maintenance-board': 'Manutenção'
    };

    return (
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">
            <Link
                to="/app/home"
                className="flex items-center hover:text-davus-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-md"
            >
                <Home className="h-4 w-4" />
            </Link>
            {pathnames.map((value, index) => {
                // Construct path including /app prefix
                const to = `/app/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const name = breadcrumbNameMap[value] || value;

                return (
                    <React.Fragment key={to}>
                        <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                        {isLast ? (
                            <span className="font-semibold text-davus-dark dark:text-gray-200 capitalize px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">
                                {name}
                            </span>
                        ) : (
                            <Link
                                to={to}
                                className="hover:text-davus-primary transition-colors capitalize hover:bg-gray-100 dark:hover:bg-gray-800 px-1.5 py-0.5 rounded-md"
                            >
                                {name}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
