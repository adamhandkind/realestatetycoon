/* ============================================================
   REAL ESTATE EMPIRE — UI SELECTOR ADAPTER
   ------------------------------------------------------------
   Use this in App.jsx or React Native screens to avoid duplicating
   core game calculations in the UI.
   ============================================================ */

import {
  selectGameView,
  getSwagger,
  getSwaggerTier,
  getBestClient,
  getActiveLunch,
  getMonthlyCosts,
  getPlayerModifiers,
  CLIENT_POOL,
} from "./gameLogic.v2.js";

export function buildGameUIModel(state, character) {
  const view = selectGameView(state);
  const modifiers = getPlayerModifiers(state);
  const monthlyCosts = getMonthlyCosts(state);

  return {
    ...view,

    character,
    swagger: getSwagger(state),
    swaggerTier: getSwaggerTier(getSwagger(state)),
    bestClient: getBestClient(state),
    currentLunch: getActiveLunch(state),
    activeLunchData: getActiveLunch(state),

    staffCost: monthlyCosts.staffCost,
    adCost: monthlyCosts.adCost,
    lifestyleCost: monthlyCosts.lifestyleCost,
    lunchCost: monthlyCosts.lunchCost,
    greaseCost: monthlyCosts.greaseCost,
    totalOverhead: monthlyCosts.total,

    swaggerRentBonus: modifiers.rentMultiplier - 1,
    swaggerCommBonus: modifiers.commissionMultiplier - 1,
    swaggerOHBonus: modifiers.openHouseConversionBonus,
    swaggerLawsuitRedux: 1 - modifiers.lawsuitRiskMultiplier,
    swaggerLeadBonus: Number(getActiveLunch(state)?.leadBonus || 0),

    clientPool: CLIENT_POOL,
  };
}
