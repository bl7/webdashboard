import React from "react";
import { Subscription } from "../hooks/useBillingData";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";

interface Props {
  subscription: Subscription;
  onChangePlan: () => void;
}

export default function PlanRenewal({ subscription, onChangePlan }: Props) {
  // Format current_period_end date
  const renewalDate = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="relative w-80 h-48 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 shadow-lg flex flex-col justify-between">
      {/* Calendar icon at top-right */}
      <div className="absolute top-3 right-3">
        <CalendarCheck className="w-5 h-5" />
      </div>

      <div>
        <div className="text-xs opacity-75 mb-1">Your Plan Ends On</div>
        <div className="text-2xl font-bold">{renewalDate}</div>
        <div className="text-sm font-medium mt-1">Plan Renewal Date</div>
      </div>

      <Button
        className="mt-2 self-start bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 border-none"
        onClick={onChangePlan}
      >
        Change Plan
      </Button>
    </div>
  );
}
