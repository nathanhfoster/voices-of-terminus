import { isSubset } from "./index";
import { UserHasPermissionTo } from "./AuthenticationAndAuthorization";

export const UserHasPermissions = (
  AuthenticationAndAuthorization,
  User,
  Conditions
) => {
  let { AllUserGroups, AllUserPermissions } = AuthenticationAndAuthorization;
  const H = new UserHasPermissionTo(AllUserPermissions);
  console.log(H);
  console.log(H.Add.getCode("Article"));
  //console.log(AllUserPermissions);
  AllUserPermissions = AllUserPermissions.sort((a, b) => a.id - b.id);
  const { groups, user_permissions } = User;
  if (
    AllUserPermissions == null ||
    user_permissions == null ||
    AllUserPermissions.length < 1 ||
    user_permissions.length < 1
  )
    return false;
  const HasPermissionInUserGroups = AllUserGroups.filter(e =>
    groups.includes(e.id)
  )
    .map(e => e.permissions)
    .flat(1)
    .map(i =>
      AllUserPermissions[
        AllUserPermissions.findIndex(p => p.id == i)
      ].codename.split("_")
    )
    .some(permission => isSubset(permission, Conditions));
  //console.log(HasPermissionInUserGroups);
  //.filter(permission => isSubset(permission, Conditions));
  //console.log(AllUserPermissions);
  const UserPermissions = AllUserPermissions.filter(e =>
    user_permissions.includes(e.id)
  )
    .map(p => p.codename.split("_"))
    .filter(permission => isSubset(permission, Conditions));
  //console.log(UserPermissions, Conditions);

  return (
    User.is_superuser || HasPermissionInUserGroups || UserPermissions.length > 0
  );
};

export const CategorizedPermissions = AllUserPermissions => {
  const CategorizedPermissions = ["add", "view", "change", "delete"];
  return CategorizedPermissions.map(c =>
    AllUserPermissions.filter(e => e.codename.split("_")[0] == c)
  );
};

export const PermissionTitle = name =>
  name
    .split(" ")
    .splice(2)
    .map(e => e.charAt(0).toUpperCase() + e.slice(1))
    .join(" ");

export const PermissionHeader = name => name.split("_")[0].toUpperCase();
