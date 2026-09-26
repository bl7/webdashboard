# Cursor prompt — new InstaLabel PrintBridge (Mac menu bar)

Paste everything below the line into a new, empty Cursor project. Do not point that project at the InstaLabel web dashboard. Do not look for, port, or patch any older PrintBridge. This app does not exist yet.

---

You are building **InstaLabel PrintBridge** from scratch: a macOS menu-bar app that sits in the background on the kitchen Mac and prints labels on printers already installed in macOS.

The InstaLabel website already speaks to this app. You must match the **Mac** contract below. You cannot change the website. The Windows app is a different program and uses a different URL and a different JSON body. Do not build the Windows contract.

## Language and runtime

Use **Swift** on **macOS 13 or newer**.

- One Swift Package or Xcode app. Menu bar only.
- UI: SwiftUI `MenuBarExtra`. No main window. No Dock icon (`LSUIElement` = YES).
- Do not use Electron, Tauri, Node, Python, or a cross-platform UI toolkit.
- HTTP and WebSocket: one small embedded server. **FlyingFox** is the right dependency (HTTP + WebSocket, localhost). Do not add Vapor.
- JSON: `Foundation` `JSONDecoder` / `JSONEncoder`.
- Printers and printing: AppKit `NSPrinter`, `NSPrintInfo`, `NSPrintOperation`. Drawing through Core Graphics with interpolation turned off.
- Do not turn on the App Sandbox. A sandbox blocks the listen socket and the user’s printers. v1 is a local menu-bar tool, not a Mac App Store app.
- Ship a Developer-ID-free debug build first. A `.app` in `~/Applications` that the user launches themselves is enough. No `.pkg` installer in v1.

Why Swift: the Mac print path has to own the raster. Preview, PDFKit “fit to page”, and web wrappers resample the PNG and thermal text goes soft. Core Graphics can size a bitmap to the printer’s real DPI and draw it with no interpolation.

Do not add a database. Do not call the InstaLabel API. This process only talks to the local browser and the local print system.

## What this app is

- A menu-bar process in the **logged-in user session**. Not a LaunchDaemon. A daemon does not see the user’s printers the way a GUI session does.
- Starts at login for the current user with `SMAppService.mainApp` (macOS 13). No admin password.
- Single instance. A second launch does nothing except bounce the existing menu icon.
- Listens only on **127.0.0.1**. Never `0.0.0.0`. Never the LAN.
- Keeps running when the browser closes. Reconnects are the browser’s job.
- Logs to `~/Library/Logs/InstaLabel/PrintBridge/`.

Menu:

- Status: listening or not, and printer count
- List installed printers and which one is the macOS default
- Print a built-in sharpness test label to the default printer
- Open the log folder
- Toggle “start at login”
- Quit

No settings window in v1 beyond that menu.

## Network contract (this is the Mac contract)

The site decides the URL from `navigator.platform`. If that string contains `"mac"` (Chrome and Safari report `MacIntel`), it connects here:

`ws://localhost:8080`

There is **no path**. The upgrade request is `GET /` with `Upgrade: websocket`. It is not `ws://localhost:8080/ws`. That `/ws` URL is Windows only. A Mac browser will never open it.

There is no login, no token, no query string, and no hello message from the browser. On a successful WebSocket open, **you send first**.

### Same port, two kinds of request on `/`

Port **8080**, bind **127.0.0.1**, path **`/`** only.

| Request | What to do |
|---|---|
| `GET /` with header `Upgrade: websocket` | Accept the print socket |
| `GET /` with no upgrade (normal browser navigation) | Return HTTP **200** and a short page: “InstaLabel PrintBridge is running.” |
| Anything else | 404 |

The site’s “Test Connection” button, on Mac and Windows, opens `http://localhost:8080/` in a new tab. That is the normal GET. The print socket is a WebSocket upgrade on that **same URL**. If you only implement WebSocket and the GET returns an error, the test button looks broken. If you only implement the HTML page, the dashboard never connects.

Reject `/ws` with 404. Do not listen on port 9100.

### 1. Printer list, sent immediately on connect

```json
{
  "type": "connection",
  "printers": ["Brother QL-820NWB", "HP LaserJet"],
  "defaultPrinter": "Brother QL-820NWB"
}
```

- `printers` is an array of **strings**. Each string is the exact name from `NSPrinter.printerNames()`. The site displays these strings and sends the same string back as `selectedPrinter`.
- `defaultPrinter` is the current default printer name, and it must also appear in `printers`.
- `type` must be `"connection"`.
- If there are no printers, send `"printers": []` and set `defaultPrinter` to `""`.
- The site does not send a “list printers” command. This first frame is how it learns the printers.

### 2. Print job, browser → you

One WebSocket **text** frame. JSON:

```json
{
  "type": "print",
  "images": ["iVBORw0KGgoAAA..."],
  "labelWidth": 60,
  "labelHeight": 40,
  "selectedPrinter": "Brother QL-820NWB"
}
```

| Field | Type | Meaning |
|---|---|---|
| `type` | string | Always `"print"`. If it is missing or not `"print"`, reply with failure and do not print. |
| `images` | array of strings | PNG bytes, **base64 only**. No `data:image/png;base64,` prefix. The site strips that prefix before sending. If a prefix is still there, strip it. The array usually has **one** image. Print every entry, in order, as its own label. |
| `labelWidth` | number | Label width in millimetres. This is the box the site drew, not a guess. |
| `labelHeight` | number | Label height in millimetres. |
| `selectedPrinter` | string, optional | Exact name from your printer list. If missing or unknown, use the macOS default printer. |

The site does **not** send `copies`, ZPL, TSPL, ESC/POS, or PDF. There is no `image` field (that name is the Windows body). Use `labelWidth` and `labelHeight`. Do not invent a different size.

Quantity is already expanded: 3 copies means 3 separate messages. Print each message once.

Jobs can arrive back-to-back. The site does **not** wait for your reply before sending the next job. Queue them and print in order on one print thread. Never show the macOS print panel or a progress dialog (`showsPrintPanel = false`, `showsProgressPanel = false`).

### 3. How big the label is

`labelWidth` and `labelHeight` are the physical box in millimetres. Use those numbers as the paper size. The PNG’s own DPI metadata is wrong (it is a browser screenshot). Ignore it.

The site sends one of these:

| Label | `labelWidth` × `labelHeight` |
|---|---|
| Kitchen 40mm | **60 × 40** |
| Kitchen 80mm | **60 × 80** |
| PPDS | **56 × 80** |
| Round sticker | **50 × 50** |

### 4. Print result, you → browser

After each job (success or failure):

```json
{
  "success": true,
  "printerName": "Brother QL-820NWB"
}
```

```json
{
  "success": false,
  "printerName": "Brother QL-820NWB",
  "errorMessage": "Printer is offline"
}
```

`success` is required. The site treats any JSON object that contains `success` as the job result.

For a connection-level failure you may also send:

```json
{ "type": "error", "message": "No printers installed" }
```

### 5. Browser security headers

The page may be `https://www.instalabel.co` talking to `ws://127.0.0.1:8080`. Chrome treats that as a private-network request.

On the WebSocket handshake and on the plain `GET /`, if the request asks for private-network access, respond with:

- `Access-Control-Allow-Private-Network: true`
- `Access-Control-Allow-Origin` set to the request `Origin`, or `*` if there is none

Bind to loopback so the Mac firewall stays quiet.

## What the bitmaps look like

The site draws the label in the browser and sends that PNG. A typical kitchen label is on the order of 600–1000 px on the long side. A sticker is larger. A 203 DPI head needs about 480×320 dots for a 60×40 mm label; a 300 DPI head needs about 709×472. You will often upscale. That upscale must be nearest-neighbour, then a hard black/white threshold.

Flatten any alpha onto white before printing.

## Sharp printing

Thermal text goes fuzzy if Core Graphics or the driver resamples with interpolation. Do not do that.

For every image in `images`:

1. Base64-decode. Decode the PNG. Flatten onto white.
2. Read `labelWidth` and `labelHeight` in millimetres.
3. Choose the printer (`selectedPrinter`, else the default).
4. Read the printer’s horizontal and vertical DPI from the print resolution (label printers are usually 203 or 300).
5. Target dots:
   - `dotsX = round(widthMm / 25.4 * dpiX)`
   - `dotsY = round(heightMm / 25.4 * dpiY)`
6. Draw the source into a bitmap of exactly `dotsX` × `dotsY` with `CGInterpolationQuality.none`. No high-quality interpolation. No `NSImageInterpolation.high`.
7. Threshold to black and white. Luminance below 200 becomes black, otherwise white. Labels are line art and text. Do not dither. Do not leave gray pixels for the driver.
8. Paper size in points (72 points per inch): `widthPt = widthMm / 25.4 * 72`, same for height. Set that as the custom `paperSize`. Margins all 0. Do not leave the job on A4 or US Letter.
9. Draw that pre-sized bitmap 1:1 into the page. Destination size in dots equals `dotsX` × `dotsY`. If the driver reports a hard unprintable margin, shift the origin and log the margin. Do not “fit to page” with a smooth scale.
10. One page per image. Then send the result JSON.

Forbidden:

- `CGInterpolationQuality.high` or `.medium`, or the default interpolation
- Printing via Preview, PDF scale-to-fit, HTML, or a screenshot
- Letting CUPS scale a small PNG up to the label
- JPEG

Log every job: time, printer name, source pixel size, JSON millimetres, printer DPI, target dots, paper size, success or the error text.

## Menu-bar test label

“Print sharpness test” must not use the website. Draw a bitmap at the printer’s native DPI for a 60×40 mm page:

- a 2-dot black/white checker in one corner
- horizontal and vertical 1-dot rules
- the text `PRINTBRIDGE` in hard black pixels, no grayscale antialiasing

If the checker prints as gray mush, the pipeline is still resampling. Fix that before anything else.

## Project shape

Keep it small:

- `PrintBridgeApp.swift` — `MenuBarExtra`, single-instance check, start the server
- `MenuCommands.swift` — the menu
- `BridgeServer.swift` — FlyingFox on `127.0.0.1:8080`, GET `/` page, WebSocket upgrade on `/`
- `Messages.swift` — the JSON shapes above
- `PrinterCatalog.swift` — `NSPrinter.printerNames()` and the default
- `JobQueue.swift` — one print thread, FIFO
- `LabelPrinter.swift` — millimetre size from the JSON, raster steps, silent `NSPrintOperation`
- `LoginItem.swift` — `SMAppService`

No plugin system, no updater, no installer project in v1.

## Behaviour details

- If port 8080 is taken, show a menu error: “Port 8080 is already in use.” Do not quit silently.
- If the socket drops, drop that client. Keep listening.
- Bad JSON: reply `success: false` with `errorMessage`. Do not drop the socket unless the frame is unreadable.
- Cap a frame at 8 MB.
- Printer names match `NSPrinter` names. Trim whitespace only.
- Do not change the user’s default printer as a side effect of a job.
- WebSocket frames are text JSON, not binary.

## Done when

1. A menu-bar icon is visible, with no Dock icon and no window.
2. A browser can open `ws://127.0.0.1:8080` (no `/ws`) and immediately receive the printer-list JSON.
3. `http://127.0.0.1:8080/` in a normal tab returns 200 and the short running page.
4. `ws://127.0.0.1:8080/ws` does not accept a socket.
5. Sending the print JSON above prints one label on `selectedPrinter`, at the millimetre size in the JSON, with hard edges.
6. Two jobs sent back-to-back both print, in order.
7. An unknown printer name falls back to the default, and the result JSON names the printer that was used.
8. A second launch does not start a second listener.
9. Quit from the menu stops the listener and releases port 8080.
