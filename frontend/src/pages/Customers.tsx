import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Users, Filter, Plus, Edit3, Trash2, X, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SkeletonTableRow } from '@/components/ui/Skeleton';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/api';
import type { Customer, SortConfig } from '@/types';
import { formatCurrency, formatDate, debounce, cn } from '@/utils';
import { useUIStore } from '@/store';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['all', 'active', 'inactive', 'pending'] as const;

const POPULAR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 
  'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 
  'Boston', 'London', 'Paris', 'Berlin', 'Tokyo', 'Sydney', 
  'Toronto', 'Mumbai', 'Delhi'
];

const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Japan', 'India', 'China', 'Brazil', 
  'Mexico', 'Russia', 'South Africa', 'Italy', 'Spain', 
  'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Singapore', 'USA'
];

function SortIcon({ col, sort }: { col: string; sort: SortConfig }) {
  if (sort.key !== col) return <ChevronUp size={12} className="opacity-25" />;
  return sort.direction === 'asc' ? <ChevronUp size={12} style={{ color: 'var(--neon-teal)' }} /> : <ChevronDown size={12} style={{ color: 'var(--neon-teal)' }} />;
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Math.min(5, total);
  const start = Math.max(1, Math.min(page - 2, total - pages + 1));
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost !p-2 disabled:opacity-30"><ChevronLeft size={14} /></button>
      {Array.from({ length: pages }, (_, i) => start + i).map(n => (
        <button key={n} onClick={() => onChange(n)}
          className={cn('w-8 h-8 rounded-lg text-xs font-semibold transition-all', n === page ? 'btn-primary !p-0' : 'btn-ghost !p-0')}>
          {n}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} className="btn-ghost !p-2 disabled:opacity-30"><ChevronRight size={14} /></button>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('all');
  const [sort, setSort] = useState<SortConfig>({ key: 'firstName', direction: 'asc' });
  const [page, setPage] = useState(1);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Form inputs state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('US');
  const [customerStatus, setCustomerStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [cityFocused, setCityFocused] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);

  const { addToast } = useUIStore();
  const qc = useQueryClient();

  const dSet = useCallback(debounce((v: string) => { setDSearch(v); setPage(1); }, 300), []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); dSet(e.target.value); };

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data;
    if (status !== 'all') list = list.filter(c => c.status === status);
    if (dSearch) {
      const q = dSearch.toLowerCase();
      list = list.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company?.name ?? '').toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const av = String((a as any)[sort.key] ?? ''), bv = String((b as any)[sort.key] ?? '');
      return sort.direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [data, status, dSearch, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const toggleSort = (key: string) => { setSort(p => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' })); setPage(1); };

  // Opens form for either add or edit
  const openForm = (customer: Customer | null = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setEmail(customer.email);
      setPhone(customer.phone);
      setCompanyName(customer.company?.name ?? '');
      setCity(customer.address?.city ?? '');
      setCountry(customer.address?.country ?? 'US');
      setCustomerStatus(customer.status);
    } else {
      setEditingCustomer(null);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompanyName('');
      setCity('');
      setCountry('US');
      setCustomerStatus('active');
    }
    setIsFormOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      addToast({ type: 'error', title: 'Validation Error', message: 'First name, last name, and email are required.' });
      return;
    }

    try {
      if (editingCustomer) {
        // Edit Customer
        await updateCustomer(editingCustomer.id, {
          firstName,
          lastName,
          email,
          phone,
          company: { name: companyName },
          address: { city, state: '', country },
          status: customerStatus,
        });
        addToast({ type: 'success', title: 'Customer Updated', message: `Successfully updated ${firstName} ${lastName}` });
      } else {
        // Create Customer
        await createCustomer({
          firstName,
          lastName,
          email,
          phone,
          username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
          image: '',
          company: { name: companyName },
          address: { city, state: '', country },
          status: customerStatus,
        });
        addToast({ type: 'success', title: 'Customer Created', message: `Successfully onboarded ${firstName} ${lastName}` });
      }
      setIsFormOpen(false);
      qc.invalidateQueries({ queryKey: ['customers'] });
    } catch (err) {
      addToast({ type: 'error', title: 'API Error', message: 'Failed to save customer data to the server.' });
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    try {
      await deleteCustomer(deletingCustomer.id);
      addToast({ type: 'success', title: 'Customer Deleted', message: `Removed customer ${deletingCustomer.firstName} ${deletingCustomer.lastName}.` });
      setDeletingCustomer(null);
      qc.invalidateQueries({ queryKey: ['customers'] });
      // If we deleted the only item on the last page, go back a page
      if (rows.length === 1 && page > 1) setPage(p => p - 1);
    } catch (err) {
      addToast({ type: 'error', title: 'API Error', message: 'Failed to delete customer.' });
    }
  };

  const COLS = [
    { key: 'firstName', label: 'Customer', s: true },
    { key: 'email', label: 'Email', s: true },
    { key: 'phone', label: 'Phone', s: false },
    { key: 'company', label: 'Company', s: false },
    { key: 'status', label: 'Status', s: true },
    { key: 'totalOrders', label: 'Orders', s: true },
    { key: 'totalSpent', label: 'Spent', s: true },
    { key: 'joinDate', label: 'Joined', s: true },
    { key: 'actions', label: 'Actions', s: false },
  ];

  return (
    <PageShell title="Customers" subtitle={`${data?.length ?? 0} total customers in your CRM`}>
      {/* Toolbar */}
      <div className="glass-elevated p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
            <input id="customer-search" type="text" value={search} onChange={handleSearch} placeholder="Search customers…" className="input pl-10 py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} style={{ color: 'var(--text-3)' }} />
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={cn('chip capitalize', status === s && 'active')}>{s === 'all' ? 'All' : s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => openForm()} className="btn-primary py-2 text-sm">
              <Plus size={14} /> Add Customer
            </button>
            <button onClick={() => refetch()} disabled={isFetching} className="btn-secondary py-2 text-sm">
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-3)' }}>
          Showing <span className="font-bold" style={{ color: 'var(--text-1)' }}>{rows.length}</span> of <span className="font-bold" style={{ color: 'var(--text-1)' }}>{filtered.length}</span> results
          {dSearch && <span> for "<span className="font-semibold" style={{ color: 'var(--neon-teal)' }}>{dSearch}</span>"</span>}
        </p>
      </div>

      {/* Table */}
      <div className="glass-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {COLS.map(c => (
                  <th key={c.key} onClick={() => c.s && toggleSort(c.key)} className={c.s ? 'cursor-pointer' : ''}>
                    <span className="flex items-center gap-1">{c.label}{c.s && <SortIcon col={c.key} sort={sort} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} cols={9} />)
                : error ? (
                  <tr><td colSpan={9} className="py-16 text-center"><p style={{ color: '#F87171' }} className="font-semibold">Failed to load. <button onClick={() => refetch()} style={{ color: 'var(--neon-teal)' }}>Retry</button></p></td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={9} className="py-20 text-center"><Users size={44} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-3)' }} /><p className="font-semibold" style={{ color: 'var(--text-1)' }}>No customers found</p><p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Try adjusting your search or filters</p></td></tr>
                ) : rows.map((c: Customer) => (
                  <tr key={c.id}>
                    <td><div className="flex items-center gap-3"><Avatar src={c.image} name={`${c.firstName} ${c.lastName}`} size="sm" showStatus status={c.status} /><div><p className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{c.firstName} {c.lastName}</p><p className="text-xs" style={{ color: 'var(--text-3)' }}>@{c.username}</p></div></div></td>
                    <td style={{ color: 'var(--text-2)' }}>{c.email}</td>
                    <td style={{ color: 'var(--text-2)' }}>{c.phone || '—'}</td>
                    <td><p className="text-sm" style={{ color: 'var(--text-2)' }}>{c.company?.name || 'Independent'}</p><p className="text-xs" style={{ color: 'var(--text-3)' }}>{c.address?.city || 'Unknown'}, {c.address?.country || 'US'}</p></td>
                    <td><Badge status={c.status} /></td>
                    <td><span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>{c.totalOrders}</span></td>
                    <td><span className="font-bold text-sm gradient-text">{formatCurrency(c.totalSpent)}</span></td>
                    <td className="text-xs" style={{ color: 'var(--text-3)' }}>{formatDate(c.joinDate)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openForm(c)} className="btn-ghost !p-1.5" title="Edit Customer"><Edit3 size={14} style={{ color: 'var(--neon-teal)' }} /></button>
                        <button onClick={() => setDeletingCustomer(c)} className="btn-ghost !p-1.5" title="Delete Customer"><Trash2 size={14} style={{ color: '#F87171' }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingCustomer ? 'Edit Customer Details' : 'Onboard New Customer'} size="md">
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>First Name *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="e.g. Sarah" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Last Name *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="e.g. Mitchell" className="input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Email Address *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="e.g. sarah.m@vertex.io" className="input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +1 (555) 000-0000" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Vertex Solutions" className="input w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                onFocus={() => setCityFocused(true)}
                onBlur={() => setTimeout(() => setCityFocused(false), 200)}
                placeholder="e.g. San Francisco"
                className="input w-full"
              />
              {cityFocused && city && POPULAR_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase())).length > 0 && (
                <div
                  className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto glass-card-elevated rounded-xl z-50 p-1"
                  style={{
                    background: 'rgba(255,255,255,0.98)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    boxShadow: '0 8px 24px rgba(80,140,210,0.15)'
                  }}
                >
                  {POPULAR_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase())).map(item => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() => setCity(item)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-sky-500/10 text-slate-700 font-semibold cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Country</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                onFocus={() => setCountryFocused(true)}
                onBlur={() => setTimeout(() => setCountryFocused(false), 200)}
                placeholder="e.g. USA"
                className="input w-full"
              />
              {countryFocused && country && POPULAR_COUNTRIES.filter(c => c.toLowerCase().includes(country.toLowerCase())).length > 0 && (
                <div
                  className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto glass-card-elevated rounded-xl z-50 p-1"
                  style={{
                    background: 'rgba(255,255,255,0.98)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    boxShadow: '0 8px 24px rgba(80,140,210,0.15)'
                  }}
                >
                  {POPULAR_COUNTRIES.filter(c => c.toLowerCase().includes(country.toLowerCase())).map(item => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() => setCountry(item)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-sky-500/10 text-slate-700 font-semibold cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase" style={{ color: 'var(--text-3)' }}>Customer Status</label>
            <div className="flex gap-4">
              {['active', 'inactive', 'pending'].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-2)' }}>
                  <input type="radio" name="customerStatus" checked={customerStatus === s} onChange={() => setCustomerStatus(s as any)} className="w-4 h-4 accent-teal-500" />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1 justify-center"><X size={14} />Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center"><CheckCircle2 size={14} />Save Customer</button>
          </div>
        </form>
      </Modal>

      {/* Delete Customer Confirmation Modal */}
      <Modal isOpen={!!deletingCustomer} onClose={() => setDeletingCustomer(null)} title="Delete Customer" size="sm">
        {deletingCustomer && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={28} className="mx-auto mb-2" style={{ color: '#F87171' }} />
              <p className="font-semibold" style={{ color: 'var(--text-1)' }}>Remove {deletingCustomer.firstName} {deletingCustomer.lastName}?</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>All profile records will be permanently removed. Order records will remain intact.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeletingCustomer(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDeleteCustomer} className="btn-danger flex-1 justify-center"><Trash2 size={14} />Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
