import React from "react";
import { Subscription } from "../hooks/useBillingData";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Props {
  subscription: Subscription;
  onChangePlan: () => void;
}

export default function SubscriptionInfo({ subscription, onChangePlan }: Props) {
  return (
    <div className="relative w-80 h-48 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 shadow-lg flex flex-col justify-between">
      {/* Star icon at top-right */}
      <div className="absolute top-3 right-3">
        <Star className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs opacity-75 mb-1">Your Current Plan</div>
        <div className="text-2xl font-bold">${subscription.plan_amount.toFixed(2)}</div>
        <div className="text-sm font-medium mt-1">{subscription.plan_name}</div>
      </div>

      <Button
        variant="outline"
        className="border-white text-black hover:bg-white hover:text-pink-600 mt-2 self-start"
        onClick={onChangePlan}
      >
        Change Plan
      </Button>
    </div>
  );
}
