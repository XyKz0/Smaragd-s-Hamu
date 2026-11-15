import officeBriefcaseImg from './images/act1_office_briefcase_1794753077398.jpg';
import femmeEmeraldImg from './images/act1_femme_emerald_1794753078728.jpg';
import alleyRainImg from './images/act1_alley_rain_1794753079394.jpg';
import speakeasyBoothImg from './images/act1_speakeasy_booth_1794753079197.jpg';
import streetSedanImg from './images/sincity_street_alley_1794751760186.jpg';
import morgueFilesImg from './images/act2_morgue_files_1794754085552.jpg';
import slaughterhouseMaeveImg from './images/act3_slaughterhouse_maeve_1794754086119.jpg';
import obsidianPenthouseImg from './images/act4_obsidian_penthouse_1794754088008.jpg';
import endingOfficeImg from './images/act5_ending_office_1794754088306.jpg';
import harborCustomsImg from './images/act2_harbor_customs_1794756422846.jpg';
import cemeteryCryptImg from './images/act2_cemetery_crypt_1794756423770.jpg';
import velvetDressingImg from './images/act2_velvet_dressing_1794756423546.jpg';
import chinatownTailorImg from './images/act3_chinatown_tailor_1794756424358.jpg';
import cityhallArchiveImg from './images/act3_cityhall_archive_1794756425083.jpg';
import suspensionBridgeImg from './images/act4_suspension_bridge_1794756424999.jpg';
import trainDepotImg from './images/act4_train_depot_1794756425707.jpg';

export const SCENE_IMAGES: Record<string, string> = {
  // Act I (22)
  start: officeBriefcaseImg,
  door_visitor: femmeEmeraldImg,
  fire_escape: alleyRainImg,
  act1_hallway_peephole: officeBriefcaseImg,
  act1_rooftop_chase: alleyRainImg,
  act1_rooftop_slip: alleyRainImg,
  act1_desk_drawer_trap: femmeEmeraldImg,
  act1_maeve_disarms: velvetDressingImg,
  office_bargain: femmeEmeraldImg,
  office_inspect_case: officeBriefcaseImg,
  hallway_bluff: officeBriefcaseImg,
  back_window_escape: streetSedanImg,
  act1_informant_booth: streetSedanImg,
  act1_booth_ambush: alleyRainImg,
  alley_ambush_observation: alleyRainImg,
  alley_tail_maeve: streetSedanImg,
  precinct_phone_check: officeBriefcaseImg,
  alley_shootout: alleyRainImg,
  alley_sewer_drop: streetSedanImg,
  docks_lead_choice: harborCustomsImg,
  precinct_bribe_eavesdrop: alleyRainImg,
  velvet_cellar_entry: speakeasyBoothImg,

  // Act II (26)
  act2_velvet_dressing_room: velvetDressingImg,
  act2_maeve_confession: velvetDressingImg,
  act2_dressing_ambush: velvetDressingImg,
  act2_sewer_cistern: alleyRainImg,
  act2_velvet_vip: speakeasyBoothImg,
  act2_velvet_poison_check: speakeasyBoothImg,
  act2_velvet_bar_brawl: speakeasyBoothImg,
  act2_velvet_drink_trap: speakeasyBoothImg,
  act2_velvet_backdoor: alleyRainImg,
  act2_tail_limo: streetSedanImg,
  act2_precinct_morgue: morgueFilesImg,
  act2_morgue_coroner: morgueFilesImg,
  act2_morgue_steal: morgueFilesImg,
  act2_morgue_eavesdrop: morgueFilesImg,
  act2_harbor_customs: harborCustomsImg,
  act2_customs_interrogation: harborCustomsImg,
  act2_pier_sniper_trap: harborCustomsImg,
  act2_harbor_warehouse: slaughterhouseMaeveImg,
  act2_warehouse_ledger_safe: harborCustomsImg,
  act2_warehouse_fire: harborCustomsImg,
  act2_dock_smuggler_boat: harborCustomsImg,
  act2_cemetery_gate: cemeteryCryptImg,
  act2_gravedigger_talk: cemeteryCryptImg,
  act2_cemetery_crypt: cemeteryCryptImg,
  act2_crypt_ambush: cemeteryCryptImg,
  act2_cemetery_dead_end: cemeteryCryptImg,

  // Act III (24)
  act3_chinatown_pawn: chinatownTailorImg,
  act3_pawn_backroom_safe: chinatownTailorImg,
  act3_chinatown_tailor: chinatownTailorImg,
  act3_opium_cellar: chinatownTailorImg,
  act3_chinatown_alley_ambush: chinatownTailorImg,
  act3_chinatown_dead_end: alleyRainImg,
  act3_cityhall_entry: cityhallArchiveImg,
  act3_cityhall_watchman_bribe: cityhallArchiveImg,
  act3_cityhall_archive: cityhallArchiveImg,
  act3_archive_alarm: cityhallArchiveImg,
  act3_cityhall_dead_end: cityhallArchiveImg,
  act3_rail_tunnel: alleyRainImg,
  act3_switchhouse_shelter: velvetDressingImg,
  act3_slaughterhouse_roof: slaughterhouseMaeveImg,
  act3_slaughterhouse_entry: slaughterhouseMaeveImg,
  act3_slaughterhouse_eavesdrop: slaughterhouseMaeveImg,
  act3_maeve_confrontation: slaughterhouseMaeveImg,
  act3_maeve_trust: slaughterhouseMaeveImg,
  act3_ambush_stand: alleyRainImg,
  act3_betray_maeve: slaughterhouseMaeveImg,
  act3_freezer_truce: slaughterhouseMaeveImg,
  act3_boiler_fight: slaughterhouseMaeveImg,
  act3_boiler_dead_end: slaughterhouseMaeveImg,
  act3_ambush_escape: streetSedanImg,

  // Act IV (15)
  act4_bridge_chase: suspensionBridgeImg,
  act4_bridge_barricade: suspensionBridgeImg,
  act4_bridge_dead_end: suspensionBridgeImg,
  act4_bridge_jump: suspensionBridgeImg,
  act4_train_depot: trainDepotImg,
  act4_depot_press_contact: trainDepotImg,
  act4_hotel_approach: obsidianPenthouseImg,
  act4_hotel_vent_shaft: obsidianPenthouseImg,
  act4_hotel_security: cityhallArchiveImg,
  act4_freight_elevator: obsidianPenthouseImg,
  act4_kitchen_skirmish: obsidianPenthouseImg,
  act4_elevator_trap: obsidianPenthouseImg,
  act4_stairwell_climb: obsidianPenthouseImg,
  act4_penthouse_hall: obsidianPenthouseImg,
  act4_penthouse_standoff: obsidianPenthouseImg,

  // Act V & Endings (13)
  act5_ask_too_much: obsidianPenthouseImg,
  act5_chaos_burn: obsidianPenthouseImg,
  act5_dirty_deal: obsidianPenthouseImg,
  act5_emerald_betrayal: femmeEmeraldImg,
  act5_press_leak_choice: cityhallArchiveImg,
  act5_press_raid: alleyRainImg,
  act5_press_dead_end: alleyRainImg,
  act5_depot_finale: trainDepotImg,
  act5_ending_river: streetSedanImg,
  act5_ending_betrayed_office: endingOfficeImg,
  act5_ending_system_wins: endingOfficeImg,
  act5_ending_press_ashes: endingOfficeImg,
  act5_ending_border_rain: trainDepotImg,
};
