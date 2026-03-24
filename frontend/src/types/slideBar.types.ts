export type MenuItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

export type MenuConfig = Record<string, Record<string, MenuItem[]>>;