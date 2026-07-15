import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Trash2, Edit3, ChevronLeft, ChevronRight, ShoppingCart, RefreshCw, X, CheckCircle2, Plus, PlusCircle, Trash } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SkeletonTableRow } from '@/components/ui/Skeleton';
import { fetchOrders, fetchCustomers, createOrder, updateOrderStatus, deleteOrder } from '@/api';
import type { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate, debounce, cn } from '@/utils';
import { useUIStore } from '@/store';

const PAGE_SIZE = 10;
const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const FILTER = ['all', ...ALL_STATUSES] as const;
const STATUS_COLORS: Record<OrderStatus, string> = { pending: '#F59E0B', processing: '#06B6D4', shipped: '#8B5CF6', delivered: '#10B981', cancelled: '#EF4444' };

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Math.min(5, total), start = Math.max(1, Math.min(page - 2, total - pages + 1));
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="btn-ghost !p-2 disabled:opacity-30"><ChevronLeft size={14} /></button>
      {Array.from({ length: pages }, (_, i) => start + i).map(n => (
        <button key={n} onClick={() => onChange(n)} className={cn('w-8 h-8 rounded-lg text-xs font-semibold', n === page ? 'btn-primary !p-0' : 'btn-ghost !p-0')}>{n}</button>
      ))}
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total} className="btn-ghost !p-2 disabled:opacity-30"><ChevronRight size={14} /></button>
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [statusF, setStatusF] = useState<typeof FILTER[number]>('all');
  const [page, setPage] = useState(1);

  // Modal control states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');

  // Create Order form state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [items, setItems] = useState<{ title: string; price: number; quantity: number }[]>([
    { title: '', price: 0, quantity: 1 }
  ]);

  const { addToast } = useUIStore();
  const qc = useQueryClient();
  
  const dSet = useCallback(debounce((v: string) => { setDSearch(v); setPage(1); }, 300), []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); dSet(e.target.value); };

  // Queries
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data;
    if (statusF !== 'all') list = list.filter(o => o.status === statusF);
    if (dSearch) {
      const q = dSearch.toLowerCase();
      list = list.filter(o => String(o.id).includes(q) || o.customerName.toLowerCase().includes(q));
    }
    return list;
  }, [data, statusF, dSearch]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Form helpers
  const handleAddItem = () => {
    setItems([...items, { title: '', price: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'title' | 'price' | 'quantity', value: any) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'title' ? value : Number(value)
        };
      }
      return item;
    });
    setItems(updated);
  };

  const orderTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Please select a customer.' });
      return;
    }
    if (items.some(item => !item.title || item.price <= 0 || item.quantity <= 0)) {
      addToast({ type: 'error', title: 'Validation Error', message: 'All items must have a title, positive price and quantity.' });
      return;
    }

    try {
      await createOrder({
        customerId: Number(selectedCustomerId),
        status: orderStatus,
        items
      });

      addToast({ type: 'success', title: 'Order Created', message: 'Successfully registered new order.' });
      setIsCreateOpen(false);
      
      // Invalidate both caches
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['customers'] });

      // Reset form
      setSelectedCustomerId('');
      setOrderStatus('pending');
      setItems([{ title: '', price: 0, quantity: 1 }]);
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create order on server.' });
    }
  };

  const saveStatus = async () => {
    if (!editing) return;
    try {
      await updateOrderStatus(editing.id, newStatus);
      addToast({ type: 'success', title: 'Status Updated', message: `Order #${editing.id} → ${newStatus}` });
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['orders'] });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to update order status.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteOrder(deleting.id);
      addToast({ type: 'success', title: 'Order Deleted', message: `Order #${deleting.id} removed.` });
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['customers'] });
      if (rows.length === 1 && page > 1) setPage(p => p - 1);
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete order.' });
    }
  };

  return (
    <PageShell title="Orders" subtitle={`${data?.length ?? 0} total orders`}>
      <div className="glass-elevated p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
            <input id="order-search" type="text" value={search} onChange={handleSearch} placeholder="Search by ID or customer…" className="input pl-10 py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={13} style={{ color: 'var(--text-3)' }} />
            {FILTER.map(s => (
              <button key={s} onClick={() => { setStatusF(s); setPage(1); }} className={cn('chip capitalize', statusF === s && 'active')}>{s === 'all' ? 'All' : s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setIsCreateOpen(true)} className="btn-primary py-2 text-sm">
              <Plus size={14} /> Create Order
            </button>
            <button onClick={() => refetch()} disabled={isFetching} className="btn-secondary py-2 text-sm">
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-3)' }}>
          Showing <span className="font-bold" style={{ color: 'var(--text-1)' }}>{rows.length}</span> of <span className="font-bold" style={{ color: 'var(--text-1)' }}>{filtered.length}</span> orders
        </p>
      </div>

      <div className="glass-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr>
              <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)
                : error ? <tr><td colSpan={7} className="py-16 text-center"><p style={{ color: '#F87171' }} className="font-semibold">Failed to load. <button onClick={() => refetch()} style={{ color: 'var(--neon-teal)' }}>Retry</button></p></td></tr>
                  : rows.length === 0 ? <tr><td colSpan={7} className="py-20 text-center"><ShoppingCart size={44} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-3)' }} /><p className="font-semibold" style={{ color: 'var(--text-1)' }}>No orders found</p><p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Try adjusting your filters</p></td></tr>
                    : rows.map((o: Order) => (
                      <tr key={o.id}>
                        <td><span className="font-mono text-sm font-bold gradient-text">#{String(o.id).padStart(4, '0')}</span></td>
                        <td><div className="flex items-center gap-2.5"><Avatar src={o.customerAvatar} name={o.customerName} size="xs" /><span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{o.customerName}</span></div></td>
                        <td className="text-xs" style={{ color: 'var(--text-2)' }}>{formatDate(o.date)}</td>
                        <td style={{ color: 'var(--text-2)' }}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                        <td><p className="font-bold text-sm gradient-text">{formatCurrency(o.discountedTotal)}</p>{o.discountedTotal < o.total && <p className="text-xs line-through" style={{ color: 'var(--text-3)' }}>{formatCurrency(o.total)}</p>}</td>
                        <td><Badge status={o.status} /></td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setEditing(o); setNewStatus(o.status); }} className="btn-ghost !p-1.5" title="Edit status"><Edit3 size={14} style={{ color: 'var(--neon-teal)' }} /></button>
                            <button onClick={() => setDeleting(o)} className="btn-ghost !p-1.5" title="Delete"><Trash2 size={14} style={{ color: '#F87171' }} /></button>
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

      {/* Create Order Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Order" size="md">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase" style={{ color: 'var(--text-3)' }}>Select Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              required
              className="input w-full p-2.5 text-sm cursor-pointer"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <option value="">-- Choose Customer --</option>
              {customers?.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.company?.name || 'Independent'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase" style={{ color: 'var(--text-3)' }}>Order Status</label>
            <div className="flex gap-4 flex-wrap">
              {ALL_STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-2)' }}>
                  <input type="radio" name="orderStatus" checked={orderStatus === s} onChange={() => setOrderStatus(s)} className="w-4 h-4 accent-teal-500" />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase" style={{ color: 'var(--text-3)' }}>Products / Items</label>
              <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: 'var(--neon-teal)' }}>
                <PlusCircle size={14} /> Add Product
              </button>
            </div>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold mb-0.5 uppercase opacity-60" style={{ color: 'var(--text-3)' }}>Title</label>
                    <input type="text" value={item.title} onChange={e => handleItemChange(idx, 'title', e.target.value)} required placeholder="e.g. Enterprise License" className="input w-full py-1.5 text-xs" />
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] font-semibold mb-0.5 uppercase opacity-60" style={{ color: 'var(--text-3)' }}>Price ($)</label>
                    <input type="number" value={item.price || ''} onChange={e => handleItemChange(idx, 'price', e.target.value)} required min="0" placeholder="Price" className="input w-full py-1.5 text-xs" />
                  </div>
                  <div className="w-16">
                    <label className="block text-[10px] font-semibold mb-0.5 uppercase opacity-60" style={{ color: 'var(--text-3)' }}>Qty</label>
                    <input type="number" value={item.quantity || ''} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} required min="1" placeholder="Qty" className="input w-full py-1.5 text-xs" />
                  </div>
                  <button type="button" onClick={() => handleRemoveItem(idx)} disabled={items.length === 1} className="btn-ghost !p-2 text-red-400 disabled:opacity-30 mb-0.5">
                    <Trash size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl glass-inner mt-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>Grand Total Amount:</span>
            <span className="text-lg font-bold gradient-text">{formatCurrency(orderTotal)}</span>
          </div>

          <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-secondary flex-1 justify-center"><X size={14} />Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center"><CheckCircle2 size={14} />Create Order</button>
          </div>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Update Order Status" size="sm">
        {editing && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl glass-inner">
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Order</p>
              <p className="font-mono font-bold gradient-text">#{String(editing.id).padStart(4, '0')}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>{editing.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Select New Status</p>
              <div className="space-y-2">
                {ALL_STATUSES.map(s => (
                  <button key={s} onClick={() => setNewStatus(s)} className={cn('flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all')}
                    style={{ border: newStatus === s ? `1px solid ${STATUS_COLORS[s]}40` : '1px solid var(--border)', background: newStatus === s ? `${STATUS_COLORS[s]}0D` : 'transparent' }}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[s] }} />
                    <span className="capitalize text-sm font-medium flex-1" style={{ color: 'var(--text-1)' }}>{s}</span>
                    {newStatus === s && <CheckCircle2 size={14} style={{ color: STATUS_COLORS[s] }} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="btn-secondary flex-1 justify-center"><X size={14} />Cancel</button>
              <button onClick={saveStatus} className="btn-primary flex-1 justify-center"><CheckCircle2 size={14} />Save</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Delete Order" size="sm">
        {deleting && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={28} className="mx-auto mb-2" style={{ color: '#F87171' }} />
              <p className="font-semibold" style={{ color: 'var(--text-1)' }}>Delete Order #{String(deleting.id).padStart(4, '0')}?</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={confirmDelete} className="btn-danger flex-1 justify-center"><Trash2 size={14} />Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
