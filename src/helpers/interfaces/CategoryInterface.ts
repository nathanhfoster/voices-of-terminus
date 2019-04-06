import Permission from "../classes/Permission";
interface CategoryInterface {
  pushPermissions: (permission: Permission) => void;
  getCode: (name: string) => Number;
  getName: (code: any) => any;
}
export default CategoryInterface;
