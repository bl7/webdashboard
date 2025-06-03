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
  printedOn: string; // Added
  expiryDate: string; // Added
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
  {
    id: 1,
    name: "Milk",
    allergens: ["milk"],
    printedOn: "2025-06-01",
    expiryDate: "2025-08-01",
  },
  {
    id: 2,
    name: "Eggs",
    allergens: ["eggs"],
    printedOn: "2025-06-02",
    expiryDate: "2025-07-02",
  },
  {
    id: 3,
    name: "Wheat Flour",
    allergens: ["wheat"],
    printedOn: "2025-06-01",
    expiryDate: "2025-12-01",
  },
  {
    id: 4,
    name: "Sugar",
    allergens: [],
    printedOn: "2025-06-01",
    expiryDate: "2025-12-31",
  },
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

// Check if an ingredient is allergenic by itself
function isAllergenic(ingredient: IngredientItem): boolean {
  return ingredient.allergens.length > 0;
}

// --- Bluetooth Web API typings ---
declare global {
  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject
    ): void;
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(serviceUUID: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(
      characteristicUUID: string
    ): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    writeValue(data: ArrayBuffer): Promise<void>;
  }
}

export default function LabelPrinter() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<TabType>("ingredients");
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([]);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Epson USB/Network printer global (from ePOS SDK)
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
  const [epsonPrinter, setEpsonPrinter] = useState<EpsonDevice | null>(null);

  // Bluetooth printer state
  const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null);
  const [btServer, setBtServer] = useState<BluetoothRemoteGATTServer | null>(
    null
  );
  const [isBtConnecting, setIsBtConnecting] = useState(false);
  const [isBtSending, setIsBtSending] = useState(false);

  // --- Epson USB/Network Printer Initialization ---
  const printCallback = useCallback(
    (deviceObj: EpsonDevice | null, errorCode: number) => {
      if (deviceObj) {
        setEpsonPrinter(deviceObj);
        setPrinterConnected(true);
        setMessage("USB/Network printer connected");
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

  const initializeEpsonPrinter = useCallback(() => {
    try {
      if (window.epson && window.epson.ePOSDevice) {
        window.epsonPrinter = new window.epson.ePOSDevice();
        window.epsonPrinter.connect("localhost", 8008, connectCallback);
        setMessage("Initializing USB/Network printer connection...");
      } else {
        setMessage("Epson ePOS SDK not loaded");
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
      initializeEpsonPrinter();
    }
    return () => {
      if (window.epsonPrinter) {
        window.epsonPrinter.disconnect();
      }
    };
  }, [scriptLoaded, initializeEpsonPrinter]);

  // --- Bluetooth Printer Functions ---

  // Scan and connect to Bluetooth printer
  async function scanAndConnectBluetooth() {
    setMessage(null);
    setIsBtConnecting(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"], // Epson TM-m30 service UUID
      });
      setBtDevice(device);

      if (!device.gatt) throw new Error("No GATT server available on device");

      const server = await device.gatt.connect();
      setBtServer(server);

      device.addEventListener("gattserverdisconnected", () => {
        setMessage("Bluetooth device disconnected");
        setBtDevice(null);
        setBtServer(null);
      });

      setMessage("Bluetooth printer connected");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Bluetooth connection failed: ${error.message}`);
      } else {
        setMessage("Bluetooth connection failed: Unknown error");
      }
    } finally {
      setIsBtConnecting(false);
    }
  }

  // Send data to Bluetooth printer
  async function sendDataBluetooth(data: Uint8Array) {
    if (!btServer) {
      setMessage("No Bluetooth device connected");
      return;
    }
    setIsBtSending(true);
    try {
      const serviceUUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
      const characteristicUUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

      const service = await btServer.getPrimaryService(serviceUUID);
      const characteristic = await service.getCharacteristic(
        characteristicUUID
      );

      await characteristic.writeValue(data.buffer as ArrayBuffer);

      setMessage("Data sent to Bluetooth printer");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Send failed: ${error.message}`);
      } else {
        setMessage("Send failed: Unknown error");
      }
    } finally {
      setIsBtSending(false);
    }
  }

  // --- Print Functions ---

  // Print via Epson USB/Network printer
  const handleEpsonPrint = () => {
    if (!epsonPrinter) {
      setMessage("USB/Network printer not connected");
      return;
    }
    if (printQueue.length === 0) {
      setMessage("No items to print");
      return;
    }
    try {
      printQueue.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          epsonPrinter.addTextAlign(epsonPrinter.ALIGN_CENTER);
          epsonPrinter.addTextSize(1, 1);
          epsonPrinter.addText(`${item.name}\n`);
          epsonPrinter.addTextAlign(epsonPrinter.ALIGN_LEFT);
          epsonPrinter.addTextSize(1, 1);

          if (item.type === "ingredients" && item.allergens?.length) {
            epsonPrinter.addText(
              "Allergens: " + item.allergens.join(", ") + "\n"
            );
          } else if (item.type === "menu" && item.ingredients?.length) {
            const tooLong = item.ingredients.length > MAX_INGREDIENTS_TO_FIT;
            if (tooLong) {
              const allergensInIngredients = item.ingredients
                .map((ing) => ing.toLowerCase())
                .filter((ing) => ALLERGENS.includes(ing));
              if (allergensInIngredients.length > 0) {
                epsonPrinter.addText(
                  "Allergens: " + allergensInIngredients.join(", ") + "\n"
                );
              }
            } else {
              epsonPrinter.addText(
                "Ingredients: " + item.ingredients.join(", ") + "\n"
              );
            }
          }

          // Now both ingredients and menu items have dates
          if (item.printedOn && item.expiryDate) {
            epsonPrinter.addText(
              `Printed On: ${new Date(
                item.printedOn
              ).toLocaleDateString()} | Expiry: ${new Date(
                item.expiryDate
              ).toLocaleDateString()}\n`
            );
          }
          epsonPrinter.addFeedLine(2);
          epsonPrinter.addCut(epsonPrinter.CUT_FEED);
        }
      });
      epsonPrinter.send();
      setMessage("USB/Network print job sent");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Print error: ${error.message}`);
      } else {
        setMessage("Unknown print error");
      }
    }
  };

  // Prepare and send label data over Bluetooth
  async function printLabelOverBluetooth(item: PrintQueueItem) {
    const encoder = new TextEncoder();
    let lines = `${item.name}\n`;

    if (item.type === "ingredients" && item.allergens?.length) {
      lines += `Allergens: ${item.allergens.join(", ")}\n`;
    } else if (item.type === "menu" && item.ingredients?.length) {
      const tooLong = item.ingredients.length > MAX_INGREDIENTS_TO_FIT;
      if (tooLong) {
        const allergensInIngredients = item.ingredients
          .map((ing) => ing.toLowerCase())
          .filter((ing) => ALLERGENS.includes(ing));
        if (allergensInIngredients.length > 0) {
          lines += `Allergens: ${allergensInIngredients.join(", ")}\n`;
        }
      } else {
        lines += `Ingredients: ${item.ingredients.join(", ")}\n`;
      }
    }

    // Now both ingredients and menu items have dates
    if (item.printedOn && item.expiryDate) {
      lines += `Printed On: ${new Date(
        item.printedOn
      ).toLocaleDateString()} | Expiry: ${new Date(
        item.expiryDate
      ).toLocaleDateString()}\n`;
    }

    const textBytes = encoder.encode(lines);
    const cutBytes = new Uint8Array([0x1d, 0x56, 0x01]); // GS V 1 cut command
    const data = new Uint8Array(textBytes.length + cutBytes.length);
    data.set(textBytes, 0);
    data.set(cutBytes, textBytes.length);

    await sendDataBluetooth(data);
  }

  // Print all labels via Bluetooth
  async function handleBluetoothPrint() {
    if (!btServer) {
      setMessage("Bluetooth printer not connected");
      return;
    }
    if (printQueue.length === 0) {
      setMessage("No items to print");
      return;
    }
    for (const item of printQueue) {
      for (let i = 0; i < item.quantity; i++) {
        await printLabelOverBluetooth(item);
      }
    }
    setMessage("Bluetooth print job sent");
  }

  // --- Print Queue Management ---

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
            printedOn: ingredientItem.printedOn, // Added
            expiryDate: ingredientItem.expiryDate, // Added
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

  const removeFromPrintQueue = (id: number, type: TabType) => {
    setPrintQueue((prev) =>
      prev.filter((q) => !(q.id === id && q.type === type))
    );
  };

  const updateQuantity = (id: number, type: TabType, quantity: number) => {
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.id === id && q.type === type
          ? { ...q, quantity: Math.max(1, quantity) }
          : q
      )
    );
  };

  // --- JSX ---

  return (
    <>
      {/* Epson ePOS SDK script */}
      <Script
        src="/epson-epos-sdk.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setMessage("Failed to load Epson ePOS SDK")}
      />

      <main className=" max-w-5xl mx-auto p-6 font-sans">
        <div className="flex flex-col md:flex-row items-center md:items-start text-sm mt-4 md:mt-0 space-y-3 md:space-y-0 md:space-x-6 border-b-2 border-black p-5">
          {/* USB/Network Status */}
          <div className="flex flex-col items-start space-y-0.5 min-w-[160px]">
            <span className="font-semibold">USB/Network Status:</span>
            <span
              className={printerConnected ? "text-green-600" : "text-red-600"}
            >
              {printerConnected ? "Connected" : "Not Connected"}
            </span>
          </div>

          {/* Bluetooth Status */}
          <div className="flex flex-col items-start space-y-0.5 min-w-[160px]">
            <span className="font-semibold">Bluetooth Status:</span>
            <span className={btDevice ? "text-green-600" : "text-red-600"}>
              {btDevice
                ? `Connected to ${btDevice.name ?? btDevice.id}`
                : "Not Connected"}
            </span>
          </div>

          {/* Message */}
          <div className="flex-1 text-left md:text-left text-gray-700">
            {message}
          </div>

          {/* Bluetooth Connect Button */}
          <button
            onClick={scanAndConnectBluetooth}
            disabled={isBtConnecting || btDevice !== null}
            className={`px-4 py-2 rounded font-semibold text-white transition whitespace-nowrap ${
              !btDevice && !isBtConnecting
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isBtConnecting
              ? "Connecting..."
              : btDevice
              ? "Connected"
              : "Connect Bluetooth"}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 p-5 text-center">
          Print Labels
        </h1>
        {/* Tabs */}
        <div className="flex border-b-2 border-black p-5 mb-6">
          <div
            onClick={() => setActiveTab("ingredients")}
            className={`flex-1 text-center py-4 font-semibold text-lg rounded-t-lg cursor-pointer transition
      ${
        activeTab === "ingredients"
          ? "bg-gray-300 border-b-4 border-gray-400 shadow-inner"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
          >
            Ingredients
          </div>
          <div
            onClick={() => setActiveTab("menu")}
            className={`flex-1 text-center py-4 font-semibold text-lg rounded-t-lg cursor-pointer transition
      ${
        activeTab === "menu"
          ? "bg-gray-300 border-b-4 border-gray-400 shadow-inner"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
          >
            Menu Items
          </div>
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
                  const isIngredientAllergenic =
                    activeTab === "ingredients" &&
                    isAllergenic(item as IngredientItem);
                  return (
                    <li
                      key={item.id}
                      className={`flex justify-between items-center p-3 border rounded shadow-sm hover:shadow-md transition ${
                        isIngredientAllergenic ? "border-red-300 bg-red-50" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {item.name}
                          {isIngredientAllergenic && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              ⚠ ALLERGEN
                            </span>
                          )}
                        </div>
                        {activeTab === "ingredients" &&
                          (item as IngredientItem).allergens.length > 0 && (
                            <div className="text-xs text-red-600 mt-1">
                              Contains:{" "}
                              {(item as IngredientItem).allergens.join(", ")}
                            </div>
                          )}
                      </div>
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

        {/* Label Preview */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Label Preview</h2>
          {printQueue.length === 0 ? (
            <p className="text-gray-500">Select items to preview labels.</p>
          ) : (
            <div
              className="flex flex-wrap gap-[1mm]"
              style={{ backgroundColor: "#f9fafb", padding: "4px" }}
            >
              {printQueue.map((item) => {
                const tooLong =
                  (item.ingredients?.length ?? 0) > MAX_INGREDIENTS_TO_FIT;
                const allergens =
                  item.type === "menu" && item.ingredients
                    ? item.ingredients
                        .map((ing) => ing.toLowerCase())
                        .filter((ing) => ALLERGENS.includes(ing))
                    : item.allergens ?? [];

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    style={{
                      width: "5.5cm",
                      height: "3.1cm",
                      border: "1px solid #ccc",
                      padding: "6px",
                      fontSize: "10px",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      boxSizing: "border-box",
                      backgroundColor: "white",
                    }}
                  >
                    <div className="font-bold text-sm mb-1">{item.name}</div>
                    {item.printedOn && item.expiryDate && (
                      <div className="text-xs mb-1">
                        Printed On:{" "}
                        {new Date(item.printedOn).toLocaleDateString()} |
                        Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="text-xs">
                      {item.type === "ingredients" && item.allergens?.length ? (
                        <>
                          <b>Allergens:</b>{" "}
                          {item.allergens.map((a, i) => (
                            <span
                              key={a}
                              className="text-red-600 font-semibold"
                            >
                              {a}
                              {i < item.allergens!.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </>
                      ) : tooLong && allergens.length > 0 ? (
                        <>
                          <b>Allergens:</b>{" "}
                          {allergens.map((a, i) => (
                            <span
                              key={a}
                              className="text-red-600 font-semibold"
                            >
                              {a}
                              {i < allergens.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </>
                      ) : (
                        <>
                          <b>Ingredients:</b>{" "}
                          {(item.ingredients ?? []).map((ing, i) => (
                            <span key={i}>
                              {highlightAllergens(ing)}
                              {i < (item.ingredients?.length ?? 0) - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Print Buttons & Status */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <button
            disabled={!printerConnected || printQueue.length === 0}
            onClick={handleEpsonPrint}
            className={`px-6 py-3 rounded font-semibold text-white transition ${
              printerConnected && printQueue.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Print All via USB/Network (
            {printQueue.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <div className="flex space-x-2 items-center">
            <button
              onClick={handleBluetoothPrint}
              disabled={!btDevice || printQueue.length === 0 || isBtSending}
              className={`px-6 py-3 rounded font-semibold text-white transition ${
                btDevice && printQueue.length > 0 && !isBtSending
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isBtSending
                ? "Printing..."
                : `Print All via Bluetooth (${printQueue.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )})`}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
