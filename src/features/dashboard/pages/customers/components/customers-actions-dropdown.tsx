"use client";

import { Customer } from "@/features/dashboard/pages/customers/types/customer";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  ShoppingCart, 
  Mail, 
  FileText,
  Ban,
  UserCheck
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

interface CustomerActionsProps {
  customer: Customer;
}

export function CustomerActionsDropdown({ customer }: CustomerActionsProps) {
  const handleViewDetails = () => {
    // Implement view details functionality
    console.log("View customer details", customer.customerNumber);
  };

  const handleEditCustomer = () => {
    // Implement edit customer functionality
    console.log("Edit customer", customer.customerNumber);
  };

  const handleViewPurchases = () => {
    // Implement view purchases functionality
    console.log("View purchases for", customer.customerNumber);
  };

  const handleSendEmail = () => {
    // Implement email functionality
    console.log("Email customer", customer.email);
  };

  const handleCreateOrder = () => {
    // Implement new order functionality
    console.log("Create order for", customer.customerNumber);
  };

  const handleViewInvoices = () => {
    // Implement view invoices functionality
    console.log("View invoices for", customer.customerNumber);
  };

  const handleActivateCustomer = () => {
    // Implement activation functionality
    console.log("Activate customer", customer.customerNumber);
  };

  const handleBlockCustomer = () => {
    // Implement block functionality
    console.log("Block customer", customer.customerNumber);
  };

  const handleDeleteCustomer = () => {
    // Implement delete functionality
    console.log("Delete customer", customer.customerNumber);
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
          <DropdownMenuItem onClick={handleEditCustomer}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Customer</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewPurchases}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>View Purchases</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewInvoices}>
            <FileText className="mr-2 h-4 w-4" />
            <span>View Invoices</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateOrder}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Create Order</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Send Email</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {(customer.status === "inactive" || customer.status === "blocked") && (
            <DropdownMenuItem onClick={handleActivateCustomer}>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Activate Customer</span>
            </DropdownMenuItem>
          )}
          {customer.status !== "blocked" && (
            <DropdownMenuItem onClick={handleBlockCustomer} className="text-amber-600">
              <Ban className="mr-2 h-4 w-4" />
              <span>Block Customer</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteCustomer}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete Customer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 