/* ============================================================
   REAL ESTATE EMPIRE — CharacterAvatarWeb v3
   ------------------------------------------------------------
   Web renderer for avatarEngine.v3.js.

   Important difference from v2:
   - v2 generated almost every visual primitive inside the engine.
   - v3 receives a layered asset model and delegates artwork to
     avatarAssets.v3.jsx.

   This keeps the avatar scalable now and makes it safe to replace
   individual parts with commissioned SVG/PNG art later.
   ============================================================ */

import React, { useMemo } from "react";
import { createAvatarModel } from "./avatarEngine.v3.js";
import { AvatarDefs, renderAvatarAsset } from "./avatarAssets.v3.jsx";

const AVATAR_STYLE = `
  .ree-avatar-root {
    width: 100%;
    max-width: var(--ree-avatar-max-width, 340px);
    display: block;
    margin: 0 auto;
    transform-origin: 50% 82%;
    filter: saturate(1.05) contrast(1.05);
  }

  .ree-avatar-idle {
    animation: reeAvatarBreath 3.6s ease-in-out infinite;
  }

  .ree-avatar-spin {
    animation: reeAvatarSpin .9s cubic-bezier(.4,0,.6,1);
  }

  .ree-avatar-blink {
    animation: reeAvatarBlink 1.35s ease-in-out infinite;
  }

  .ree-avatar-sparkle {
    animation: reeAvatarSparkle 1.7s ease-in-out infinite;
  }

  .ree-avatar-jitter {
    animation: reeAvatarJitter .18s linear infinite;
  }

  @keyframes reeAvatarBreath {
    0%,100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-3px) scale(1.006); }
  }

  @keyframes reeAvatarSpin {
    0% { transform: perspective(800px) rotateY(0deg); }
    50% { transform: perspective(800px) rotateY(180deg); }
    100% { transform: perspective(800px) rotateY(360deg); }
  }

  @keyframes reeAvatarBlink {
    0%,100% { opacity: .35; }
    50% { opacity: 1; }
  }

  @keyframes reeAvatarSparkle {
    0%,100% { opacity: .45; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-3px); }
  }

  @keyframes reeAvatarJitter {
    0%,100% { transform: translate(0,0); }
    25% { transform: translate(1px,-1px); }
    50% { transform: translate(-1px,1px); }
    75% { transform: translate(1px,1px); }
  }

  @media (max-width: 640px) {
    .ree-avatar-root {
      max-width: min(340px, 92vw);
    }
  }
`;

export default function CharacterAvatarWebV3(props) {
  const model = useMemo(() => createAvatarModel({
    character: props.char || props.character,
    state: props.state || props.gameState,
    owned: props.owned,
    activeLunch: props.activeLunch,
    swaggerTier: props.swaggerTier,
    spinning: props.spinning,
  }), [
    props.char,
    props.character,
    props.state,
    props.gameState,
    props.owned,
    props.activeLunch,
    props.swaggerTier,
    props.spinning,
  ]);

  const ariaName = model.traits.character?.name || "Real Estate Empire character";
  const className = props.spinning ? "ree-avatar-root ree-avatar-spin" : "ree-avatar-root ree-avatar-idle";
  const style = {
    "--ree-avatar-max-width": `${props.maxWidth || 340}px`,
  };

  return (
    <svg
      viewBox={model.viewBox}
      className={className}
      style={style}
      role="img"
      aria-label={`${ariaName}, ${model.traits.swaggerTier}, ${model.traits.mood} mood`}
    >
      <style>{AVATAR_STYLE}</style>
      <AvatarDefs traits={model.traits} />
      {model.layers.map((layer) => renderAvatarAsset(layer, model.traits))}
    </svg>
  );
}
