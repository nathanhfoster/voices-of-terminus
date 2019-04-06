import Permission from "./Permission";
import CategoryInterface from "../interfaces/CategoryInterface";

class Category implements CategoryInterface {
  Permissions: Array<Permission>;
  constructor() {
    this.Permissions = new Array();
  }
  pushPermissions = (permission: Permission) =>
    this.Permissions.push(permission);
  getCode = (name: String) => {
    const p = this.Permissions.findIndex(p => p.getTitle() == name);
    return p != -1 ? this.Permissions[p].id : p;
  };
  getName = (code: Number) => {
    const p = this.Permissions.findIndex(p => p.id == code);
    return p != -1 ? this.Permissions[p].getCategory() : p;
  };
}
export default Category;
