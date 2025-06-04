import Icon from "@ant-design/icons";
import React from "react";

const DashboardSvg = () => (
  <svg
    width="1.5rem"
    height="1.5rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 7.5C20.3807 7.5 21.5 6.38071 21.5 5C21.5 3.61929 20.3807 2.5 19 2.5C17.6193 2.5 16.5 3.61929 16.5 5C16.5 6.38071 17.6193 7.5 19 7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M21.25 10V15.25C21.25 16.8413 20.6179 18.3674 19.4926 19.4926C18.3674 20.6179 16.8413 21.25 15.25 21.25H8.75C7.1587 21.25 5.63258 20.6179 4.50736 19.4926C3.38214 18.3674 2.75 16.8413 2.75 15.25V8.75C2.75 7.1587 3.38214 5.63258 4.50736 4.50736C5.63258 3.38214 7.1587 2.75 8.75 2.75H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7.26953 15.045L9.47453 12.111C9.60956 11.9304 9.80751 11.807 10.0292 11.7653C10.2509 11.7236 10.4801 11.7667 10.6715 11.886L12.8225 13.245C13.0213 13.3716 13.2618 13.4152 13.4923 13.3664C13.7229 13.3176 13.9251 13.1803 14.0555 12.984L16.2695 9.64404"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardIcon = (props) => <Icon component={DashboardSvg} {...props} />;

export default DashboardIcon;
