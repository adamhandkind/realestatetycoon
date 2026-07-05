/* ============================================================
   REAL ESTATE EMPIRE — CharacterAvatarPhaser
   ------------------------------------------------------------
   React wrapper around the Phaser character generator.

   The game still owns state in React. Phaser now owns the visual
   character stage, animation loop, canvas renderer, and future
   sprite pipeline.
   ============================================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createAvatarModel, getVisibleCosmeticSlots } from "./avatarEngine.v3.js";
import CharacterAvatarFallback from "./CharacterAvatarWeb.v3.jsx";
import { PHASER_AVATAR_SIZE } from "./phaser/avatarConstants.js";

function modelSignature(model) {
  const slots = getVisibleCosmeticSlots(model);
  return JSON.stringify({
    slots,
    mood: model.traits.mood,
    pose: model.traits.pose,
    tier: model.traits.swaggerTier,
    stats: model.traits.stats,
    lunch: model.traits.activeLunch,
  });
}

export default function CharacterAvatarPhaser(props) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const pendingModelRef = useRef(null);
  const [phaserUnavailable, setPhaserUnavailable] = useState(false);

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

  const signature = useMemo(() => modelSignature(model), [model]);

  const handlePhaserError = useCallback((error) => {
    console.error("Phaser avatar failed to render:", error);
    sceneRef.current = null;
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    setPhaserUnavailable(true);
  }, []);

  useEffect(() => {
    if (!hostRef.current || gameRef.current || phaserUnavailable) return undefined;

    let cancelled = false;

    async function startPhaser() {
      try {
        const { AvatarPhaserScene, createAvatarPhaserGame } = await import("./phaser/AvatarPhaserScene.js");

        if (cancelled || !hostRef.current || gameRef.current) return;

        const SceneClass = class RuntimeAvatarScene extends AvatarPhaserScene {
          create() {
            try {
              super.create();
              sceneRef.current = this;
              if (pendingModelRef.current) this.redraw(pendingModelRef.current);
            } catch (error) {
              handlePhaserError(error);
            }
          }
        };

        const game = createAvatarPhaserGame(hostRef.current, SceneClass);
        gameRef.current = game;

        requestAnimationFrame(() => {
          if (!cancelled && hostRef.current && !hostRef.current.querySelector("canvas")) {
            handlePhaserError(new Error("Phaser did not attach a canvas."));
          }
        });
      } catch (error) {
        if (!cancelled) handlePhaserError(error);
      }
    }

    startPhaser();

    return () => {
      cancelled = true;
      sceneRef.current = null;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [handlePhaserError, phaserUnavailable]);

  useEffect(() => {
    pendingModelRef.current = model;
    if (!sceneRef.current) return;

    try {
      sceneRef.current.redraw(model);
    } catch (error) {
      handlePhaserError(error);
    }
  }, [handlePhaserError, model, signature]);

  if (phaserUnavailable) {
    return <CharacterAvatarFallback {...props} maxWidth={props.maxWidth || 360} />;
  }

  const style = {
    "--ree-phaser-avatar-max-width": `${props.maxWidth || 360}px`,
  };

  const ariaName = model.traits.character?.name || "Real Estate Empire character";

  return (
    <div
      className="ree-phaser-avatar-shell"
      style={style}
      role="img"
      aria-label={`${ariaName}, ${model.traits.swaggerTier}, ${model.traits.mood} mood, ${model.traits.pose} pose`}
    >
      <div
        ref={hostRef}
        className="ree-phaser-avatar-stage"
        style={{ aspectRatio: `${PHASER_AVATAR_SIZE.width} / ${PHASER_AVATAR_SIZE.height}` }}
      />
      <div className="ree-phaser-avatar-caption">
        <span>{model.traits.pose.replaceAll("_", " ")}</span>
        <span>{model.traits.scene.replaceAll("_", " ")}</span>
      </div>
    </div>
  );
}
