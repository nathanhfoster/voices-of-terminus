import PermissionInterface from "../interfaces/PermissionInterface";
class Permission implements PermissionInterface {
  id: number;
  name: string;
  codename: string;
  content_type: string;
  constructor(permission: any) {
    const { id, name, codename, content_type } = permission;
    this.id = id;
    this.name = name;
    this.codename = codename;
    this.content_type = content_type;
  }

  getCategory = () => this.codename.split("_")[0];
  getHeader = () => this.getCategory().toUpperCase();
  getTitle = () =>
    this.name
      .split(" ")
      .splice(2)
      .map((e: String) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
}

export default Permission;
