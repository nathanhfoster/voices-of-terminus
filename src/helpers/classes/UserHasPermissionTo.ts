import Permission from "./Permission";
import Category from "./Category";

class UserHasPermissionTo {
  Add: Category;
  View: Category;
  Change: Category;
  Delete: Category;
  constructor(allUserPermissions: any) {
    this.Add = new Category();
    this.View = new Category();
    this.Change = new Category();
    this.Delete = new Category();
    const { length } = allUserPermissions;
    for (let i = 0; i < length; i++) {
      const permission = allUserPermissions[i];
      const codename = permission.codename.split("_")[0];
      if (codename === "add")
        this.Add.pushPermissions(new Permission(permission));
      if (codename === "view")
        this.View.pushPermissions(new Permission(permission));
      if (codename === "change")
        this.Change.pushPermissions(new Permission(permission));
      if (codename === "delete")
        this.Delete.pushPermissions(new Permission(permission));
    }
  }
}
export default UserHasPermissionTo;
