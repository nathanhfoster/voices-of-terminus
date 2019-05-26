import C from "../../constants.js";

const defaultState = {
  token: null,
  id: null,
  profile_image: null,
  username: null,
  email: null,
  first_name: null,
  last_name: null,
  bio: null,
  is_active: null,
  last_login: null,
  opt_in: null,
  lfg: null,

  is_superuser: false,
  is_staff: false,
  is_moderator: false,
  is_leader: false,
  is_advisor: false,
  is_council: false,
  is_general_officer: false,
  is_officer: false,
  is_senior_member: false,
  is_junior_member: false,
  is_recruit: false,

  is_raid_leader: false,
  is_banker: false,
  is_recruiter: false,
  is_class_lead: false,
  is_crafter_lead: false,
  is_host: false,
  is_lore_master: false,

  date_joined: null,
  discord_url: null,
  twitter_url: null,
  twitch_url: null,
  youtube_url: null,
  experience_points: 0,
  guild_points: 0,
  groups: [],
  user_permissions: [],
  Characters: [],
  Tickets: [],
  Settings: { show_footer: true, push_messages: false }
};

export const User = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case C.SET_LOGIN_TOKEN:
      return { ...state, ...payload };
    case C.UPDATE_USER_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case C.UPDATE_USER_SUCCESS:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      };
    case C.CLEAR_USER_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null
      };
    case C.GET_CHARACTERS:
      return {
        ...state,
        Characters: payload
      };
    case C.GET_USER_TICKETS:
      return {
        ...state,
        Tickets: payload
      };
    case C.SET_USER_SETTINGS:
      return {
        ...state,
        Settings: payload
      };
    case C.SET_LOGOUT:
      return {
        groups: [],
        user_permissions: [],
        Characters: [],
        Settings: { show_footer: false, push_messages: false }
      };
    case C.RESET_REDUX:
      return defaultState;
    default:
      return { ...state };
  }
};
