import { MoreHorizontal, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import type { Invoice } from '@/services/invoices'
import { formatMoney, formatDate } from '@/lib/format'

// DATA: GET /api/invoices?status=&page= -> Page<Invoice>
type Props = { invoices: Invoice[] | undefined; error?: string; onRetry: () => void; onCreate: () => void }

const statusTone = { draft: 'secondary', sent: 'outline', overdue: 'destructive', paid: 'default' } as const

export function InvoiceTable({ invoices, error, onRetry, onCreate }: Props) {
  if (error) {
    return (
      <div role="alert" className="grid gap-3 rounded-md border border-border p-6">
        <p className="text-sm text-foreground">We couldn't load invoices: {error}</p>
        <Button variant="outline" onClick={onRetry}>Try again</Button>
      </div>
    )
  }
  if (!invoices) {
    return (
      <div className="grid gap-2" aria-busy="true" aria-label="Loading invoices">
        {Array.from({ length: 6 }, (_, row) => <Skeleton key={`row-${row}`} className="h-10 w-full" />)}
      </div>
    )
  }
  if (invoices.length === 0) {
    return (
      <div className="grid justify-items-start gap-3 rounded-md border border-dashed border-border p-8">
        <FileText className="size-5 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">No invoices yet. Create one, or import last month's from CSV.</p>
        <Button onClick={onCreate}>Create invoice</Button>
      </div>
    )
  }
  return (
    <table className="w-full text-sm" aria-label="Invoices">
      <thead className="sticky top-0 bg-background text-left text-muted-foreground">
        <tr>
          <th scope="col" className="py-2 font-medium">Number</th>
          <th scope="col" className="py-2 font-medium">Customer</th>
          <th scope="col" className="py-2 text-right font-medium">Amount</th>
          <th scope="col" className="py-2 font-medium">Due</th>
          <th scope="col" className="py-2 font-medium">Status</th>
          <th scope="col" className="py-2"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-t border-border">
            <td className="py-2 font-mono">{inv.number}</td>
            <td className="py-2">{inv.customer.name}</td>
            <td className="py-2 text-right tabular-nums">{formatMoney(inv.amountMinor, inv.currency)}</td>
            <td className="py-2">{formatDate(inv.dueDate)}</td>
            <td className="py-2"><Badge variant={statusTone[inv.status]}>{inv.status}</Badge></td>
            <td className="py-2 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Actions for invoice ${inv.number}`}>
                    <MoreHorizontal aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Send reminder</DropdownMenuItem>
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
