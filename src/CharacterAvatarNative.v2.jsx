/* ============================================================
   REAL ESTATE EMPIRE — CharacterAvatarNative v2
   ------------------------------------------------------------
   React Native SVG renderer for avatarEngine.v2.js.

   Dependencies:
     npm install react-native-svg

   Optional:
     Use React Native Animated around this component for spin/bob.
   ============================================================ */

import React, { useMemo } from "react";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Rect,
  Circle,
  Ellipse,
  Path,
  Line,
  Polygon,
  Text as SvgText,
} from "react-native-svg";
import { createAvatarModel } from "./avatarEngine.v2.js";

function cleanProps(props) {
  const out = {};
  Object.entries(props || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "value" || key === "animate" || key === "fontFamily") return;

    // React Native SVG uses camelCase for many SVG props too.
    out[key] = value;
  });
  return out;
}

function renderDef(def) {
  const Cmp = def.type === "radialGradient" ? RadialGradient : LinearGradient;
  return (
    <Cmp key={def.id} id={def.id} {...cleanProps(def.props)}>
      {(def.stops || []).map((stop, i) => (
        <Stop key={i} {...stop} />
      ))}
    </Cmp>
  );
}

function renderLayer(layer) {
  const props = cleanProps(layer.props);
  const key = layer.id;

  if (layer.type === "g") {
    return (
      <G key={key} {...props}>
        {(layer.children || []).map(renderLayer)}
      </G>
    );
  }

  if (layer.type === "rect") return <Rect key={key} {...props} />;
  if (layer.type === "circle") return <Circle key={key} {...props} />;
  if (layer.type === "ellipse") return <Ellipse key={key} {...props} />;
  if (layer.type === "path") return <Path key={key} {...props} />;
  if (layer.type === "line") return <Line key={key} {...props} />;
  if (layer.type === "polygon") return <Polygon key={key} {...props} />;

  if (layer.type === "text") {
    return (
      <SvgText
        key={key}
        fontSize={props.fontSize}
        fill={props.fill}
        x={props.x}
        y={props.y}
        textAnchor={props.textAnchor || "middle"}
        fontWeight={props.fontWeight}
      >
        {layer.props?.value || ""}
      </SvgText>
    );
  }

  return null;
}

export default function CharacterAvatarNative(props) {
  const model = useMemo(() => createAvatarModel({
    character: props.char || props.character,
    owned: props.owned || [],
    activeLunch: props.activeLunch,
    swaggerTier: props.swaggerTier,
  }), [
    props.char,
    props.character,
    props.owned,
    props.activeLunch,
    props.swaggerTier,
  ]);

  const width = props.width || 280;
  const height = props.height || Math.round(width * (460 / 300));

  return (
    <Svg
      width={width}
      height={height}
      viewBox={model.viewBox}
      accessibilityLabel={`${model.traits.char?.name || "Character"} avatar`}
    >
      <Defs>
        {model.defs.map(renderDef)}
      </Defs>
      {model.layers.map(renderLayer)}
    </Svg>
  );
}
