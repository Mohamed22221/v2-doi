import { icons } from "./constant";
type TProps = {
  name: keyof typeof icons;
  className?: string;
};
function Icon({ name, className }: TProps) {
  return <div className={className}>{icons[name]}</div>;
}
export default Icon;
