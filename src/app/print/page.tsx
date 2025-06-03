"use client";

import React, { useState, useEffect, useCallback } from "react";
import Script from "next/script";

const ALLERGENS = [
  "milk",
  "eggs",
  "nuts",
  "soy",
  "wheat",
  "fish",
  "shellfish",
  "peanuts",
];

type Item = {
  id: number;
  name: string;
  printedOn?: string;
  expiryDate?: string;
  ingredients?: string[];
};

const MAX_INGREDIENTS_TO_FIT = 6;

const itemsData: Item[] = [
  {
    id: 1,
    name: "Product A",
    printedOn: "2025-06-01",
    expiryDate: "2025-12-01",
    ingredients: [
      "water",
      "milk",
      "sugar",
      "natural flavor",
      "vanilla extract",
      "stabilizers",
    ],
  },
  {
    id: 2,
    name: "Product B",
    printedOn: "2025-05-15",
    expiryDate: "2025-11-15",
    ingredients: [
      "flour",
      "eggs",
      "salt",
      "yeast",
      "butter",
      "milk",
      "flour",
      "flourwe",
      "floured",
      "flouredwe",
      "flouredqwe",
      "flouredsfgdg",
    ],
  },
  {
    id: 3,
    name: "Product C",
    printedOn: "2025-06-02",
    expiryDate: "2025-12-02",
    ingredients: [
      "soy protein",
      "corn syrup",
      "nuts",
      "salt",
      "emulsifiers",
      "preservatives",
    ],
  },
  {
    id: 4,
    name: "Product D",
    printedOn: "2025-06-03",
    expiryDate: "2025-12-03",
    ingredients: ["fish oil", "water", "salt", "natural flavor", "coloring"],
  },
  {
    id: 5,
    name: "Product E",
    printedOn: "2025-06-04",
    expiryDate: "2025-12-04",
    ingredients: ["shellfish extract", "spices", "peanuts", "salt", "sugar"],
  },
];

// Highlight allergens in ingredient text (used in preview)
function highlightAllergens(ingredient: string) {
  const lower = ingredient.toLowerCase();
  for (const allergen of ALLERGENS) {
    if (lower.includes(allergen)) {
      const regex = new RegExp(`(${allergen})`, "gi");
      const parts = ingredient.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} style={{ color: "red", fontWeight: "bold" }}>
            {part}
          </span>
        ) : (
          part
        )
      );
    }
  }
  return ingredient;
}

function extractAllergens(ingredients: string[]) {
  const found = new Set<string>();
  ingredients.forEach((ingredient) => {
    ALLERGENS.forEach((allergen) => {
      if (ingredient.toLowerCase().includes(allergen)) {
        found.add(allergen);
      }
    });
  });
  return Array.from(found);
}

export default function LabelPrinter() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Epson device interface for type safety
  interface EpsonDevice {
    addTextAlign(align: number): void;
    addTextSize(width: number, height: number): void;
    addText(text: string): void;
    addFeedLine(lines: number): void;
    addCut(mode: number): void;
    send(): void;
    ALIGN_CENTER: number;
    ALIGN_LEFT: number;
    CUT_FEED: number;
  }

  // Wrap connectCallback in useCallback to fix hook dependency warning
  const connectCallback = useCallback((resultConnect: string) => {
    if (resultConnect === "OK") {
      window.epsonPrinter.createDevice(
        "local_printer",
        window.epsonPrinter.DEVICE_TYPE_PRINTER,
        { crypto: false, buffer: false },
        printCallback
      );
      setMessage("Connected to printer service. Creating printer device...");
    } else {
      setPrinterConnected(false);
      setMessage(`Connection error: ${resultConnect}`);
    }
  }, []);

  // printCallback with typed parameters
  const printCallback = (deviceObj: EpsonDevice | null, errorCode: number) => {
    if (deviceObj) {
      window.printer = deviceObj;
      setPrinterConnected(true);
      setMessage("Printer connected successfully");
    } else {
      setPrinterConnected(false);
      setMessage(`Failed to create printer device: ${errorCode}`);
    }
  };

  // initializePrinter wrapped in useCallback with connectCallback dependency
  const initializePrinter = useCallback(() => {
    try {
      if (window.epson && window.epson.ePOSDevice) {
        window.epsonPrinter = new window.epson.ePOSDevice();
        window.epsonPrinter.connect("localhost", 8008, connectCallback);
        setMessage("Initializing printer connection...");
      } else {
        setMessage("Error: Epson ePOS SDK not loaded properly");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Initialization error: ${error.message}`);
      } else {
        setMessage("Unknown initialization error");
      }
    }
  }, [connectCallback]);

  useEffect(() => {
    if (scriptLoaded) {
      initializePrinter();
    }
    return () => {
      if (window.epsonPrinter) {
        window.epsonPrinter.disconnect();
      }
    };
  }, [scriptLoaded, initializePrinter]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedItems = itemsData.filter((item) =>
    selectedIds.includes(item.id)
  );

  const handlePrint = () => {
    if (!printerConnected) {
      setMessage("Printer not connected");
      return;
    }
    if (selectedItems.length === 0) {
      setMessage("No items selected");
      return;
    }
    try {
      const printer: EpsonDevice = window.printer;
      selectedItems.forEach((item) => {
        printer.addTextAlign(printer.ALIGN_CENTER);
        printer.addTextSize(1, 1);
        printer.addText(`${item.name}\n`);
        printer.addTextAlign(printer.ALIGN_LEFT);
        printer.addTextSize(1, 1);

        const ingredientsSafe = item.ingredients ?? [];
        const allergens = extractAllergens(ingredientsSafe);
        const tooLong = ingredientsSafe.length > MAX_INGREDIENTS_TO_FIT;
        const showOnlyAllergens = tooLong && allergens.length > 0;

        if (showOnlyAllergens) {
          printer.addText("Allergens: ");
          printer.addText(allergens.join(", ") + "\n");
        } else {
          printer.addText("Ingredients: " + ingredientsSafe.join(", ") + "\n");
        }

        if (item.printedOn && item.expiryDate) {
          printer.addText(
            `Printed On: ${new Date(
              item.printedOn
            ).toLocaleDateString()} | Expiry: ${new Date(
              item.expiryDate
            ).toLocaleDateString()}\n`
          );
        }
        printer.addFeedLine(2);
        printer.addCut(printer.CUT_FEED);
      });
      printer.send();
      setMessage("Print job sent successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Print error: ${error.message}`);
      } else {
        setMessage("Unknown print error");
      }
    }
  };

  return (
    <>
      <Script
        src="/epson-epos-sdk.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setMessage("Failed to load Epson ePOS SDK")}
      />
      <main className="max-w-3xl mx-auto p-6 font-sans">
        <h1 className="text-2xl font-bold mb-6 text-center">Label Printing</h1>

        <ul className="list-none p-0 mb-6">
          {itemsData.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <li
                key={item.id}
                className="flex justify-between items-center p-3 border rounded mb-2"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.printedOn && item.expiryDate && (
                      <>
                        Printed On:{" "}
                        {new Date(item.printedOn).toLocaleDateString()} |
                        Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                      </>
                    )}
                  </div>
                  <div className="text-sm mt-1">
                    Ingredients:{" "}
                    {item.ingredients
                      ? item.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className={
                              ALLERGENS.some((a) =>
                                ing.toLowerCase().includes(a)
                              )
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {highlightAllergens(ing)}
                            {i < (item.ingredients?.length ?? 0) - 1
                              ? ", "
                              : ""}
                          </span>
                        ))
                      : "N/A"}
                  </div>
                </div>
                <button
                  onClick={() => toggleSelect(item.id)}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    isSelected
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handlePrint}
          disabled={selectedIds.length === 0 || !printerConnected}
          className={`w-full py-3 rounded font-semibold text-white transition ${
            selectedIds.length === 0 || !printerConnected
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Print Selected ({selectedIds.length})
        </button>

        <div className="mt-6 text-center">
          <span className="font-semibold">Status: </span>
          <span
            className={printerConnected ? "text-green-600" : "text-red-600"}
          >
            {printerConnected ? "Connected" : "Not Connected"}
          </span>
          <div className={printerConnected ? "text-green-600" : "text-red-600"}>
            {message}
          </div>
        </div>
      </main>
    </>
  );
}
