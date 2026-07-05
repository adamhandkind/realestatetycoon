/* ============================================================
   REAL ESTATE EMPIRE — CharacterAvatarWeb v2
   ------------------------------------------------------------
   React web SVG renderer for avatarEngine.v2.js.

   Replace the old giant CharacterAvatar component in App.jsx with:

     import CharacterAvatar from "./CharacterAvatarWeb.v2.jsx";

   Then keep the same props:
     <CharacterAvatar
       owned={st.owned}
       char={char}
       activeLunch={st.activeLunch}
       activeLunchData={activeLunchData}
       spinning={spinning}
       swaggerTier={swaggerTier}
     />
   ============================================================ */

import React, { useMemo } from "react";
import { createAvatarModel } from "./avatarEngine.v2.js";

const SVG_STYLE = `
  @keyframes reeSpin360 {
    0%   { transform: perspective(700px) rotateY(0deg); }
    50%  { transform: perspective(700px) rotateY(180deg); }
    100% { transform: perspective(700px) rotateY(360deg); }
  }
  @keyframes reeFloatBob {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-3px); }
  }
  @keyframes reeShimmer {
    0%,100% { opacity: 0.6; }
    50%     { opacity: 1; }
  }
  @keyframes reeBlinkSoft {
    0%,100% { opacity: 0.35; }
    50%     { opacity: 1; }
  }
`;

function cleanProps(props) {
  const out = {};
  Object.entries(props || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "value" || key === "animate") return;
    out[key] = value;
  });
  return out;
}

function renderDef(def) {
  const Gradient = def.type;
  return (
    <Gradient key={def.id} id={def.id} {...cleanProps(def.props)}>
      {(def.stops || []).map((stop, i) => (
        <stop key={i} {...stop} />
      ))}
    </Gradient>
  );
}

function renderLayer(layer) {
  const props = cleanProps(layer.props);
  const key = layer.id;

  const animation =
    layer.props?.animate === "shimmer"
      ? "reeShimmer 2s ease-in-out infinite"
      : layer.props?.animate === "blinkSoft"
      ? "reeBlinkSoft 1.5s ease-in-out infinite"
      : undefined;

  const style = animation ? { animation } : undefined;

  if (layer.type === "g") {
    return (
      <g key={key} {...props} style={style}>
        {(layer.children || []).map(renderLayer)}
      </g>
    );
  }

  if (layer.type === "rect") return <rect key={key} {...props} style={style} />;
  if (layer.type === "circle") return <circle key={key} {...props} style={style} />;
  if (layer.type === "ellipse") return <ellipse key={key} {...props} style={style} />;
  if (layer.type === "path") return <path key={key} {...props} style={style} />;
  if (layer.type === "line") return <line key={key} {...props} style={style} />;
  if (layer.type === "polygon") return <polygon key={key} {...props} style={style} />;

  if (layer.type === "text") {
    return (
      <text
        key={key}
        fontFamily={props.fontFamily || "'IBM Plex Mono', monospace"}
        {...props}
        style={style}
      >
        {layer.props?.value || ""}
      </text>
    );
  }

  return null;
}

export default function CharacterAvatarWeb(props) {
  const model = useMemo(() => createAvatarModel({
    character: props.char || props.character,
    owned: props.owned || [],
    activeLunch: props.activeLunch,
    spinning: props.spinning,
    swaggerTier: props.swaggerTier,
  }), [
    props.char,
    props.character,
    props.owned,
    props.activeLunch,
    props.spinning,
    props.swaggerTier,
  ]);

  const wrapperStyle = {
    width: "100%",
    maxWidth: props.maxWidth || 280,
    display: "block",
    margin: "0 auto",
    transformOrigin: "150px 230px",
    animation: props.spinning
      ? "reeSpin360 1s cubic-bezier(.4,0,.6,1)"
      : "reeFloatBob 3.5s ease-in-out infinite",
  };

  return (
    <svg
      viewBox={model.viewBox}
      style={wrapperStyle}
      role="img"
      aria-label={`${model.traits.char?.name || "Character"} avatar`}
    >
      <style>{SVG_STYLE}</style>
      <defs>
        {model.defs.map(renderDef)}
      </defs>
      {model.layers.map(renderLayer)}
    </svg>
  );
}
