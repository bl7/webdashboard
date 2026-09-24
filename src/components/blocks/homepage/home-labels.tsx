"use client"

import React from "react"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"

export const ILLUSTRATIVE_PRINTED = "2026-09-21T09:00:00Z"
export const ILLUSTRATIVE_EXPIRY = "2026-09-22T09:00:00Z"

export type HomeLabelKind = "prep" | "cooked" | "defrost" | "ingredients" | "usefirst" | "ppds"

const vegIngredients = [
  { uuid: "6", ingredientName: "Carrots", allergens: [] as { allergenName: string }[] },
  { uuid: "7", ingredientName: "Broccoli", allergens: [] },
  { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
  { uuid: "9", ingredientName: "Peppers", allergens: [] },
]

const curryIngredients = [
  { uuid: "c1", ingredientName: "Chicken", allergens: [] as { allergenName: string }[] },
  { uuid: "c2", ingredientName: "Cream", allergens: [{ allergenName: "Milk" }] },
  { uuid: "c3", ingredientName: "Mustard", allergens: [{ allergenName: "Mustard" }] },
]

const sandwichIngredients = [
  { uuid: "p1", ingredientName: "bread", allergens: [{ allergenName: "Wheat" }] },
  { uuid: "p2", ingredientName: "cheddar", allergens: [{ allergenName: "Milk" }] },
  { uuid: "p3", ingredientName: "butter", allergens: [{ allergenName: "Milk" }] },
]

function menuItem(
  id: string,
  name: string,
  labelType: "prep" | "cooked" | "default",
  ingredientNames: string[],
  allergens: string[],
  type: "menu" | "ingredients" = "menu"
) {
  return {
    uid: id,
    id,
    type,
    name,
    quantity: 1,
    ingredients: ingredientNames,
    allergens: allergens.map((name, i) => ({
      uuid: i,
      allergenName: name,
      category: "",
      status: "Active" as const,
      addedAt: "",
      isCustom: false,
    })),
    printedOn: ILLUSTRATIVE_PRINTED,
    expiryDate: ILLUSTRATIVE_EXPIRY,
    labelType,
  }
}

export function HomeSpecimen({
  kind,
  labelHeight = "40mm",
}: {
  kind: HomeLabelKind
  labelHeight?: "40mm" | "80mm"
}) {
  return (
    <div className="home-specimen" style={{ color: "#000" }}>
      {renderSpecimen(kind, labelHeight)}
    </div>
  )
}

function renderSpecimen(kind: HomeLabelKind, labelHeight: "40mm" | "80mm") {
  if (kind === "ppds") {
    return (
      <PPDSLabelRenderer
        item={{
          uid: "home-ppds",
          id: "home-ppds",
          type: "menu",
          name: "Cheddar sandwich",
          quantity: 1,
          labelType: "ppds",
          ingredients: ["bread", "cheddar", "butter"],
        }}
        storageInfo=""
        businessName=""
        allIngredients={sandwichIngredients}
      />
    )
  }

  if (kind === "usefirst") {
    return (
      <LabelRender
        item={menuItem("home-usefirst", "USE FIRST", "default", [], [])}
        expiry={ILLUSTRATIVE_EXPIRY}
        useInitials={false}
        selectedInitial=""
        allergens={[]}
        labelHeight={labelHeight}
        allIngredients={[]}
      />
    )
  }

  if (kind === "prep") {
    return (
      <LabelRender
        item={menuItem("home-prep", "Roasted vegetables", "prep", ["Carrots", "Broccoli", "Celery", "Peppers"], [
          "Celery",
        ])}
        expiry={ILLUSTRATIVE_EXPIRY}
        useInitials={true}
        selectedInitial="BL"
        allergens={["Celery"]}
        labelHeight={labelHeight}
        allIngredients={vegIngredients}
      />
    )
  }

  if (kind === "cooked") {
    return (
      <LabelRender
        item={menuItem("home-cooked", "Chicken curry", "cooked", ["Chicken", "Cream", "Mustard"], [
          "Milk",
          "Mustard",
        ])}
        expiry={ILLUSTRATIVE_EXPIRY}
        useInitials={true}
        selectedInitial="BL"
        allergens={["Milk", "Mustard"]}
        labelHeight={labelHeight}
        allIngredients={curryIngredients}
      />
    )
  }

  if (kind === "defrost") {
    return (
      <LabelRender
        item={menuItem("home-defrost", "Cod fillets", "default", ["Cod fillets"], ["Fish"], "ingredients")}
        expiry={ILLUSTRATIVE_EXPIRY}
        useInitials={true}
        selectedInitial="BL"
        allergens={["Fish"]}
        labelHeight={labelHeight}
        allIngredients={[
          { uuid: "d1", ingredientName: "Cod fillets", allergens: [{ allergenName: "Fish" }] },
        ]}
      />
    )
  }

  return (
    <LabelRender
      item={menuItem("home-yoghurt", "Greek yoghurt", "default", ["Greek yoghurt"], ["Milk"], "ingredients")}
      expiry={ILLUSTRATIVE_EXPIRY}
      useInitials={true}
      selectedInitial="BL"
      allergens={["Milk"]}
      labelHeight={labelHeight}
      allIngredients={[
        { uuid: "y1", ingredientName: "Greek yoghurt", allergens: [{ allergenName: "Milk" }] },
      ]}
    />
  )
}

export function emitHomeEvent(name: string, extra: Record<string, string> = {}) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("instalabel:homepage", { detail: { name, ...extra } }))
}
