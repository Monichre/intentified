"use client";

import { Invoice } from "@/features/dashboard/pages/invoices/types/invoice";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Download, 
  Send, 
  Ban,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface InvoiceActionsProps {
  invoice: Invoice;
}

export function InvoiceActionsDropdown({ invoice }: InvoiceActionsProps) {
  const handleViewDetails = () => {
    // Implement view details functionality
    console.log("View invoice details", invoice.invoiceNumber);
  };

  const handleEditInvoice = () => {
    // Implement edit invoice functionality
    console.log("Edit invoice", invoice.invoiceNumber);
  };

  const handleMarkAsPaid = () => {
    // Implement mark as paid functionality
    console.log("Mark invoice as paid", invoice.invoiceNumber);
  };

  const handleSendInvoice = () => {
    // Implement send invoice functionality
    console.log("Send invoice", invoice.invoiceNumber);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Download invoice", invoice.invoiceNumber);
  };

  const handleCancelInvoice = () => {
    // Implement cancel functionality
    console.log("Cancel invoice", invoice.invoiceNumber);
  };

  const handleDeleteInvoice = () => {
    // Implement delete functionality
    console.log("Delete invoice", invoice.invoiceNumber);
  };

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditInvoice}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Invoice</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {invoice.status !== "paid" && (
            <DropdownMenuItem onClick={handleMarkAsPaid}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Mark as Paid</span>
            </DropdownMenuItem>
          )}
          {(invoice.status === "draft" || invoice.status === "pending") && (
            <DropdownMenuItem onClick={handleSendInvoice}>
              <Send className="mr-2 h-4 w-4" />
              <span>Send Invoice</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download PDF</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {invoice.status !== "cancelled" ? (
            <DropdownMenuItem 
              onClick={handleCancelInvoice}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              <span>Cancel Invoice</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={handleDeleteInvoice}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Invoice</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 