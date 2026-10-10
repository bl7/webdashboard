import { stripe } from "@/lib/stripe"
import pool from "@/lib/pg"
import type Stripe from "stripe"

/** Last moment of 10 January 2027, UK (GMT). */
export const CAMPAIGN_END_MS = Date.parse("2027-01-10T23:59:59.999Z")
export const CAMPAIGN_END_LABEL = "10 January 2027"
export const CAMPAIGN_TRIAL_DAYS = 60
const DEFAULT_TRIAL_DAYS = 14

async function ensureCampaignOfferRow() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_offer (
      id integer PRIMARY KEY,
      code text NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(
    `INSERT INTO campaign_offer (id, code) VALUES (1, '') ON CONFLICT (id) DO NOTHING`
  )
}

export async function getCampaignCode(): Promise<{ code: string; updatedAt: string | null }> {
  await ensureCampaignOfferRow()
  const result = await pool.query(`SELECT code, updated_at FROM campaign_offer WHERE id = 1`)
  const row = result.rows[0]
  return {
    code: String(row?.code || "").trim(),
    updatedAt: row?.updated_at ? String(row.updated_at) : null,
  }
}

export async function setCampaignCode(code: string): Promise<{ code: string; updatedAt: string | null }> {
  await ensureCampaignOfferRow()
  const result = await pool.query(
    `UPDATE campaign_offer SET code = $1, updated_at = NOW() WHERE id = 1 RETURNING code, updated_at`,
    [code.trim()]
  )
  const row = result.rows[0]
  return {
    code: String(row?.code || "").trim(),
    updatedAt: row?.updated_at ? String(row.updated_at) : null,
  }
}

export type CampaignDecision =
  | { ok: true; trialDays: number; applyAnnualDiscount: boolean }
  | { ok: false; error: string }

/**
 * One code. New customers only.
 * Annual: 60-day trial, then 30% off the first yearly invoice.
 * Monthly: 60-day trial, then the normal monthly price.
 */
export async function decideCampaignOffer(input: {
  enteredCode: string | null | undefined
  isNewCustomer: boolean
  interval: "monthly" | "yearly"
  now?: number
}): Promise<CampaignDecision | null> {
  const entered = input.enteredCode?.trim() || ""
  if (!entered) return null

  const expected = (await getCampaignCode()).code
  if (!expected) {
    return { ok: false, error: "This offer is not available." }
  }
  if (entered.toUpperCase() !== expected.toUpperCase()) {
    return { ok: false, error: "That code is not valid." }
  }
  if ((input.now ?? Date.now()) > CAMPAIGN_END_MS) {
    return { ok: false, error: `This offer ended on ${CAMPAIGN_END_LABEL}.` }
  }
  if (!input.isNewCustomer) {
    return { ok: false, error: "This offer is for new customers." }
  }

  return {
    ok: true,
    trialDays: CAMPAIGN_TRIAL_DAYS,
    applyAnnualDiscount: input.interval === "yearly",
  }
}

/** Price preview after the customer applies the code. Monthly price is unchanged. */
export async function previewCampaignCode(enteredCode: string, isNewCustomer: boolean) {
  const decision = await decideCampaignOffer({
    enteredCode,
    isNewCustomer,
    interval: "yearly",
  })
  if (!decision) return { ok: false as const, error: "Enter an offer code." }
  if (!decision.ok) return decision
  return { ok: true as const, trialDays: decision.trialDays, yearlyPercentOff: 30 }
}

export function trialDaysForCheckout(decision: CampaignDecision | null, isNewCustomer: boolean) {
  if (decision?.ok) return decision.trialDays
  return isNewCustomer ? DEFAULT_TRIAL_DAYS : undefined
}

function couponOf(promo: Stripe.PromotionCode): Stripe.Coupon | string | null {
  const raw = promo as Stripe.PromotionCode & {
    coupon?: Stripe.Coupon | string
    promotion?: { coupon?: Stripe.Coupon | string }
  }
  return raw.coupon ?? raw.promotion?.coupon ?? null
}

export async function loadAnnualCampaignPromotion(): Promise<
  { ok: true; promotionCodeId: string } | { ok: false; error: string }
> {
  const code = (await getCampaignCode()).code
  if (!code) return { ok: false, error: "This offer is not available." }

  const listed = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
    expand: ["data.coupon"],
  })
  const promo = listed.data[0]
  if (!promo) {
    return { ok: false, error: "The annual discount is not available yet." }
  }
  if (promo.expires_at && promo.expires_at * 1000 <= Date.now()) {
    return { ok: false, error: `This offer ended on ${CAMPAIGN_END_LABEL}.` }
  }

  let coupon = couponOf(promo)
  if (typeof coupon === "string") {
    coupon = await stripe.coupons.retrieve(coupon)
  }
  if (!coupon || coupon.percent_off !== 30 || coupon.duration !== "once") {
    console.error("[CHECKOUT] Campaign coupon must be 30% off, duration once", {
      percent_off: coupon && typeof coupon !== "string" ? coupon.percent_off : null,
      duration: coupon && typeof coupon !== "string" ? coupon.duration : null,
    })
    return { ok: false, error: "The annual discount is not available yet." }
  }

  return { ok: true, promotionCodeId: promo.id }
}

/**
 * A duration of "once" is spent on the £0 trial invoice, so Checkout shows the
 * full price and the first real payment is not reduced. Three months covers the
 * invoice at the end of the 60-day trial and not the renewal a year later.
 */
const ANNUAL_CHECKOUT_COUPON_ID = "instalabel_xmas_30_first_year"

export async function annualCheckoutCouponId(): Promise<
  { ok: true; couponId: string } | { ok: false; error: string }
> {
  try {
    const existing = await stripe.coupons.retrieve(ANNUAL_CHECKOUT_COUPON_ID)
    if (
      existing.percent_off === 30 &&
      existing.duration === "repeating" &&
      existing.duration_in_months === 3
    ) {
      return { ok: true, couponId: existing.id }
    }
    return { ok: false, error: "The annual discount is not available yet." }
  } catch (err: any) {
    if (err?.code !== "resource_missing") {
      console.error("[CHECKOUT] Campaign coupon", err)
      return { ok: false, error: "The annual discount is not available yet." }
    }
  }

  try {
    const created = await stripe.coupons.create({
      id: ANNUAL_CHECKOUT_COUPON_ID,
      percent_off: 30,
      duration: "repeating",
      duration_in_months: 3,
      name: "30% off first annual payment",
    })
    return { ok: true, couponId: created.id }
  } catch (err) {
    console.error("[CHECKOUT] Could not create campaign coupon", err)
    return { ok: false, error: "The annual discount is not available yet." }
  }
}

export async function checkCampaignStripe(code: string): Promise<{
  status: "empty" | "missing" | "ready" | "wrong" | "expired"
  detail: string
}> {
  if (!code.trim()) {
    return { status: "empty", detail: "No code saved. The offer is off." }
  }
  const listed = await stripe.promotionCodes.list({
    code: code.trim(),
    active: true,
    limit: 1,
    expand: ["data.coupon"],
  })
  const promo = listed.data[0]
  if (!promo) {
    return {
      status: "missing",
      detail: "Stripe does not have this code yet. The annual 30% will not apply until you create it there.",
    }
  }
  if (promo.expires_at && promo.expires_at * 1000 <= Date.now()) {
    return { status: "expired", detail: "This code has expired in Stripe." }
  }
  let coupon = couponOf(promo)
  if (typeof coupon === "string") coupon = await stripe.coupons.retrieve(coupon)
  if (!coupon || coupon.percent_off !== 30 || coupon.duration !== "once") {
    return {
      status: "wrong",
      detail: "Stripe has this code, but the coupon must be 30% off and apply once.",
    }
  }
  return {
    status: "ready",
    detail: "Stripe has this code: 30% off the first annual payment.",
  }
}

function discountOn(sub: Stripe.Subscription): Stripe.Discount | null {
  const extra = sub as Stripe.Subscription & {
    discount?: Stripe.Discount | null
    discounts?: Array<Stripe.Discount | string>
  }
  if (extra.discount) return extra.discount
  const found = extra.discounts?.find((item) => typeof item !== "string")
  return (found as Stripe.Discount) || null
}

/**
 * If the customer typed the campaign code into Stripe Checkout:
 * yearly keeps the 30% coupon and the trial is extended to 60 days;
 * monthly has the coupon removed and the trial set to 60 days.
 */
export async function alignCampaignSubscription(
  sub: Stripe.Subscription
): Promise<Stripe.Subscription> {
  const expected = (await getCampaignCode()).code
  if (!expected) return sub
  if (sub.created * 1000 > CAMPAIGN_END_MS) return sub

  const discount = discountOn(sub)
  if (!discount?.promotion_code) return sub

  const promoRef = discount.promotion_code
  let code = ""
  if (typeof promoRef === "string") {
    try {
      const promo = await stripe.promotionCodes.retrieve(promoRef)
      code = promo.code || ""
    } catch (err) {
      console.error("[CAMPAIGN] Could not read promotion code", err)
      return sub
    }
  } else if (typeof promoRef === "object" && promoRef && "code" in promoRef) {
    code = String(promoRef.code || "")
  }
  if (code.toUpperCase() !== expected.toUpperCase()) return sub

  const interval = sub.items.data[0]?.price?.recurring?.interval
  const start = sub.trial_start || sub.created
  const targetEnd = start + CAMPAIGN_TRIAL_DAYS * 86400
  const needsTrial =
    sub.status === "trialing" && (!sub.trial_end || sub.trial_end < targetEnd - 3600)
  const dropDiscount = interval === "month"

  if (dropDiscount) {
    try {
      await stripe.subscriptions.deleteDiscount(sub.id)
    } catch (err) {
      console.error("[CAMPAIGN] Could not remove monthly campaign discount", err)
    }
  }

  if (needsTrial) {
    try {
      await stripe.subscriptions.update(sub.id, { trial_end: targetEnd })
    } catch (err) {
      console.error("[CAMPAIGN] Could not extend campaign trial", err)
    }
  }

  if (!dropDiscount && !needsTrial) return sub
  return stripe.subscriptions.retrieve(sub.id)
}
