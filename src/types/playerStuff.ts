export enum Gamemode {
    creative,
    survival,
    adventure,
    spectator
}

export type Effects =
    | 'absorption'
    | 'bad_omen'
    | 'blindness'
    | 'conduit_power'
    | 'darkness'
    | 'fatal_poison'
    | 'fire_resistance'
    | 'haste'
    | 'health_boost'
    | 'hunger'
    | 'instant_damage'
    | 'instant_health'
    | 'invisibility'
    | 'jump_boost'
    | 'levitation'
    | 'mining_fatigue'
    | 'nausea'
    | 'night_vision'
    | 'poison'
    | 'regeneration'
    | 'resistance'
    | 'saturation'
    | 'slow_falling'
    | 'slowness'
    | 'speed'
    | 'strength'
    | 'village_hero'
    | 'water_breathing'
    | 'weakness'
    | 'wither';

export type Dimensions = 'overworld' | 'nether' | 'the end';

export type titleTypes = 'actionbar' | 'title';
