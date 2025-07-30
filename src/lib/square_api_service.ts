import { SquareDataTransformer } from './square_data_transformer'

interface SquareTokens {
  access_token: string
  refresh_token: string
  merchant_id: string
  expires_at?: number
}

interface SquareSyncResult {
  success: boolean
  itemsProcessed: number
  itemsCreated: number
  itemsUpdated: number
  itemsFailed: number
  errors: string[]
  duration: number
}

export class SquareAPIService {
  private readonly baseUrl = 'https://connect.squareup.com/v2'
  private readonly oauthUrl = 'https://connect.squareup.com/oauth2'
  private accessToken: string
  private refreshToken: string
  private merchantId: string
  private transformer: SquareDataTransformer

  constructor(accessToken?: string, refreshToken?: string, merchantId?: string) {
    this.accessToken = accessToken || ''
    this.refreshToken = refreshToken || ''
    this.merchantId = merchantId || ''
    this.transformer = new SquareDataTransformer()
  }

  /**
   * Generate OAuth URL for Square connection
   */
  generateOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.SQUARE_CLIENT_ID
    const state = this.generateSecureState(userId)
    
    const params = new URLSearchParams({
      client_id: clientId!,
      scope: 'ITEMS_READ INVENTORY_READ MERCHANT_PROFILE_READ',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: state
    })

    return `${this.oauthUrl}/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<SquareTokens> {
    const clientId = process.env.SQUARE_CLIENT_ID
    const clientSecret = process.env.SQUARE_CLIENT_SECRET

    const response = await fetch(`${this.oauthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Square OAuth error: ${error.error_description || error.error}`)
    }

    const data = await response.json()
    
    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token
    this.merchantId = data.merchant_id

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      merchant_id: data.merchant_id,
      expires_at: data.expires_at
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    const clientId = process.env.SQUARE_CLIENT_ID
    const clientSecret = process.env.SQUARE_CLIENT_SECRET

    const response = await fetch(`${this.oauthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Square token refresh error: ${error.error_description || error.error}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token

    return data.access_token
  }

  /**
   * Make authenticated request to Square API
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Square-Version': '2024-12-18',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshAccessToken()
      
      // Retry request with new token
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Square-Version': '2024-12-18',
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
    }

    return response
  }

  /**
   * Get merchant locations
   */
  async getLocations(): Promise<any[]> {
    const response = await this.makeRequest('/locations')
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch locations: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.locations || []
  }

  /**
   * Get catalog items from Square
   */
  async getCatalogItems(locationId?: string): Promise<any[]> {
    const params = new URLSearchParams({
      types: 'ITEM,ITEM_VARIATION,CATEGORY'
    })
    
    if (locationId) {
      params.append('location_ids', locationId)
    }

    const response = await this.makeRequest(`/catalog/list?${params.toString()}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch catalog items: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.objects || []
  }

  /**
   * Get inventory counts
   */
  async getInventoryCounts(locationId: string): Promise<any[]> {
    const params = new URLSearchParams({
      location_ids: locationId
    })

    const response = await this.makeRequest(`/inventory/counts?${params.toString()}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to fetch inventory: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.counts || []
  }

  /**
   * Subscribe to Square webhooks
   */
  async subscribeToWebhooks(notificationUrl: string): Promise<any> {
    const response = await this.makeRequest('/webhooks/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        subscription: {
          name: 'InstaLabel Catalog Sync',
          event_types: [
            'catalog.version.updated',
            'inventory.count.updated'
          ],
          notification_url: notificationUrl
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to subscribe to webhooks: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    return response.json()
  }

  /**
   * Sync Square catalog to InstaLabel
   */
  async syncCatalogToInstaLabel(userId: string, locationId?: string): Promise<SquareSyncResult> {
    const startTime = Date.now()
    const result: SquareSyncResult = {
      success: false,
      itemsProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsFailed: 0,
      errors: [],
      duration: 0
    }

    try {
      // Fetch catalog items from Square
      const squareItems = await this.getCatalogItems(locationId)
      result.itemsProcessed = squareItems.length

      // Transform Square data to InstaLabel format
      const transformedData = this.transformer.transformSquareItems(squareItems, userId)

      // Here you would integrate with your existing InstaLabel API
      // This is a placeholder for the actual integration
      const syncPromises = transformedData.menuItems.map(async (menuItem) => {
        try {
          // Call your existing InstaLabel API to create/update menu items
          // await createOrUpdateMenuItem(menuItem, userId)
          result.itemsCreated++
        } catch (error) {
          result.itemsFailed++
          result.errors.push(`Failed to sync menu item ${menuItem.menuItemName}: ${error}`)
        }
      })

      await Promise.all(syncPromises)

      result.success = result.itemsFailed === 0
      result.duration = Date.now() - startTime

      return result
    } catch (error) {
      result.errors.push(`Sync failed: ${error}`)
      result.duration = Date.now() - startTime
      return result
    }
  }

  /**
   * Validate webhook signature
   */
  verifyWebhookSignature(body: string, signature: string, webhookSecret: string): boolean {
    const crypto = require('crypto')
    
    // Square uses HMAC-SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('base64')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'catalog.version.updated':
        await this.handleCatalogUpdate(event.data)
        break
      case 'inventory.count.updated':
        await this.handleInventoryUpdate(event.data)
        break
      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }
  }

  /**
   * Handle catalog update webhook
   */
  private async handleCatalogUpdate(data: any): Promise<void> {
    // Implement catalog update logic
    console.log('Catalog updated:', data)
    
    // You would typically:
    // 1. Fetch the updated items from Square
    // 2. Transform them using the transformer
    // 3. Update corresponding InstaLabel items
  }

  /**
   * Handle inventory update webhook
   */
  private async handleInventoryUpdate(data: any): Promise<void> {
    // Implement inventory update logic
    console.log('Inventory updated:', data)
    
    // You would typically:
    // 1. Update stock levels in InstaLabel
    // 2. Trigger label reprints if needed
    // 3. Update expiry calculations
  }

  /**
   * Generate secure state parameter for OAuth
   */
  private generateSecureState(userId: string): string {
    const crypto = require('crypto')
    const timestamp = Date.now()
    const random = crypto.randomBytes(16).toString('hex')
    
    return crypto
      .createHash('sha256')
      .update(`${userId}:${timestamp}:${random}`)
      .digest('hex')
  }

  /**
   * Extract user ID from state parameter
   */
  extractUserIdFromState(state: string): string | null {
    // This is a simplified version - in production you'd want to store
    // the state securely and validate it properly
    try {
      // You might want to store state in a database or cache
      // and validate it against the stored value
      return state // Simplified for demo
    } catch (error) {
      return null
    }
  }

  /**
   * Get Square integration status
   */
  getIntegrationStatus(): {
    connected: boolean
    merchantId: string
    accessTokenValid: boolean
  } {
    return {
      connected: !!this.accessToken && !!this.merchantId,
      merchantId: this.merchantId,
      accessTokenValid: !!this.accessToken
    }
  }
} 