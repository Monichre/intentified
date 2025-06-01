"use client";

import { Order } from "@/features/dashboard/pages/orders/types/order";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Download, 
  FileText, 
  Ban
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

interface OrderActionsProps {
  order: Order;
}

export function OrderActionsDropdown({ order }: OrderActionsProps) {
  const handleViewDetails = () => {
    // Implement view details functionality
    console.log("View order details", order.orderNumber);
  };

  const handleEditOrder = () => {
    // Implement edit order functionality
    console.log("Edit order", order.orderNumber);
  };

  const handleGenerateInvoice = () => {
    // Implement invoice generation
    console.log("Generate invoice for", order.orderNumber);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Download order", order.orderNumber);
  };

  const handleCancelOrder = () => {
    // Implement cancel functionality
    console.log("Cancel order", order.orderNumber);
  };

  const handleDeleteOrder = () => {
    // Implement delete functionality
    console.log("Delete order", order.orderNumber);
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
          <DropdownMenuItem onClick={handleEditOrder}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Order</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGenerateInvoice}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Generate Invoice</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {order.status !== "cancelled" ? (
            <DropdownMenuItem 
              onClick={handleCancelOrder}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              <span>Cancel Order</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={handleDeleteOrder}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Order</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 