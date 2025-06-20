"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Users, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/utils/utils";

const identityResolutionSteps = [
  {
    stage: "Anonymous Visitor",
    percentage: 40,
    description: "Typical website visitor identification",
    color: "bg-red-100 text-red-700",
    icon: Users,
  },
  {
    stage: "AI Matching",
    percentage: 70,
    description: "Our proprietary matching algorithm",
    color: "bg-yellow-100 text-yellow-700",
    icon: Brain,
  },
  {
    stage: "Complete Profile",
    percentage: 100,
    description: "Full contact and behavioral data",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
];

const profileData = [
  "Full Name",
  "Email (verified)",
  "Phone Number",
  "Company Details",
  "Job Title",
  "Social Profiles",
  "Buying Stage",
  "Budget Range",
];

interface IdentityResolutionEngineProps {
  showValues?: boolean;
}

export const IdentityResolutionEngine: FC<IdentityResolutionEngineProps> = ({
  showValues = true,
}) => {
  return (
    <>
      {/* Identity Resolution Engine */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-2xl font-bold">
          Identity Resolution Engine
        </h3>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            {identityResolutionSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === identityResolutionSteps.length - 1;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  <Card className="h-full w-full">
                    <CardHeader className="pb-3 text-center">
                      <div className="mb-3 flex justify-center">
                        <div className={cn("rounded-full p-3", step.color)}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{step.stage}</CardTitle>
                      <div className="text-primary text-3xl font-bold">
                        <AnimatedNumber
                          value={showValues ? step.percentage : 0}
                        />
                        %
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {!isLast && (
                    <div className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 transform md:block">
                      <ArrowRight className="text-primary h-6 w-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complete Profile Includes */}
      <div className="mb-16">
        <h4 className="mb-6 text-center text-xl font-bold">
          Complete Profile Includes:
        </h4>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
          {profileData.map((data, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-muted-foreground">{data}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IdentityResolutionEngine;
