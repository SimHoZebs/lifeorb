import { Icon } from "@iconify/react";

const StatusButton = () => {
  return (
    <div className="flex flex-col gap-1 items-center">
      <Icon icon="entypo:chevron-up" className="h-6 w-6" />
      <div className="h-4 w-4 bg-purple-400 rounded-sm"></div>
      <Icon icon="entypo:chevron-down" className="h-6 w-6" />
    </div>
  );
};

export default StatusButton;