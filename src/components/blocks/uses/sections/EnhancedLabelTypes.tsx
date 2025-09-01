"use client"
import React from "react"
import { motion } from "framer-motion"
import {
  Clock,
  ChefHat,
  Shield,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react"

export const EnhancedLabelTypes = () => {
  const labelTypes = [
    {
      type: "Prep Labels",
      icon: <ChefHat className="h-8 w-8 text-green-600" />,
      current: "Fresh ingredients, prep times, expiry dates",
      color: "green",
      scenarios: [
        {
          title: "Morning Ingredient Processing",
          description: "Label fresh deliveries with receipt and storage information",
          details:
            "Receive morning delivery of lettuce, tomatoes, onions. Print prep labels showing: wash date, prep staff, use-by calculation, storage location. Staff can instantly identify which items to use first during service.",
        },
        {
          title: "Batch Cooking Preparation",
          description: "Track large-quantity items with prep staff and batch numbers",
          details:
            "Batch-cook sauces for the week. Labels include: cook date, batch number, allergen warnings, portion yields. Kitchen staff know exactly when each batch was made and when to discard.",
        },
      ],
      benefits: [
        "Full traceability from ingredient to plate for EHO inspections",
        "Staff accountability with name and time stamps on every label",
        "Automatic expiry calculations reduce human error and food waste",
        "Clear allergen warnings prevent cross-contamination accidents",
      ],
    },
    {
      type: "Cook Labels",
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      current: "Cook times, temperatures, allergens",
      color: "orange",
      scenarios: [
        {
          title: "Grill Station Management",
          description: "Track cook times for steaks, chicken, fish with temperature requirements",
          details:
            "Prep cook labels proteins with cook times and internal temperatures. Service staff can see exact cook completion times. Labels include allergen warnings for servers to communicate to customers.",
        },
        {
          title: "Special Dietary Orders",
          description: "Clearly identify gluten-free, vegan, or allergen-free preparations",
          details:
            "Cook labels clearly identify gluten-free, vegan, or allergen-free preparations. Separate equipment usage tracked on labels. Cross-contamination prevention through clear labeling protocols.",
        },
      ],
      benefits: [
        "Consistent cooking standards across all staff and shifts",
        "Temperature tracking for HACCP compliance and food safety",
        "Clear communication between kitchen stations during busy periods",
        "Reduced mistakes and improved customer satisfaction",
      ],
    },
    {
      type: "PPDS Labels",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      current: "Full ingredient lists, allergen warnings",
      color: "purple",
      scenarios: [
        {
          title: "Cafe Display Case",
          description: "Morning team prepares 20+ sandwiches for lunch display",
          details:
            "Each sandwich gets PPDS label with complete ingredient list. Allergen information clearly highlighted for customer visibility. Business contact information included for customer inquiries.",
        },
        {
          title: "Takeaway and Delivery Orders",
          description: "Kitchen prepares meals in takeaway containers",
          details:
            "PPDS labels applied before food leaves the kitchen. Delivery drivers have complete allergen information. Customer receives FSA-compliant labeling with their order.",
        },
      ],
      benefits: [
        "All 14 UK allergens automatically highlighted when present",
        "FSA-approved label format ensures legal compliance",
        "Business name and contact details included automatically",
        "Storage instructions customized based on food type",
      ],
    },
  ]

  return (
    <section className="relative bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Professional Label Types for Every Kitchen Need
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            From morning prep to final service, InstaLabel provides the right label type for every
            stage of your food preparation workflow.
          </p>
        </motion.div>

        {/* Label Types - Different Layout for Each */}
        <div className="space-y-20">
          {labelTypes.map((labelType, index) => (
            <motion.div
              key={labelType.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`grid items-center gap-12 ${
                index % 2 === 0 ? "lg:grid-cols-2" : "lg:grid-flow-col-dense lg:grid-cols-2"
              }`}
            >
              {/* Left Content - Alternating Layout */}
              <div className={`space-y-6 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="flex items-center gap-4">
                  <div className={`rounded-2xl bg-${labelType.color}-100 p-4`}>
                    {labelType.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{labelType.type}</h3>
                    <p className="text-lg text-gray-600">{labelType.current}</p>
                  </div>
                </div>

                {/* Real Kitchen Scenarios - Card Layout */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Users className="h-5 w-5 text-gray-600" />
                    Real Kitchen Scenarios
                  </h4>
                  {labelType.scenarios.map((scenario, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md"
                    >
                      <h5 className="mb-2 font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
                        {scenario.title}
                      </h5>
                      <p className="mb-2 text-sm text-gray-600">{scenario.description}</p>
                      <p className="rounded-lg bg-gray-50 p-3 text-sm italic text-gray-700">
                        {scenario.details}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Content - Benefits with Different Visual Style */}
              <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
                  <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Shield className="h-6 w-6 text-purple-600" />
                    Compliance Benefits
                  </h4>
                  <div className="space-y-4">
                    {labelType.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-white"
                      >
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-sm leading-relaxed text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
