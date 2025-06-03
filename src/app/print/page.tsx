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

type TabType = "ingredients" | "menu";

type IngredientItem = {
  id: number;
  name: string;
  allergens: string[];
};

type MenuItem = {
  id: number;
  name: string;
  printedOn: string;
  expiryDate: string;
  ingredients: string[];
};

type PrintQueueItem = {
  id: number;
  type: TabType;
  name: string;
  quantity: number;
  allergens?: string[];
  ingredients?: string[];
  printedOn?: string;
  expiryDate?: string;
};

const INGREDIENTS: IngredientItem[] = [
  { id: 1, name: "Milk", allergens: ["milk"] },
  { id: 2, name: "Eggs", allergens: ["eggs"] },
  { id: 3, name: "Wheat Flour", allergens: ["wheat"] },
  { id: 4, name: "Sugar", allergens: [] },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: 101,
    name: "Pancake",
    printedOn: "2025-06-01",
    expiryDate: "2025-12-01",
    ingredients: ["Milk", "Eggs", "Wheat Flour", "Sugar"],
  },
  {
    id: 102,
    name: "Omelette",
    printedOn: "2025-05-15",
    expiryDate: "2025-11-15",
    ingredients: ["Eggs", "Milk"],
  },
  {
    id: 103,
    name: "Toast",
    printedOn: "2025-06-02",
    expiryDate: "2025-12-02",
    ingredients: ["Wheat Flour", "Milk"],
  },
];

const MAX_INGREDIENTS_TO_FIT = 6;

// Highlight allergens in ingredient text (used in preview)
function highlightAllergens(ingredient: string) {
  const lower = ingredient.toLowerCase();
  for (const allergen of ALLERGENS) {
    if (lower.includes(allergen)) {
      const regex = new RegExp(`(${allergen})`, "gi");
      const parts = ingredient.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-red-600 font-semibold">
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

export default function LabelPrinter() {
  const [activeTab, setActiveTab] = useState<TabType>("ingredients");
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([]);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

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

  const printCallback = useCallback(
    (deviceObj: EpsonDevice | null, errorCode: number) => {
      if (deviceObj) {
        window.printer = deviceObj;
        setPrinterConnected(true);
        setMessage("Printer connected successfully");
      } else {
        setPrinterConnected(false);
        setMessage(`Failed to create printer device: ${errorCode}`);
      }
    },
    []
  );

  const connectCallback = useCallback(
    (resultConnect: string) => {
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
    },
    [printCallback]
  );

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

  // Add item to print queue
  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    setPrintQueue((prev) => {
      if (prev.some((q) => q.id === item.id && q.type === type)) return prev;

      if (type === "ingredients") {
        const ingredientItem = item as IngredientItem;
        return [
          ...prev,
          {
            id: ingredientItem.id,
            type,
            name: ingredientItem.name,
            quantity: 1,
            allergens: ingredientItem.allergens,
          },
        ];
      } else {
        const menuItem = item as MenuItem;
        return [
          ...prev,
          {
            id: menuItem.id,
            type,
            name: menuItem.name,
            quantity: 1,
            ingredients: menuItem.ingredients,
            printedOn: menuItem.printedOn,
            expiryDate: menuItem.expiryDate,
          },
        ];
      }
    });
  };

  // Remove item from print queue
  const removeFromPrintQueue = (id: number, type: TabType) => {
    setPrintQueue((prev) =>
      prev.filter((q) => !(q.id === id && q.type === type))
    );
  };

  // Update quantity
  const updateQuantity = (id: number, type: TabType, quantity: number) => {
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.id === id && q.type === type
          ? { ...q, quantity: Math.max(1, quantity) }
          : q
      )
    );
  };

  // Print handler
  const handlePrint = () => {
    if (!printerConnected) {
      setMessage("Printer not connected");
      return;
    }
    if (printQueue.length === 0) {
      setMessage("No items selected");
      return;
    }
    try {
      const printer: EpsonDevice = window.printer;
      printQueue.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          printer.addTextAlign(printer.ALIGN_CENTER);
          printer.addTextSize(1, 1);
          printer.addText(`${item.name}\n`);
          printer.addTextAlign(printer.ALIGN_LEFT);
          printer.addTextSize(1, 1);

          if (item.type === "ingredients" && item.allergens?.length) {
            printer.addText("Allergens: " + item.allergens.join(", ") + "\n");
          } else if (item.type === "menu" && item.ingredients?.length) {
            // Decide if ingredients list is too long
            const tooLong = item.ingredients.length > MAX_INGREDIENTS_TO_FIT;
            if (tooLong) {
              // Print only allergens found in ingredients
              const allergensInIngredients = item.ingredients
                .map((ing) => ing.toLowerCase())
                .filter((ing) => ALLERGENS.includes(ing));
              if (allergensInIngredients.length > 0) {
                printer.addText(
                  "Allergens: " + allergensInIngredients.join(", ") + "\n"
                );
              }
            } else {
              printer.addText(
                "Ingredients: " + item.ingredients.join(", ") + "\n"
              );
            }
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
        }
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
      <main className="max-w-5xl mx-auto p-6 font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center">Label Printing</h1>
        <div className=" flex items-centertext-sm">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={printerConnected ? "text-green-600" : "text-red-600"}
          >
            {printerConnected ? "Connected" : "Not Connected"}
          </span>
          <div className={printerConnected ? "text-green-600" : "text-red-600"}>
            {message}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-300 mb-6">
          <button
            className={`pb-2 font-semibold ${
              activeTab === "ingredients"
                ? "border-b-4 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("ingredients")}
          >
            Ingredients
          </button>
          <button
            className={`pb-2 font-semibold ${
              activeTab === "menu"
                ? "border-b-4 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            Menu Items
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item List */}
          <div>
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {activeTab}
            </h2>
            <ul className="space-y-3 max-h-[350px] overflow-auto border rounded p-4">
              {(activeTab === "ingredients" ? INGREDIENTS : MENU_ITEMS).map(
                (item) => {
                  const inQueue = printQueue.some(
                    (q) => q.id === item.id && q.type === activeTab
                  );
                  return (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-3 border rounded shadow-sm hover:shadow-md transition"
                    >
                      <div className="font-medium">{item.name}</div>
                      <button
                        disabled={inQueue}
                        onClick={() => addToPrintQueue(item, activeTab)}
                        className={`px-3 py-1 rounded text-sm font-semibold transition ${
                          inQueue
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {inQueue ? "Added" : "Add"}
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
          </div>

          {/* Print Queue */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Print Queue</h2>
            {printQueue.length === 0 ? (
              <p className="text-gray-500">No items selected for printing.</p>
            ) : (
              <ul className="space-y-3 max-h-[350px] overflow-auto border rounded p-4">
                {printQueue.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between p-3 border rounded shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {item.type}
                      </span>
                      {/* Allergens badges */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.allergens.map((a) => (
                            <span
                              key={a}
                              className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Ingredients badges for menu items */}
                      {item.type === "menu" && item.ingredients && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                            >
                              {highlightAllergens(ing)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            item.type,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 text-center border rounded px-2 py-1 focus:outline-indigo-500"
                      />
                      <button
                        onClick={() => removeFromPrintQueue(item.id, item.type)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        aria-label={`Remove ${item.name} from print queue`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Print Button & Status */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <button
            disabled={!printerConnected || printQueue.length === 0}
            onClick={handlePrint}
            className={`px-6 py-3 rounded font-semibold text-white transition ${
              printerConnected && printQueue.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Print All (
            {printQueue.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <div className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={printerConnected ? "text-green-600" : "text-red-600"}
            >
              {printerConnected ? "Connected" : "Not Connected"}
            </span>
            <div
              className={printerConnected ? "text-green-600" : "text-red-600"}
            >
              {message}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
