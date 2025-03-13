// https://stackoverflow.com/a/45887328
// It solves the 'cannot find module' error:
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
