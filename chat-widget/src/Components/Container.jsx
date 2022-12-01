export default function Container(props) {
  return (
    <div className={`w-full ${props?.className}`}>
      {props.children}
    </div>
  );
}
