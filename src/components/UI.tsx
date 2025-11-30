
import React, { InputHTMLAttributes, ButtonHTMLAttributes, useState, useRef, useEffect } from 'react';
import { Loader2, X, ChevronDown, Check, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';

// Helper for class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Logo ---
export const DavusLogo: React.FC<{ className?: string, hideSubtitle?: boolean }> = ({ className, hideSubtitle }) => {
  return (
    <img
      src="/logo.png"
      alt="Davus Engenharia"
      className={cn("object-contain", className)}
    />
  );
};

// --- Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)} />
  );
};

// --- Breadcrumbs ---
export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

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
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link to="/" className="hover:text-davus-primary transition-colors">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-davus-dark dark:text-gray-200 capitalize">{name}</span>
            ) : (
              <Link to={to} className="hover:text-davus-primary transition-colors capitalize">{name}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// --- Pagination ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-end space-x-2 py-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        Página {currentPage} de {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// --- Button ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-davus-primary to-davus-secondary text-white hover:shadow-glow hover:-translate-y-0.5 shadow-md dark:from-davus-primary dark:to-davus-secondary',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750',
    outline: 'border-2 border-davus-primary/20 text-davus-primary hover:bg-davus-primary/5 hover:border-davus-primary/50 dark:border-davus-primary/30 dark:text-davus-accent',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-davus-primary dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-davus-accent',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-red-500/20',
    link: 'text-davus-primary underline-offset-4 hover:underline decoration-2',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-8 w-8 p-0 flex items-center justify-center',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-davus-primary disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children as React.ReactNode}
    </motion.button>
  );
};

// --- Input ---
interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm font-medium text-davus-dark dark:text-gray-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary/50 focus-visible:border-davus-primary transition-all shadow-sm",
          "dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:ring-offset-gray-950 dark:focus-visible:ring-davus-primary/40",
          error ? "border-red-500 focus-visible:ring-red-500/50" : "",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

// --- Select (Native wrapper styled like Shadcn) ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, options, placeholder, ...props }, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm font-medium text-davus-dark dark:text-gray-200 leading-none">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-davus-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:ring-offset-gray-900",
            error ? "border-red-500" : "",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none dark:text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

// --- Checkbox ---
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-davus-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-davus-primary checked:border-davus-primary dark:border-gray-600 dark:bg-gray-800"
          ref={ref}
          {...props}
        />
        <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
      </div>
      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
});

// --- Modal / Dialog ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="z-50 w-full max-w-lg scale-100 gap-4 border bg-white p-6 opacity-100 shadow-lg sm:rounded-lg md:w-full max-h-[90vh] overflow-y-auto m-4 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
                <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-davus-primary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-white">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Confirm Dialog ---
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'destructive';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = 'primary'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-50 w-full max-w-sm scale-100 gap-4 border bg-white p-6 opacity-100 shadow-lg rounded-lg m-4 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">
                {variant === 'destructive' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                {title}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
              <Button variant="outline" onClick={onClose} className="mt-2 sm:mt-0">
                {cancelText}
              </Button>
              <Button variant={variant} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Dropdown Menu (Simple) ---
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white shadow-md focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="p-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> { }
export const DropdownItem: React.FC<DropdownItemProps> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700",
      className
    )}
    role="menuitem"
    {...props}
  >
    {children}
  </button>
);


// --- Card ---
export const Card: React.FC<HTMLMotionProps<"div">> = ({ className, children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn("rounded-xl border border-gray-100 bg-white text-davus-dark shadow-soft hover:shadow-lg transition-all duration-300 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-100 backdrop-blur-sm", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)}>{children}</p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

// --- Badge ---
export const Badge: React.FC<{ variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'; children: React.ReactNode; className?: string }> = ({ variant = 'default', children, className }) => {
  const variants = {
    default: "border-transparent bg-davus-primary/10 text-davus-primary hover:bg-davus-primary/20 dark:bg-davus-primary/20 dark:text-davus-accent",
    secondary: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300",
    outline: "text-gray-600 border border-gray-200 dark:text-gray-400 dark:border-gray-700",
    destructive: "border-transparent bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-900/30 dark:text-red-400",
    success: "border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    info: "border-transparent bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2", variants[variant], className)}>
      {children}
    </div>
  );
};

// --- Table Mock (Simple) ---
export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm text-gray-700 dark:text-gray-300", className)}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="[&_tr]:border-b bg-gray-50/50 dark:bg-gray-900/50 dark:border-gray-700">{children}</thead>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
  <tr className={cn("border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700/50", className)} {...props}>{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0", className)}>{children}</th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td className={cn("px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>{children}</td>
);
