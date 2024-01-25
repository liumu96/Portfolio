declare module "*.md";

declare interface IBlogParams {
  id?: string;
  date?: string;
  title?: string;
  comment?: string;
  tags?: string[];
  preview?: string;
}
