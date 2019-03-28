export const UserHasPermissions = (Admin, User, Conditions) => {
  const {
    AllUserGroups,
    AllUserPermissions
  } = Admin.AuthenticationAndAuthorization;
  const { groups, user_permissions } = User;
  const UserPermissions = AllUserPermissions.filter(e =>
    user_permissions.includes(e.id)
  );
  console.log(UserPermissions);
};
