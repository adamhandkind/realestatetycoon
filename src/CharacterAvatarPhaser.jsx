/* ============================================================
   REAL ESTATE EMPIRE — CharacterAvatarPhaser
   ------------------------------------------------------------
   React wrapper around the Phaser character generator.

   The game still owns state in React. Phaser now owns the visual
   character stage, animation loop, canvas renderer, and future
   sprite pipeline.
   ============================================================ */

import React, { useEffect, useMemo, useRef } from "react";
import Phaser from "phaser";
import { createAvatarModel, getVisibleCosmeticSlots } from "./avatarEngine.v3.js";
import { AvatarPhaserScene, createPhaserConfig, PHASER_AVATAR_SIZE } from "./phaser/AvatarPhaserScene.js";

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

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return undefined;

    const SceneClass = class RuntimeAvatarScene extends AvatarPhaserScene {
      create() {
        super.create();
        sceneRef.current = this;
        if (pendingModelRef.current) this.redraw(pendingModelRef.current);
      }
    };

    const game = new Phaser.Game(createPhaserConfig(hostRef.current, SceneClass));
    gameRef.current = game;

    return () => {
      sceneRef.current = null;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    pendingModelRef.current = model;
    if (sceneRef.current) sceneRef.current.redraw(model);
  }, [model, signature]);

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
