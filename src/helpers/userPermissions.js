import { ReduxStore } from "../index";

const filterPermissionsConditions = [
  // "view",
  "comment",
  "character",
  "choice",
  "content",
  "like",
  "group",
  "recipient",
  "response",
  "entry",
  "message",
  "image",
  "note",
  "session",
  "setting",
  "status",
  "ticket",
  "token",
  "permission",
  "question"
]



const filterUserPermissions = AllUserPermissions =>
  AllUserPermissions.filter(permission =>
    !filterPermissionsConditions.some(condition =>
      permission.codename.includes(condition)))


const permissionShortName = name => name.split(" ").splice(1).join(" ");

const statusLevelInt = User => {
  if (!User) return 0;
  const {
    id,
    is_superuser,
    is_staff,
    is_moderator,
    is_leader,
    is_advisor,
    is_council,
    is_general_officer,
    is_officer,
    is_senior_member,
    is_junior_member,
    is_recruit
  } = User;

  if (is_superuser) return 11;
  if (is_staff) return 10;
  if (is_moderator) return 9;
  if (is_leader) return 8;
  if (is_advisor) return 7;
  if (is_council) return 6;
  if (is_general_officer) return 5;
  if (is_officer) return 4;
  if (is_senior_member) return 3;
  if (is_junior_member) return 2;
  if (is_recruit) return 1;
  return 0;
};

const statusLevelString = status => {
  switch (status) {
    case 11:
      return "Super Admin";
    case 10:
      return "Admin";
    case 9:
      return "Moderator";
    case 8:
      return "Leader";
    case 7:
      return "Advisor";
    case 6:
      return "Council";
    case 5:
      return "General Officer";
    case 4:
      return "Officer";
    case 3:
      return "Senior Member";
    case 2:
      return "Junior Member";
    case 1:
      return "Recruit";
    default:
      return "Guest";
  }
};

const UserHasPermissions = (User, Codename, AuthorId, OtherUser) => {
  const {
    AllUserGroups,
    AllUserPermissions
  } = ReduxStore.getState().AuthenticationAndAuthorization;
  const loggedInUserStatus = statusLevelInt(User);
  const otherUserStatus = statusLevelInt(OtherUser);
  const { groups, user_permissions } = User;

  if (!User) return false;
  if (User.is_superuser) return true;

  if (User.id === AuthorId) return true;
  if (loggedInUserStatus > otherUserStatus) return true;

  if (
    AllUserGroups === null ||
    user_permissions === null ||
    AllUserPermissions.length < 1 ||
    (groups.length < 1 && user_permissions.length < 1)
  )
    return false;

  let GroupsMap = {};

  for (let i = 0; i < AllUserGroups.length; i++) {
    const { id, permissions } = AllUserGroups[i];
    GroupsMap[id] = permissions;
  }

  let PermissionMap = {};

  for (let i = 0; i < AllUserPermissions.length; i++) {
    const { id, codename } = AllUserPermissions[i];
    PermissionMap[id] = codename;
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const groupPermissions = GroupsMap[group] ? GroupsMap[group] : [];
    for (let i = 0; i < groupPermissions.length; i++) {
      const permission = groupPermissions[i];
      if (PermissionMap[permission] === Codename) return true;
    }
  }

  for (let i = 0; i < user_permissions.length; i++) {
    const permission = user_permissions[i];
    if (PermissionMap[permission] === Codename) return true;
  }
  return false;
};

const CategorizedPermissions = AllUserPermissions => {
  const CategorizedPermissions = ["add", "view", "change", "delete"];
  return CategorizedPermissions.map(c =>
    AllUserPermissions.filter(e => e.codename.split("_")[0] === c)
  );
};

const PermissionTitle = name =>
  name
    .split(" ")
    .splice(2)
    .map(e => e.charAt(0).toUpperCase() + e.slice(1))
    .join(" ");

const PermissionHeader = name => name.split("_")[0].toUpperCase();

/*
0: "add_article"
1: "add_articlecomment"
2: "add_articlelikes"
3: "add_character"
4: "add_contenttype"
5: "add_event"
6: "add_eventgroup"
7: "add_eventgroupmember"
8: "add_gallery"
9: "add_galleryimages"
10: "add_group"
11: "add_logentry"
12: "add_message"
13: "add_messagerecipient"
14: "add_newsletter"
15: "add_newslettercomment"
16: "add_newsletterlikes"
17: "add_note"
18: "add_permission"
19: "add_form"
20: "add_pollchoice"
21: "add_pollquestion"
22: "add_pollrecipient"
23: "add_pollresponse"
24: "add_session"
25: "add_setting"
26: "add_statuschange"
27: "add_ticket"
28: "add_token"
29: "add_user"
30: "add_usergroup"
31: "change_article"
32: "change_articlecomment"
33: "change_articlelikes"
34: "change_character"
35: "change_contenttype"
36: "change_event"
37: "change_eventgroup"
38: "change_eventgroupmember"
39: "change_gallery"
40: "change_galleryimages"
41: "change_group"
42: "change_logentry"
43: "change_message"
44: "change_messagerecipient"
45: "change_newsletter"
46: "change_newslettercomment"
47: "change_newsletterlikes"
48: "change_note"
49: "change_permission"
50: "change_form"
51: "change_pollchoice"
52: "change_pollquestion"
53: "change_pollrecipient"
54: "change_pollresponse"
55: "change_session"
56: "change_setting"
57: "change_statuschange"
58: "change_ticket"
59: "change_token"
60: "change_user"
61: "change_usergroup"
62: "delete_article"
63: "delete_articlecomment"
64: "delete_articlelikes"
65: "delete_character"
66: "delete_contenttype"
67: "delete_event"
68: "delete_eventgroup"
69: "delete_eventgroupmember"
70: "delete_gallery"
71: "delete_galleryimages"
72: "delete_group"
73: "delete_logentry"
74: "delete_message"
75: "delete_messagerecipient"
76: "delete_newsletter"
77: "delete_newslettercomment"
78: "delete_newsletterlikes"
79: "delete_note"
80: "delete_permission"
81: "delete_form"
82: "delete_pollchoice"
83: "delete_pollquestion"
84: "delete_pollrecipient"
85: "delete_pollresponse"
86: "delete_session"
87: "delete_setting"
88: "delete_statuschange"
89: "delete_ticket"
90: "delete_token"
91: "delete_user"
92: "delete_usergroup"
93: "view_article"
94: "view_articlecomment"
95: "view_articlelikes"
96: "view_character"
97: "view_contenttype"
98: "view_event"
99: "view_eventgroup"
100: "view_eventgroupmember"
101: "view_gallery"
102: "view_galleryimages"
103: "view_group"
104: "view_logentry"
105: "view_message"
106: "view_messagerecipient"
107: "view_newsletter"
108: "view_newslettercomment"
109: "view_newsletterlikes"
110: "view_note"
111: "view_permission"
112: "view_poll"
113: "view_pollchoice"
114: "view_pollquestion"
115: "view_pollrecipient"
116: "view_pollresponse"
117: "view_session"
118: "view_setting"
119: "view_statuschange"
120: "view_ticket"
121: "view_token"
122: "view_user"
123: "view_usergroup"
*/

export {
  filterUserPermissions,
  permissionShortName,
  statusLevelInt,
  statusLevelString,
  UserHasPermissions,
  CategorizedPermissions,
  PermissionTitle,
  PermissionHeader
};
