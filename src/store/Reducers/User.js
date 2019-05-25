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

  is_superuser: null,
  is_staff: null,
  is_moderator: null,
  is_leader: null,
  is_advisor: null,
  is_council: null,
  is_general_officer: null,
  is_officer: null,
  is_senior_member: null,
  is_junior_member: null,
  is_recruit: null,

  is_raid_leader: null,
  is_banker: null,
  is_recruiter: null,
  is_class_lead: null,
  is_crafter_lead: null,
  is_host: null,
  is_lore_master: null,

  date_joined: null,
  discord_url: null,
  twitter_url: null,
  twitch_url: null,
  youtube_url: null,
  experience_points: null,
  guild_points: null,
  groups: [],
  user_permissions: [],
  Characters: [],
  Tickets: [],
  Settings: { show_footer: false, push_messages: false }
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
