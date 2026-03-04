export const REFERRAL_REWARD_CREDITS = 50

export const AUTUMN_REFERRAL_RULES = {
  signup: {
    programId: 'referral_signup_50_50_credits',
    trigger: 'signup',
    referrerCredits: REFERRAL_REWARD_CREDITS,
    refereeCredits: REFERRAL_REWARD_CREDITS,
  },
} as const

export type AutumnReferralRule = (typeof AUTUMN_REFERRAL_RULES)[keyof typeof AUTUMN_REFERRAL_RULES]
