export default function OneMoneyLogo({ ...props }) {
  return (
    <svg
      width="1em"
      height="1em"
      style={{ fontSize: "24px" }}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <path d="M0 0H25V12.5H0V0Z" fill="black" />
      <path d="M0 12.5H25V25H0V12.5Z" fill="#EE8422" />
    </svg>
  );
}
