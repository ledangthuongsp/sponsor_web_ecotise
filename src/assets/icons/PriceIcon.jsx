import Icon from "@ant-design/icons";

const PriceSvg = () => (
  <svg
    width="1.5rem"
    height="1.5rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 10H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.833 11H18.231C16.446 11 15 12.343 15 14C15 15.657 16.447 17 18.23 17H20.833C20.917 17 20.958 17 20.993 16.998C21.533 16.965 21.963 16.566 21.998 16.065C22 16.033 22 15.994 22 15.917V12.083C22 12.006 22 11.967 21.998 11.935C21.962 11.434 21.533 11.035 20.993 11.002C20.958 11 20.917 11 20.833 11Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M20.965 11C20.887 9.128 20.637 7.98 19.828 7.172C18.657 6 16.771 6 13 6H10C6.229 6 4.343 6 3.172 7.172C2 8.343 2 10.229 2 14C2 17.771 2 19.657 3.172 20.828C4.343 22 6.229 22 10 22H13C16.771 22 18.657 22 19.828 20.828C20.637 20.02 20.888 18.872 20.965 17"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M6 6.00004L9.735 3.52304C10.2603 3.18138 10.8734 2.99951 11.5 2.99951C12.1266 2.99951 12.7397 3.18138 13.265 3.52304L17 6.00004"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17.9912 14H18.0012"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PriceIcon = (props) => <Icon component={PriceSvg} {...props} />;

export default PriceIcon;
