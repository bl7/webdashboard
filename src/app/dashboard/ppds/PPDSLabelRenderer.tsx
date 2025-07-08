import React from "react"

// Custom PPDS label renderer (moved from page.tsx)
export function PPDSLabelRenderer({ item, storageInfo, businessName, allIngredients }: { item: any, storageInfo: string, businessName: string, allIngredients: any[] }) {
  // For each ingredient name, look up the full ingredient object
  const ingredientObjs = (item.ingredients || []).map(function(ing: string) {
    return allIngredients.find((i: any) => i.ingredientName && ing && i.ingredientName.trim().toLowerCase() === ing.trim().toLowerCase());
  });
  // Build allergen summary from all found ingredient objects
  const allAllergens = ingredientObjs.flatMap((ing: any) => (ing?.allergens || []).map((a: any) => a.allergenName?.toUpperCase?.() || "")).filter(Boolean)
  const uniqueAllergens = Array.from(new Set(allAllergens))
  // --- Layout ---
  return (
    <div style={{
      width: '60mm',
      height: '80mm',
      boxSizing: 'border-box',
      padding: '3mm',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, Helvetica, "Liberation Sans", sans-serif',
      color: '#000',
      border: '1px solid #000',
      margin: '0 auto',
      justifyContent: 'flex-start',
    }}>
      {/* Product Title */}
      <div style={{
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '15pt',
        letterSpacing: 0.5,
        marginBottom: '2.5mm',
        textTransform: 'uppercase',
        lineHeight: 1.1,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}>{item.name}</div>
      {/* Ingredients List with allergens inline */}
      <div style={{ fontSize: '9pt', marginBottom: '1.5mm', lineHeight: 1.3, fontWeight: 400 }}>
        <span style={{ fontWeight: 700 }}>Ingredients: </span>
        {ingredientObjs.map((ing: any, idx: number) => {
          const allergenList = (ing?.allergens || []).map((a: any) => a.allergenName?.toUpperCase?.() || "").filter(Boolean)
          return (
            <span key={(ing?.ingredientName || item.ingredients[idx] || "") + idx}>
              {ing?.ingredientName || item.ingredients[idx] || "Unknown"}
              {allergenList.length > 0 && (
                <span style={{ fontWeight: 900 }}>({allergenList.join(', ')})</span>
              )}
              {idx < ingredientObjs.length - 1 ? ', ' : ''}
            </span>
          )
        })}
      </div>
      {/* Allergen Summary Box */}
      {uniqueAllergens.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid #000',
          borderRadius: '6px',
          padding: '1mm 2mm',
          fontSize: '8pt',
          fontWeight: 500,
          marginBottom: '2.5mm',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="9,2 17,16 1,16" stroke="#000" strokeWidth="1.5" fill="#fff" />
              <text x="9" y="13" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000">!</text>
            </svg>
          </span>
          <span>Contains: <span style={{ fontWeight: 600 }}>{uniqueAllergens.join(', ')}</span></span>
        </div>
      )}
      {/* Date Section */}
      <div style={{ fontSize: '8pt', marginBottom: '1mm', fontWeight: 700 }}>
        <div>Packed: {item.printedOn || ''}</div>
        <div>Use By: {item.expiryDate || ''}</div>
      </div>
      {/* Spacer to push storage info and company info to bottom */}
      <div style={{ flex: 1 }} />
      {/* Storage Instruction always just above company name */}
      <div style={{ fontSize: '8pt', marginBottom: '1mm', fontWeight: 400, minHeight: '10px' }}>{storageInfo}</div>
      {/* Preparation Info */}
      <div style={{ fontSize: '7pt', fontWeight: 400 }}>
        Prepared by: <span style={{ fontWeight: 700 }}>{businessName}</span><br />
        <span style={{ fontWeight: 400 }}>www.instalabel.co</span>
      </div>
    </div>
  )
} 