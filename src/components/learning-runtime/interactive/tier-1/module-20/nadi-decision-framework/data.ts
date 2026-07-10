export interface NadiFrameworkState {
  // Recommend triggers
  explicitlyAsked: boolean;
  namesDecisionPoint: boolean;
  lifeStageContext: boolean;
  chartSurfaces: boolean;
  unprompted: boolean;

  // Refuse triggers (Red lines)
  exorbitantRemedy: boolean;
  wantsGuarantee: boolean;
  financialDistress: boolean;
  unethicalPurpose: boolean;
  impersonateCredentials: boolean;
  restingDecisionAlone: boolean;

  // Defer triggers
  deepInterpretation: boolean;
  subTraditionSpecifics: boolean;
  verifySpecificReader: boolean;
  integrateDeepTradition: boolean;
  traditionDisputes: boolean;
}

export const DEFAULT_STATE: NadiFrameworkState = {
  explicitlyAsked: false,
  namesDecisionPoint: true,
  lifeStageContext: false,
  chartSurfaces: true,
  unprompted: false,
  exorbitantRemedy: false,
  wantsGuarantee: false,
  financialDistress: false,
  unethicalPurpose: false,
  impersonateCredentials: false,
  restingDecisionAlone: false,
  deepInterpretation: false,
  subTraditionSpecifics: false,
  verifySpecificReader: false,
  integrateDeepTradition: false,
  traditionDisputes: false,
};

export const PRESETS = {
  monday: {
    name: "Monday (Unprompted Recommend)",
    description: "Enthusiastically bringing up Nāḍī during a reading when the client never asked.",
    state: {
      explicitlyAsked: false,
      namesDecisionPoint: false,
      lifeStageContext: false,
      chartSurfaces: false,
      unprompted: true,
      exorbitantRemedy: false,
      wantsGuarantee: false,
      financialDistress: false,
      unethicalPurpose: false,
      impersonateCredentials: false,
      restingDecisionAlone: false,
      deepInterpretation: false,
      subTraditionSpecifics: false,
      verifySpecificReader: false,
      integrateDeepTradition: false,
      traditionDisputes: false,
    },
  },
  wednesday: {
    name: "Wednesday (Standalone Request)",
    description: "Client explicitly books a session to ask if they should see a reader for a career move.",
    state: {
      explicitlyAsked: true,
      namesDecisionPoint: false,
      lifeStageContext: false,
      chartSurfaces: false,
      unprompted: false,
      exorbitantRemedy: false,
      wantsGuarantee: false,
      financialDistress: false,
      unethicalPurpose: false,
      impersonateCredentials: false,
      restingDecisionAlone: false,
      deepInterpretation: false,
      subTraditionSpecifics: false,
      verifySpecificReader: false,
      integrateDeepTradition: false,
      traditionDisputes: false,
    },
  },
  friday: {
    name: "Friday (Marriage Contextual)",
    description: "Mid-reading, client asks about consulting Nāḍī for marriage guidance.",
    state: {
      explicitlyAsked: false,
      namesDecisionPoint: true,
      lifeStageContext: false,
      chartSurfaces: true,
      unprompted: false,
      exorbitantRemedy: false,
      wantsGuarantee: false,
      financialDistress: false,
      unethicalPurpose: false,
      impersonateCredentials: false,
      restingDecisionAlone: false,
      deepInterpretation: false,
      subTraditionSpecifics: false,
      verifySpecificReader: false,
      integrateDeepTradition: false,
      traditionDisputes: false,
    },
  },
  scamRemedy: {
    name: "Scam Remedy (Saturn Pitch)",
    description: "Seeker was given a ₹2 lakh Saturn ritual pitch under severe fear-induction.",
    state: {
      explicitlyAsked: true,
      namesDecisionPoint: false,
      lifeStageContext: false,
      chartSurfaces: false,
      unprompted: false,
      exorbitantRemedy: true,
      wantsGuarantee: false,
      financialDistress: false,
      unethicalPurpose: false,
      impersonateCredentials: false,
      restingDecisionAlone: false,
      deepInterpretation: false,
      subTraditionSpecifics: false,
      verifySpecificReader: false,
      integrateDeepTradition: false,
      traditionDisputes: false,
    },
  },
};

export interface EvaluationResult {
  recommendPass: boolean;
  refusePass: boolean;
  deferPass: boolean;
  verdict: "OUT_OF_SCOPE" | "REFUSE" | "DEFER" | "MODE_1_CONTEXTUAL" | "MODE_2_STANDALONE";
  reason: string;
  checklist: string[];
}

export function evaluateState(state: NadiFrameworkState): EvaluationResult {
  // 1. Recommend Gate
  const hasTrigger =
    state.explicitlyAsked ||
    state.namesDecisionPoint ||
    state.lifeStageContext ||
    state.chartSurfaces;
  
  const recommendPass = hasTrigger && !state.unprompted;

  if (!recommendPass) {
    return {
      recommendPass: false,
      refusePass: true,
      deferPass: true,
      verdict: "OUT_OF_SCOPE",
      reason: state.unprompted
        ? "Fails Recommend Gate: Introducing Nāḍī unprompted violates the absent-grounds rule and intrudes on client agenda."
        : "Fails Recommend Gate: No active client request, decision point, context, or chart indication present.",
      checklist: ["Stay focused on your primary chart consultation.", "Do not introduce or suggest Nāḍī unprompted."],
    };
  }

  // 2. Refuse Gate (Red lines)
  const isRefuse =
    state.exorbitantRemedy ||
    state.wantsGuarantee ||
    state.financialDistress ||
    state.unethicalPurpose ||
    state.impersonateCredentials ||
    state.restingDecisionAlone;

  if (isRefuse) {
    let specificReason = "Fails Refuse Gate: Crossed a do-no-harm red line. ";
    const checklist = ["Politely decline the engagement.", "Explain the red line boundaries clearly without being argumentative."];

    if (state.exorbitantRemedy) {
      specificReason += "Exorbitant remedy pūjā & fear-induction over-claims are documented scam patterns.";
      checklist.push("Deny the ritual prescription.", "Advise client not to pay ₹2 lakh or make fear-driven choices.");
    }
    if (state.wantsGuarantee) {
      specificReason += "Spiritual outcomes can never be guaranteed for profit.";
      checklist.push("Refuse to support outcome guarantees.");
    }
    if (state.financialDistress) {
      specificReason += "Consultation/rituals would worsen the client's financial situation.";
      checklist.push("Prioritize client's basic financial safety.");
    }
    if (state.unethicalPurpose) {
      specificReason += "Nāḍī cannot be used to manipulate or control family members.";
      checklist.push("Enforce client-relationship boundary rules.");
    }
    if (state.impersonateCredentials) {
      specificReason += "Impersonating reader credentials (reading raw leaves/rituals) is out of scope.";
      checklist.push("Clarify that chart readers do not perform leaf-reading.");
    }
    if (state.restingDecisionAlone) {
      specificReason += "Resting a major life decision (marriage/career) on Nāḍī alone violates multi-source reasoning.";
      checklist.push("Refuse single-source decision framing.", "Demand convergent independent grounds from chart, life, and practical reflection.");
    }

    return {
      recommendPass: true,
      refusePass: false,
      deferPass: true,
      verdict: "REFUSE",
      reason: specificReason,
      checklist,
    };
  }

  // 3. Defer Gate
  const isDefer =
    state.deepInterpretation ||
    state.subTraditionSpecifics ||
    state.verifySpecificReader ||
    state.integrateDeepTradition ||
    state.traditionDisputes;

  if (isDefer) {
    let specificReason = "Fails Defer Gate: Beyond chart reader's literacy scope. ";
    const checklist = ["Decline the specific deep/specialized request.", "Provide a warm referral to a qualified Nāḍī lineage specialist."];

    if (state.deepInterpretation) specificReason += "Deep interpretation of raw leaves is lineage-bound.";
    if (state.subTraditionSpecifics) specificReason += "Saptarṣi/aṁśa technical research requires specialized training.";
    if (state.verifySpecificReader) specificReason += "Credentialing a specific reader's apprentice history requires lineage access.";
    if (state.integrateDeepTradition) specificReason += "Deep cross-stream integration is outside foundational literacy.";
    if (state.traditionDisputes) specificReason += "Adjudicating family/text disputes is outside scope.";

    return {
      recommendPass: true,
      refusePass: true,
      deferPass: false,
      verdict: "DEFER",
      reason: specificReason,
      checklist,
    };
  }

  // 4. In Scope Mode Selection
  if (state.explicitlyAsked) {
    return {
      recommendPass: true,
      refusePass: true,
      deferPass: true,
      verdict: "MODE_2_STANDALONE",
      reason: "In Scope: Standalone Advisory. The client explicitly booked or asked for a focused Nāḍī advisory.",
      checklist: [
        "Deliver all five disclosures upfront (verification gap, quality variance, ordinary explanations, scams, not first).",
        "Maintain client autonomy: advise, do not command.",
        "Assess seeker motivation (curiosity vs crisis care).",
        "Mandate the 5-point before-you-go checklist before any referral.",
        "Maintain chart analysis as secondary cross-check.",
      ],
    };
  }

  return {
    recommendPass: true,
    refusePass: true,
    deferPass: true,
    verdict: "MODE_1_CONTEXTUAL",
    reason: "In Scope: Mode 1 Contextual Mention. Briefly address Nāḍī (5-15 mins) within the primary chart consultation.",
    checklist: [
      "Deliver all five disclosures briefly and clearly.",
      "Keep chart and practical circumstances first.",
      "Frame Nāḍī strictly as a supplementary perspective.",
      "Mandate the 5-point before-you-go checklist.",
      "Help client read results honestly afterward.",
    ],
  };
}
