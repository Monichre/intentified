import type React from "react";
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
} from "@/components/animated-modal";
import { LeadTargetingForm } from "./LeadTargetingForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * LeadTargetingModal
 * Modal dialog that displays the LeadTargetingForm when triggered by a CTAButton.
 *
 * @param ctaText - Text for the CTA button (default: "BOOK A DEMO")
 * @param ctaVariant - Variant for the CTA button (default: "outline")
 * @param ctaIcon - Optional icon for the CTA button
 * @param ctaClassName - Additional class names for the button
 */
export interface LeadTargetingModalProps {
  ctaText?: string;
  ctaVariant?: "default" | "outline";
  ctaIcon?: React.ReactNode;
  ctaClassName?: string;
  children?: React.ReactNode;
}

export const LeadTargetingModal: React.FC<LeadTargetingModalProps> = ({
  children,
}) => {
  return (
    <Modal>
      {children}
      <ModalBody className="bg-background/95 backdrop-blur-sm">
        <ModalContent className="bg-background border-border mx-auto w-full max-w-5xl border shadow-lg">
          <LeadTargetingForm />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};
