// Square API Structure Guide
// Based on Square Catalog API documentation

// ============================================================================
// SQUARE CATALOG STRUCTURE
// ============================================================================

// Square Catalog Object Types:
// - ITEM: Menu items, products
// - ITEM_VARIATION: Different versions of items (sizes, flavors, etc.)
// - CATEGORY: Groups for organizing items
// - MODIFIER: Add-ons, toppings, customizations, INGREDIENTS
// - MODIFIER_LIST: Groups of modifiers
// - TAX: Tax information
// - DISCOUNT: Discount information
// - PRICING_RULE: Special pricing rules

// ============================================================================
// MENU ITEMS (ITEMS) - Square's Primary Structure
// ============================================================================

export interface SquareMenuItem {
  type: 'ITEM'
  id: string
  item_data: {
    name: string
    description?: string
    category_id?: string
    variations: SquareItemVariation[]
    custom_attribute_values?: SquareCustomAttribute[]
    image_ids?: string[]
    is_taxable?: boolean
    tax_ids?: string[]
    modifier_list_info?: SquareModifierListInfo[]
  }
}

export interface SquareItemVariation {
  type: 'ITEM_VARIATION'
  id: string
  item_variation_data: {
    name: string
    description?: string
    pricing_type: 'FIXED_PRICING' | 'VARIABLE_PRICING'
    price_money?: {
      amount: number
      currency: string
    }
    track_inventory?: boolean
    inventory_alert_type?: 'LOW_QUANTITY' | 'NONE'
    inventory_alert_threshold?: number
    item_option_values?: SquareItemOptionValue[]
    measurement_unit_data?: SquareMeasurementUnitData
    custom_attribute_values?: SquareCustomAttribute[]
  }
}

// ============================================================================
// INGREDIENTS AS MODIFIERS - Proper Square Structure
// ============================================================================

export interface SquareModifier {
  type: 'MODIFIER'
  id: string
  modifier_data: {
    name: string
    description?: string
    price_money?: {
      amount: number
      currency: string
    }
    ordinal?: number
    modifier_list_id?: string
    custom_attribute_values?: SquareCustomAttribute[]
  }
}

export interface SquareModifierList {
  type: 'MODIFIER_LIST'
  id: string
  modifier_list_data: {
    name: string
    description?: string
    selection_type: 'SINGLE' | 'MULTIPLE'
    modifiers?: SquareModifier[]
    ordinal?: number
    image_ids?: string[]
  }
}

// ============================================================================
// CATEGORIES - For Organizing Items
// ============================================================================

export interface SquareCategory {
  type: 'CATEGORY'
  id: string
  category_data: {
    name: string
    description?: string
    image_ids?: string[]
  }
}

// ============================================================================
// CUSTOM ATTRIBUTES - For Dietary Restrictions & Additional Info
// ============================================================================

export interface SquareCustomAttribute {
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'SELECTION'
  name: string
  string_value?: string
  number_value?: number
  boolean_value?: boolean
  selection_uid?: string
}

// ============================================================================
// DIETARY RESTRICTIONS - Square's Built-in System
// ============================================================================

export type SquareDietaryRestriction = 
  | 'GLUTEN_FREE'
  | 'DAIRY_FREE' 
  | 'NUT_FREE'
  | 'EGG_FREE'
  | 'SOY_FREE'
  | 'FISH_FREE'
  | 'SHELLFISH_FREE'
  | 'WHEAT_FREE'
  | 'PEANUT_FREE'
  | 'SESAME_FREE'
  | 'SULFITE_FREE'
  | 'CELERY_FREE'
  | 'MUSTARD_FREE'
  | 'LUPIN_FREE'
  | 'MOLLUSC_FREE'

// ============================================================================
// MEASUREMENT UNITS - For Ingredients
// ============================================================================

export interface SquareMeasurementUnitData {
  precision: number
  measurement_unit: {
    type: 'TYPE_CUSTOM' | 'TYPE_AREA' | 'TYPE_LENGTH' | 'TYPE_VOLUME' | 'TYPE_GENERIC'
    custom_unit_id?: string
    name?: string
    abbreviation?: string
  }
}

// ============================================================================
// INVENTORY TRACKING - For Ingredients
// ============================================================================

export interface SquareInventoryData {
  catalog_object_id: string
  location_id: string
  quantity: string
  state: 'IN_STOCK' | 'SOLD' | 'RETURNED_BY_CUSTOMER' | 'RESERVED_FOR_SALE' | 'SOLD_ONLINE' | 'ORDERED_FROM_VENDOR' | 'RECEIVED_FROM_VENDOR' | 'IN_TRANSIT_TO' | 'NONE' | 'SOLD_ONLINE_RETURNED_BY_CUSTOMER'
  calculated_at?: string
}

// ============================================================================
// PRICING - For Menu Items
// ============================================================================

export interface SquarePriceMoney {
  amount: number // Amount in smallest currency unit (e.g., cents)
  currency: string // ISO currency code (e.g., 'USD')
}

// ============================================================================
// MODIFIERS - For Customizations
// ============================================================================

export interface SquareModifierListInfo {
  modifier_list_id: string
  modifier_overrides?: SquareModifierOverride[]
  min_selected_modifiers?: number
  max_selected_modifiers?: number
  enabled?: boolean
}

export interface SquareModifierOverride {
  modifier_id: string
  on_by_default?: boolean
  ordinal?: number
}

// ============================================================================
// ITEM OPTIONS - For Variations
// ============================================================================

export interface SquareItemOptionValue {
  item_option_id: string
  item_option_value_id: string
}

// ============================================================================
// API RESPONSE STRUCTURES
// ============================================================================

export interface SquareCatalogResponse {
  objects: SquareCatalogObject[]
  cursor?: string
  errors?: SquareError[]
}

export interface SquareCatalogObject {
  type: string
  id: string
  updated_at: string
  created_at: string
  version: number
  is_deleted: boolean
  catalog_v1_ids?: SquareCatalogV1Id[]
  present_at_all_locations?: boolean
  present_at_location_ids?: string[]
  absent_at_location_ids?: string[]
  item_data?: any
  category_data?: any
  item_variation_data?: any
  modifier_list_data?: any
  modifier_data?: any
  tax_data?: any
  discount_data?: any
  pricing_rule_data?: any
  product_set_data?: any
  subscription_plan_data?: any
  time_period_data?: any
  measurement_unit_data?: any
  item_option_data?: any
  item_option_value_data?: any
  custom_attribute_definition_data?: any
  quick_amounts_settings_data?: any
  subscription_plan_variation_data?: any
}

export interface SquareError {
  category: string
  code: string
  detail: string
}

export interface SquareCatalogV1Id {
  catalog_v1_id: string
  location_id: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create a Square item with proper structure
export function createSquareItem(
  name: string,
  description: string,
  categoryId?: string,
  customAttributes?: SquareCustomAttribute[],
  variations?: SquareItemVariation[]
): SquareMenuItem {
  return {
    type: 'ITEM',
    id: `#item_${Date.now()}`,
    item_data: {
      name,
      description,
      category_id: categoryId,
      variations: variations || [{
        type: 'ITEM_VARIATION',
        id: `#variation_${Date.now()}`,
        item_variation_data: {
          name: 'Regular',
          pricing_type: 'VARIABLE_PRICING'
        }
      }],
      custom_attribute_values: customAttributes || []
    }
  }
}

// Create a Square category
export function createSquareCategory(name: string, description?: string): SquareCategory {
  return {
    type: 'CATEGORY',
    id: `#category_${Date.now()}`,
    category_data: {
      name,
      description
    }
  }
}

// Create a Square modifier (ingredient)
export function createSquareModifier(
  name: string,
  description?: string,
  customAttributes?: SquareCustomAttribute[]
): SquareModifier {
  return {
    type: 'MODIFIER',
    id: `#modifier_${Date.now()}`,
    modifier_data: {
      name,
      description,
      custom_attribute_values: customAttributes || []
    }
  }
}

// Create a Square modifier list (ingredient group)
export function createSquareModifierList(
  name: string,
  description?: string,
  modifiers?: SquareModifier[]
): SquareModifierList {
  return {
    type: 'MODIFIER_LIST',
    id: `#modifier_list_${Date.now()}`,
    modifier_list_data: {
      name,
      description,
      selection_type: 'MULTIPLE',
      modifiers: modifiers || []
    }
  }
}

// Create dietary restriction custom attribute
export function createDietaryRestrictionAttribute(restriction: SquareDietaryRestriction): SquareCustomAttribute {
  return {
    type: 'STRING',
    name: 'dietary_restriction',
    string_value: restriction
  }
}

// Create ingredient with measurement unit (as modifier)
export function createIngredientAsModifier(
  name: string,
  description: string,
  unit: string,
  customAttributes?: SquareCustomAttribute[]
): SquareModifier {
  return {
    type: 'MODIFIER',
    id: `#modifier_${Date.now()}`,
    modifier_data: {
      name,
      description: `${description}\nUnit: ${unit}`,
      custom_attribute_values: customAttributes || []
    }
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const SQUARE_API_ENDPOINTS = {
  // Catalog Management
  CATALOG_LIST: 'https://connect.squareup.com/v2/catalog/list',
  CATALOG_OBJECT: 'https://connect.squareup.com/v2/catalog/object',
  CATALOG_SEARCH: 'https://connect.squareup.com/v2/catalog/search',
  
  // Inventory Management
  INVENTORY_COUNT: 'https://connect.squareup.com/v2/inventory/count',
  INVENTORY_ADJUSTMENT: 'https://connect.squareup.com/v2/inventory/adjustment',
  
  // Location Management
  LOCATIONS: 'https://connect.squareup.com/v2/locations',
  
  // Orders & Transactions
  ORDERS: 'https://connect.squareup.com/v2/orders',
  TRANSACTIONS: 'https://connect.squareup.com/v2/transactions',
  
  // Custom Attributes
  CUSTOM_ATTRIBUTE_DEFINITIONS: 'https://connect.squareup.com/v2/catalog/custom-attribute-definitions'
}

// ============================================================================
// BEST PRACTICES FOR SQUARE INTEGRATION
// ============================================================================

/*
1. MENU ITEMS:
   - Use ITEM type for menu items
   - Include variations for different sizes/flavors
   - Add dietary restrictions as custom attributes
   - Use categories for organization

2. INGREDIENTS:
   - Use MODIFIER type for ingredients
   - Group ingredients in MODIFIER_LIST
   - Add dietary restrictions as custom attributes
   - Use measurement units for inventory tracking

3. CATEGORIES:
   - Create categories for menu organization
   - Use for grouping similar items
   - Helps with Square's menu display

4. DIETARY RESTRICTIONS:
   - Use Square's built-in dietary restriction system
   - Add as custom attributes on items and modifiers
   - Don't create separate allergen categories

5. INVENTORY:
   - Track ingredient quantities
   - Set low stock alerts
   - Use measurement units for accuracy

6. PRICING:
   - Set appropriate pricing for menu items
   - Use FIXED_PRICING for menu items with prices
   - Use VARIABLE_PRICING for ingredients/modifiers
*/ 