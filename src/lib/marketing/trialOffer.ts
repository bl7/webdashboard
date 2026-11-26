/** Last moment of 10 January 2027, UK (GMT). Shared with the checkout offer. */
export const CAMPAIGN_END_MS = Date.parse("2027-01-10T23:59:59.999Z")
export const CAMPAIGN_END_LABEL = "10 January 2027"

/** Standard trial. This stays after the Christmas offer ends. */
export const STANDARD_TRIAL_DAYS = 14

/** TODO: Revert to 14-day trial after 10 January 2027 */
export const CHRISTMAS_TRIAL_DAYS = 60

export const CHRISTMAS_OFFER_COPY =
  "Christmas offer: 60 days free, then £15.99 a month. Annual plans get 30% off the first annual payment. Offer ends 10 January 2027."

export function isChristmasOfferActive(now = Date.now()) {
  return now <= CAMPAIGN_END_MS
}

export function activeTrialDays(now = Date.now()) {
  // TODO: Revert to 14-day trial after 10 January 2027
  return isChristmasOfferActive(now) ? CHRISTMAS_TRIAL_DAYS : STANDARD_TRIAL_DAYS
}

export function trialCtaLabel(now = Date.now()) {
  return isChristmasOfferActive(now) ? "Start 60 days free" : "Start free trial"
}

export function planConditionsAnswer(now = Date.now()) {
  const trial = isChristmasOfferActive(now)
    ? CHRISTMAS_OFFER_COPY
    : `New subscriptions start with a ${STANDARD_TRIAL_DAYS}-day trial.`
  return `Review the terms presented with your selected plan before subscribing. ${trial} Payment details are collected at checkout, there is no charge during the trial, and billing continues at the selected interval after the trial until you cancel. You may cancel at any time.`
}
